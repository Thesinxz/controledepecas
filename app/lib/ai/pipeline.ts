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
        // STEP 1: Briefing & Strategy Agent (Estrategista de Conteúdo)
        if (onProgress) onProgress(1, 'Analisando briefing e definindo estratégia...')
        const briefingSystem = `Você é um Estrategista de Conteúdo Digital sênior especializado em Instagram Stories. 
        Sua função é transformar um briefing bruto em uma estratégia de conversão sólida.
        Pense como um assistente de marketing que está planejando uma sequência vencedora.
        Considere gatilhos mentais, jornada do usuário e quebra de padrão.
        
        RETORNE SEMPRE UM JSON estruturado. Texto em Português do Brasil (PT-BR).`

        const briefingUser = `Briefing Bruto:
        - Produto/Oferta: ${options.product}
        - Objetivo Principal: ${options.goal}
        - Público-alvo: ${options.audience}
        - Tom de voz: ${options.tone}
        - Nicho: ${options.niche}
        - Quantidade de Stories: ${options.story_count}

        Defina a linha editorial para essa sequência e extraia os pontos-chave de valor.`

        const briefingRes = await generate(briefingSystem, briefingUser, 0.7, 1000)
        trackUsage(briefingRes)
        results.briefing = briefingRes.data
        if (onProgress) onProgress(1.5, 'Estratégia definida. Iniciando criação...')

        // STEP 2: Creative & Storytelling Agent (Diretor de Criação)
        if (onProgress) onProgress(2, 'Desenhando a narrativa e roteiro visual...')
        const writerSystem = `Você é um Diretor de Criação e Roteirista especializado em Stories de alta retenção.
        Sua missão é criar uma narrativa que prenda a atenção do início ao fim usando a estrutura: 
        GANCHO (Problema/Desejo) -> CONTEÚDO (Solução/Valor) -> CTA (Ação Clara).
        
        REGRAS DE OURO:
        - Texto na Tela (main_text): Máximo 12-15 palavras por story. Impactante.
        - Narração/Fala (narration): Linguagem natural, de pessoa para pessoa. 20-25 segundos de fala.
        - Sugestão Visual: Descreva o que filmar ou mostrar (ex: "Fundo com produto", "POV no escritório", "Selfie falando").
        
        Retorne um JSON com o campo 'stories' sendo um array de objetos conforme o Briefing Estratégico fornecido.`

        const writerUser = `Estratégia do Marketing: ${JSON.stringify(results.briefing)}.
        Crie uma sequência de ${options.story_count} stories focada em ${options.goal}.`

        const writerRes = await generate(writerSystem, writerUser, 0.85, 3000)
        trackUsage(writerRes)
        results.raw_script = writerRes.data

        // STEP 3: Elite Copywriting Agent (Copywriter de Conversão)
        if (onProgress) onProgress(3, 'Refinando a copy com gatilhos de conversão...')
        const copySystem = `Você é um Copywriter de Elite. Seu trabalho é pegar o roteiro bruto e adicionar "tempero" de vendas.
        Use gatilhos de Escassez, Urgência, Autoridade ou Prova Social onde fizer sentido.
        Remova clichês de marketing amador (evite palavras como "incrível", "fantástico").
        Ajuste o ritmo da leitura para que cada story flua naturalmente para o próximo.
        
        Mantenha a estrutura JSON e atualize o texto na tela e narração.`

        const copyUser = `Refine este roteiro: ${JSON.stringify(results.raw_script)}.
        Lembre-se do objetivo: ${options.goal} e público: ${options.audience}.`

        const copyRes = await generate(copySystem, copyUser, 0.9, 3000)
        trackUsage(copyRes)
        results.refined_script = copyRes.data

        // STEP 4: High-Retention Reviewer (Editor de Engajamento)
        if (onProgress) onProgress(4, 'Revisão final: Retenção e Alinhamento...')
        const reviewSystem = `Você é um Editor Sênior de Social Media. Sua revisão foca em:
        1. COERÊNCIA: A história faz sentido? O fluxo é lógico?
        2. RETENÇÃO: O gancho é forte o suficiente?
        3. READABILITY: O texto na tela é curto o suficiente para ser lido em 15s?
        4. INSTAGRAM RULES: O CTA final está claro e direto?
        
        Gere o JSON final com 'approved': true/false, 'corrections' (lista de ajustes feitos) e o array 'stories' final.`

        const reviewUser = `Revisão Crítica do Roteiro: ${JSON.stringify(results.refined_script)}.
        Assegure que o tom de voz "${options.tone}" foi respeitado.`

        const reviewRes = await generate(reviewSystem, reviewUser, 0.3, 3000)
        trackUsage(reviewRes)
        results.final_script = (reviewRes.data as any).stories ? reviewRes.data : results.refined_script // fallback

        return results

    } catch (error) {
        console.error('Pipeline Error:', error)
        throw error
    }
}
