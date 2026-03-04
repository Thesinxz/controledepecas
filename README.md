# StoryAI

Mobile-first Instagram Stories AI assistant. Generates complete story scripts using a 4-agent AI pipeline. 

## 🚀 Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions concepts via Next.js API Routes)
- **AI Integration**: Google Gemini 2.5 Flash / Anthropic Claude Haiku (4-step orchestration architecture)
- **Payments**: Stripe

## 📦 File Structure

- `app/api/...`: Next.js REST and SSE endpoints for AI Generation and Webhooks.
- `app/components/...`: Shared UI components (shadcn ui + layout).
- `app/lib/...`: Utilities (Supabase client, AI pipeline, Stripe).
- `app/types/...`: TS Definitions for DB and AI.
- `supabase/migrations/...`: SQL Migrations.

## ⚙️ Getting Started

1. Clone or clone the repository locally.
2. Ensure you have `pnpm` installed.
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Configure `.env.local` based on `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_AI_PROVIDER=gemini # or anthropic
   GEMINI_API_KEY=...
   ANTHROPIC_API_KEY=...
   STRIPE_SECRET_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_PRO_PRICE_ID=...
   STRIPE_BUSINESS_PRICE_ID=...
   ```
5. Apply Database Migrations:
   Take the SQL found in `supabase/migrations/001_initial_schema.sql` and run it on your Supabase SQL Editor.
6. Setup Supabase Auth:
   Enable Email/Password (Magic Links) and Google OAuth in Supabase Dashboard.
7. Run the development server:
   ```bash
   pnpm dev
   ```

## 🧠 AI Pipeline (4-Agents)

The pipeline is located in `app/lib/ai/pipeline.ts`.
1. **Briefing Agent**: Parses input and generates JSON context.
2. **Scriptwriter Agent**: Structures the sequence of stories.
3. **Copywriter Agent**: Polishes words and adds mental triggers.
4. **Reviewer Agent**: Validates lengths, constraints, and platform guidelines.

## 💰 Stripe Configuration

Ensure you create two products in Stripe:
1. **Pro**: R$ 29/mo (Limits: 100 scripts) -> Map Price ID to `STRIPE_PRO_PRICE_ID`
2. **Business**: R$ 79/mo (Limits: Unlimited scripts) -> Map Price ID to `STRIPE_BUSINESS_PRICE_ID`

Point the webhook in the Stripe Developer Dashboard to `<your_app_url>/api/webhooks/stripe` listening to `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.

## 🏗️ Build & Deployment

Deploys automatically via Vercel:
```bash
vercel
```
Ensure you add the Environment Variables in the Vercel Dashboard BEFORE compiling.
