-- ═══════════════════════════════════════════
-- StoryAI — Database Schema v1.0
-- Supabase (PostgreSQL) · RLS enabled
-- ═══════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id                      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username                text UNIQUE,
  full_name               text,
  avatar_url              text,
  niche                   text,
  default_tone            text DEFAULT 'informal',
  plan                    text DEFAULT 'free' CHECK (plan IN ('free','pro','business')),
  scripts_used_this_month integer DEFAULT 0,
  scripts_limit           integer DEFAULT 10,
  stripe_customer_id      text UNIQUE,
  stripe_subscription_id  text,
  onboarding_completed    boolean DEFAULT false,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. SCRIPTS
CREATE TABLE public.scripts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title              text NOT NULL,
  niche              text,
  goal               text,
  tone               text,
  product            text,
  story_count        integer,
  status             text DEFAULT 'draft' CHECK (status IN ('draft','completed','archived')),
  briefing           jsonb,
  raw_script         jsonb,
  refined_script     jsonb,
  final_script       jsonb,
  ai_provider_used   text,
  tokens_used        integer,
  cost_usd           numeric(10,6),
  generation_time_ms integer,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own scripts" ON public.scripts FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_scripts_user_id    ON public.scripts(user_id);
CREATE INDEX idx_scripts_created_at ON public.scripts(created_at DESC);
CREATE INDEX idx_scripts_niche      ON public.scripts(niche);

-- 3. STORIES
CREATE TABLE public.stories (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id          uuid REFERENCES public.scripts(id) ON DELETE CASCADE,
  position           integer NOT NULL,
  type               text CHECK (type IN ('hook','content','proof','question','cta','transition')),
  main_text          text,
  narration          text,
  visual_suggestion  text,
  sticker_suggestion text,
  duration_seconds   integer DEFAULT 7,
  background_color   text DEFAULT '#1a1a2e',
  created_at         timestamptz DEFAULT now()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own stories" ON public.stories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.scripts WHERE id = script_id AND user_id = auth.uid()));

-- 4. TEMPLATES
CREATE TABLE public.templates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  niche         text NOT NULL,
  goal          text,
  tone          text,
  preview_text  text,
  story_count   integer,
  template_data jsonb NOT NULL,
  is_premium    boolean DEFAULT false,
  use_count     integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read templates" ON public.templates FOR SELECT USING (true);

-- 5. SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id   text UNIQUE NOT NULL,
  stripe_price_id          text,
  plan                     text,
  status                   text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean DEFAULT false,
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 6. USAGE_LOGS
CREATE TABLE public.usage_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES public.profiles(id),
  script_id     uuid REFERENCES public.scripts(id),
  agent_step    integer,
  agent_name    text,
  model_used    text,
  tokens_input  integer,
  tokens_output integer,
  cost_usd      numeric(10,6),
  duration_ms   integer,
  success       boolean DEFAULT true,
  error_message text,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own usage" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);

-- 7. WAITLIST
CREATE TABLE public.waitlist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  niche      text,
  source     text DEFAULT 'landing',
  converted  boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Reset monthly usage counter (run via cron or pg_cron)
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET scripts_used_this_month = 0;
END;
$$;
