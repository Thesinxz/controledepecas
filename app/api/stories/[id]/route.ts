import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH - Update a single story's text, narration, visual, etc.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()

    // Verify the story belongs to the user
    const { data: story } = await supabase
        .from('stories')
        .select('id, script_id')
        .eq('id', params.id)
        .single()

    if (!story) return new NextResponse('Story not found', { status: 404 })

    const { data: script } = await supabase
        .from('scripts')
        .select('user_id')
        .eq('id', story.script_id)
        .eq('user_id', user.id)
        .single()

    if (!script) return new NextResponse('Forbidden', { status: 403 })

    // Allow updating story fields
    const allowedFields = ['main_text', 'narration', 'visual_suggestion', 'sticker_suggestion', 'duration_seconds', 'background_color', 'type']
    const updateData: Record<string, any> = {}
    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            updateData[key] = body[key]
        }
    }

    const { data, error } = await supabase
        .from('stories')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json(data)
}
