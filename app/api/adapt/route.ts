import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { adaptScript } from '@/app/lib/ai/adapter-agent'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const { scriptId, platform } = await req.json()

        const { data: stories } = await supabase.from('stories').select('*').eq('script_id', scriptId).order('position', { ascending: true })
        if (!stories || stories.length === 0) return new NextResponse('Stories not found', { status: 404 })

        const originalText = stories.map(s => `[${s.type}] ${s.main_text} | Narration: ${s.narration}`).join('\n')

        const provider = process.env.NEXT_PUBLIC_AI_PROVIDER === 'anthropic' ? 'anthropic' : 'gemini'

        const adaptedJson = await adaptScript(originalText, platform, provider)

        const { data, error } = await supabase.from('script_adaptations').insert({
            user_id: user.id,
            original_script_id: scriptId,
            platform,
            content: adaptedJson
        }).select().single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
