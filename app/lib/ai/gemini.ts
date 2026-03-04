import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export async function generateWithGemini(
    systemPrompt: string,
    userPrompt: string,
    model = 'gemini-2.5-flash-lite',
    temperature = 0.7,
    maxTokens = 3000
) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined')
    }

    const generativeModel = genAI.getGenerativeModel({
        model,
        generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            responseMimeType: 'application/json',
        },
        systemInstruction: systemPrompt
    })

    const startTime = Date.now()
    const result = await generativeModel.generateContent(userPrompt)
    const duration_ms = Date.now() - startTime

    let responseText = result.response.text()

    // Clean up markdown code blocks if present
    if (responseText.includes('```json')) {
        responseText = responseText.split('```json')[1].split('```')[0].trim()
    } else if (responseText.includes('```')) {
        responseText = responseText.split('```')[1].split('```')[0].trim()
    }

    try {
        const data = JSON.parse(responseText)
        return {
            data,
            tokens_input: result.response.usageMetadata?.promptTokenCount || 0,
            tokens_output: result.response.usageMetadata?.candidatesTokenCount || 0,
            duration_ms,
            model_used: model,
        }
    } catch (e) {
        console.error('Failed to parse Gemini response as JSON:', responseText)
        throw new Error('Invalid JSON response from Gemini')
    }
}
