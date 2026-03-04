export interface StoryGenerationOptions {
    niche: string
    goal: string
    audience: string
    tone: string
    product: string
    story_count: number
}

export interface BriefingOutput {
    niche: string
    goal: string
    audience: string
    tone: string
    product: string
    story_count: number
    key_messages?: string[]
    visual_style?: string
    editorial_line?: string
    strategy_summary?: string
    [key: string]: any
}

export interface StoryElement {
    position: number
    type: 'hook' | 'content' | 'proof' | 'question' | 'cta' | 'transition'
    main_text: string
    narration: string
    visual_suggestion: string
    sticker_suggestion?: string
    duration_seconds: number
    background_color: string
}

export interface ScriptwriterOutput {
    stories: StoryElement[]
}

export interface CopywriterOutput {
    stories: StoryElement[]
}

export interface ReviewerOutput {
    approved: boolean
    corrections?: string[]
    stories: StoryElement[]
}

export interface AgentResponse<T> {
    data: T
    tokens_input: number
    tokens_output: number
    duration_ms: number
    model_used: string
}
