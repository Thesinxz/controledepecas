import { generateWithGemini } from './gemini'
import { generateWithClaude } from './claude'
import { StoryGenerationOptions, BriefingOutput, ScriptwriterOutput, CopywriterOutput, ReviewerOutput } from '@/app/types/ai'

const getProvider = () => process.env.NEXT_PUBLIC_AI_PROVIDER || 'gemini'

// Helper to route to correct provider
async function generate(system: string, user: string, temp: number, maxTokens: number) {
    const provider = getProvider()
    if (provider === 'anthropic') {
        return generateWithClaude(system, user, 'claude-3-5-haiku-latest', temp, maxTokens)
    }
    return generateWithGemini(system, user, 'gemini-2.5-flash-lite', temp, maxTokens)
}

export async function runAIPipeline(options: StoryGenerationOptions, onProgress?: (step: number, status: string) => void) {
    const results = {
        briefing: null as any,
        raw_script: null as any,
        refined_script: null as any,
        final_script: null as any,
        usage: {
            provider: getProvider(),
            total_tokens_input: 0,
            total_tokens_output: 0,
            total_duration_ms: 0,
        }
    }

    const trackUsage = (res: any) => {
        results.usage.total_tokens_input += res.tokens_input
        results.usage.total_tokens_output += res.tokens_output
        results.usage.total_duration_ms += res.duration_ms
    }

    try {
        // STEP 1: Briefing Agent
        if (onProgress) onProgress(1, 'Analisando briefing e contexto...')
        const briefingSystem = "You are a content strategist for Instagram Stories. Parse user data and return structured briefing JSON. ALL output text in Brazilian Portuguese."
        const briefingUser = `Niche: ${options.niche}. Goal: ${options.goal}. Audience: ${options.audience}. Tone: ${options.tone}. Product: ${options.product}. Stories: ${options.story_count}.`
        const briefingRes = await generate(briefingSystem, briefingUser, 0.7, 1000)
        trackUsage(briefingRes)
        results.briefing = briefingRes.data

        // STEP 2: Scriptwriter Agent
        if (onProgress) onProgress(2, 'Estruturando roteiro das histórias...')
        const writerSystem = "You are a master storyteller for Instagram Stories. Structure: hook -> content -> CTA. Each story: main_text (max 15 words PT-BR), narration (20-30 words PT-BR), visual, duration, background_color. Return JSON with 'stories' array."
        const writerUser = `Briefing: ${JSON.stringify(results.briefing)}. Create ${options.story_count} stories.`
        const writerRes = await generate(writerSystem, writerUser, 0.85, 3000)
        trackUsage(writerRes)
        results.raw_script = writerRes.data

        // STEP 3: Copywriter Agent
        if (onProgress) onProgress(3, 'Aplicando gatilhos mentais e conversão...')
        const copySystem = "Expert conversion copywriter. Enhance script with mental triggers (urgency, social proof, authority). Max 2 emojis/story. Forbidden words in PT: incrível, fantástico, revolucionário. Return JSON with updated 'stories' array."
        const copyUser = `Enhance: ${JSON.stringify(results.raw_script)}. Briefing: ${JSON.stringify(results.briefing)}.`
        const copyRes = await generate(copySystem, copyUser, 0.9, 3000)
        trackUsage(copyRes)
        results.refined_script = copyRes.data

        // STEP 4: Reviewer Agent
        if (onProgress) onProgress(4, 'Revisão final e formatação...')
        const reviewSystem = "Senior Instagram editor. Check: narrative coherence, mobile readability (max 15 words), single CTA in last story, Instagram guidelines. Return JSON with 'approved' boolean, 'corrections' array if any, and final 'stories' array."
        const reviewUser = `Review: ${JSON.stringify(results.refined_script)}. Niche: ${options.niche}. Tone: ${options.tone}.`
        const reviewRes = await generate(reviewSystem, reviewUser, 0.3, 3000)
        trackUsage(reviewRes)
        results.final_script = (reviewRes.data as ReviewerOutput).stories ? reviewRes.data : results.refined_script // fallback

        return results

    } catch (error) {
        console.error('Pipeline Error:', error)
        throw error
    }
}
