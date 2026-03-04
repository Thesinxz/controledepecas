export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    niche: string | null
                    default_tone: string | null
                    plan: string | null
                    scripts_used_this_month: number | null
                    scripts_limit: number | null
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    onboarding_completed: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    [key: string]: any
                }
                Update: {
                    id?: string
                    [key: string]: any
                }
            }
            scripts: {
                Row: {
                    id: string
                    user_id: string | null
                    title: string
                    niche: string | null
                    goal: string | null
                    tone: string | null
                    product: string | null
                    story_count: number | null
                    status: string | null
                    briefing: Json | null
                    raw_script: Json | null
                    refined_script: Json | null
                    final_script: Json | null
                    ai_provider_used: string | null
                    tokens_used: number | null
                    cost_usd: number | null
                    generation_time_ms: number | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    title: string
                    [key: string]: any
                }
                Update: {
                    id?: string
                    [key: string]: any
                }
            }
            stories: {
                Row: {
                    id: string
                    script_id: string | null
                    position: number
                    type: string | null
                    main_text: string | null
                    narration: string | null
                    visual_suggestion: string | null
                    sticker_suggestion: string | null
                    duration_seconds: number | null
                    background_color: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    position: number
                    [key: string]: any
                }
                Update: {
                    id?: string
                    [key: string]: any
                }
            }
            templates: {
                Row: {
                    id: string
                    name: string
                    niche: string
                    goal: string | null
                    tone: string | null
                    preview_text: string | null
                    story_count: number | null
                    template_data: Json
                    is_premium: boolean | null
                    use_count: number | null
                    created_at: string | null
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string | null
                    stripe_subscription_id: string
                    stripe_price_id: string | null
                    plan: string | null
                    status: string | null
                    current_period_start: string | null
                    current_period_end: string | null
                    cancel_at_period_end: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
            }
            usage_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    script_id: string | null
                    agent_step: number | null
                    agent_name: string | null
                    model_used: string | null
                    tokens_input: number | null
                    tokens_output: number | null
                    cost_usd: number | null
                    duration_ms: number | null
                    success: boolean | null
                    error_message: string | null
                    created_at: string | null
                }
            }
            waitlist: {
                Row: {
                    id: string
                    email: string
                    niche: string | null
                    source: string | null
                    converted: boolean | null
                    created_at: string | null
                }
            }
        }
    }
}
