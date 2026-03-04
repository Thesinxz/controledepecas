import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY || ''
const anthropic = new Anthropic({
    apiKey,
})

export async function generateWithClaude(
    systemPrompt: string,
    userPrompt: string,
    model = 'claude-3-5-haiku-latest',
    temperature = 0.7,
    maxTokens = 3000
) {
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not defined')
    }

    const startTime = Date.now()
    const msg = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: userPrompt,
            },
            {
                role: 'assistant',
                content: '{',
            }
        ],
    })
    const duration_ms = Date.now() - startTime

    // Prepend the { we injected
    const responseText = '{' + (msg.content[0].type === 'text' ? msg.content[0].text : '')

    try {
        const data = JSON.parse(responseText)
        return {
            data,
            tokens_input: msg.usage.input_tokens,
            tokens_output: msg.usage.output_tokens,
            duration_ms,
            model_used: model,
        }
    } catch (e) {
        console.error('Failed to parse Claude response as JSON:', responseText)
        throw new Error('Invalid JSON response from Claude')
    }
}
