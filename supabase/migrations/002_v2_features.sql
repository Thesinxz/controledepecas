-- ═══════════════════════════════════════════
-- StoryAI — Database Schema v2.0
-- New Features: Push, Scheduling, Visuals, Adaptations, Admin
-- ═══════════════════════════════════════════

-- 1. Admin Role
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Push Subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own push subscriptions" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- 3. Scheduled Posts
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their scheduled posts" ON public.scheduled_posts FOR ALL USING (auth.uid() = user_id);

-- 4. Story Visuals
CREATE TABLE IF NOT EXISTS public.story_visuals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    background_type TEXT DEFAULT 'solid', -- solid, gradient, none
    background_color TEXT DEFAULT '#080810',
    background_gradient TEXT,
    text_color TEXT DEFAULT '#FFFFFF',
    font_size INTEGER DEFAULT 32,
    font_family TEXT DEFAULT 'System',
    text_position TEXT DEFAULT 'center', -- top, center, bottom
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.story_visuals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their story visuals" ON public.story_visuals FOR ALL USING (auth.uid() = user_id);

-- 5. Script Adaptations
CREATE TABLE IF NOT EXISTS public.script_adaptations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.script_adaptations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their script adaptations" ON public.script_adaptations FOR ALL USING (auth.uid() = user_id);

-- 6. Admin Metrics (Snapshot table for daily metrics)
CREATE TABLE IF NOT EXISTS public.admin_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    total_users INTEGER DEFAULT 0,
    mrr_usd NUMERIC DEFAULT 0,
    active_today INTEGER DEFAULT 0,
    scripts_generated INTEGER DEFAULT 0,
    ai_cost_usd NUMERIC DEFAULT 0,
    free_users INTEGER DEFAULT 0,
    pro_users INTEGER DEFAULT 0,
    business_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Only admins can read admin_metrics
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view metrics" ON public.admin_metrics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Force row level security check for admin_metrics insertions via functions/service role
