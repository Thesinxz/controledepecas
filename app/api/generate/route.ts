import { createClient } from '@/app/lib/supabase/server'
import { runAIPipeline } from '@/app/lib/ai/pipeline'
import { StoryGenerationOptions } from '@/app/types/ai'

export const maxDuration = 120 // 2 minutes timeout max for Vercel Hobby

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // Check quota
    const { data: profile } = await supabase.from('profiles').select('scripts_used_this_month, scripts_limit').eq('id', user.id).single()

    if (!profile || (profile.scripts_limit !== -1 && profile.scripts_used_this_month >= profile.scripts_limit)) {
        return new Response(JSON.stringify({ error: 'Quota exceeded' }), { status: 403 })
    }

    const body = await req.json()
    const options = body as StoryGenerationOptions

    // Set up SSE stream
    let controllerVar: ReadableStreamDefaultController | undefined
    const stream = new ReadableStream({
        start(controller) {
            controllerVar = controller
        }
    })

    const encoder = new TextEncoder()
    const sendEvent = (event: string, data: any) => {
        if (controllerVar) {
            controllerVar.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        }
    }

        // Run pipeline asynchronously so we can return the stream immediately
        ; (async () => {
            try {
                const results = await runAIPipeline(options, (step: number, status: string) => {
                    sendEvent('progress', { step, status })
                })

                sendEvent('progress', { step: 5, status: 'Salvando no banco de dados...' })

                // Create Script DB Entry
                const { data: script, error: scriptError } = await supabase.from('scripts').insert({
                    user_id: user.id,
                    title: `Roteiro: ${options.product || options.niche}`,
                    niche: options.niche,
                    goal: options.goal,
                    tone: options.tone,
                    product: options.product,
                    story_count: options.story_count,
                    status: 'completed',
                    briefing: results.briefing,
                    raw_script: results.raw_script,
                    refined_script: results.refined_script,
                    final_script: results.final_script,
                    ai_provider_used: results.usage.provider,
                    tokens_used: results.usage.total_tokens_input + results.usage.total_tokens_output,
                    generation_time_ms: results.usage.total_duration_ms
                }).select().single()

                if (scriptError || !script) throw new Error('Failed to save script')

                // Create Stories DB Entries
                const storiesArray = results.final_script?.stories ||
                    results.refined_script?.stories ||
                    results.raw_script?.stories || []

                if (storiesArray.length > 0) {
                    const storiesToInsert = storiesArray.map((s: any, idx: number) => ({
                        script_id: script.id,
                        position: s.position || idx + 1,
                        type: s.type || 'content',
                        main_text: s.main_text || '',
                        narration: s.narration || '',
                        visual_suggestion: s.visual_suggestion || '',
                        sticker_suggestion: s.sticker_suggestion || null,
                        duration_seconds: s.duration_seconds || 7,
                        background_color: s.background_color || '#1a1a2e'
                    }))

                    const { error: storiesError } = await supabase.from('stories').insert(storiesToInsert)
                    if (storiesError) {
                        console.error('Stories insert error:', storiesError)
                    }
                } else {
                    console.warn('No stories found in AI response to save')
                }

                // Increment Usage
                await supabase.rpc('increment_usage', { user_id: user.id })
                // Or manually update:
                await supabase.from('profiles').update({
                    scripts_used_this_month: profile.scripts_used_this_month + 1
                }).eq('id', user.id)

                sendEvent('complete', {
                    script_id: script.id,
                    data: results.final_script,
                    briefing: results.briefing
                })
                controllerVar?.close()
            } catch (e: any) {
                console.error(e)
                sendEvent('error', { message: e.message || 'Unknown error' })
                controllerVar?.close()
            }
        })()

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    })
}
