import { generateWithGemini } from './gemini'

export async function adaptScript(originalScriptText: string, platform: string, provider: 'gemini' | 'anthropic' = 'gemini') {
    const rules: Record<string, string> = {
        'tiktok': 'Conversational, trend-focused, 60s max, hooks in first 3s, use trending audio suggestions, casual tone.',
        'reels': 'Visual-first, fast cuts, text overlays, 30-60s, similar to TikTok but slightly more polished.',
        'linkedin': 'Professional tone, insight-driven, no emojis except sparingly, value proposition clear, 1500 char max.',
        'twitter': 'Thread format, each tweet max 280 chars, hook in first tweet, numbered 1/N, conversational.'
    }

    const platformRule = rules[platform] || 'Adapt the script for the requested platform.'

    const prompt = `You are a social media content adapter. Take the following Instagram Stories script and adapt it for **${platform}** following its specific rules.

Platform Rules: ${platformRule}

Output MUST be in Brazilian Portuguese.
Return the adapted content STRICTLY as a valid JSON object matching this structure:
{
  "title": "Title for this adapted piece",
  "content": "The actual full text/thread/script adapted for the platform",
  "tips": ["Tip 1", "Tip 2"]
}

Original Script:
${originalScriptText}`

    const systemInstruction = 'You are an expert social media adapter. Output only valid JSON.'

    if (provider === 'gemini') {
        const result = await generateWithGemini(systemInstruction, prompt)
        return result.data
    } else {
        // Fallback to Gemini if Anthropic is not implemented
        const result = await generateWithGemini(systemInstruction, prompt)
        return result.data
    }
}
