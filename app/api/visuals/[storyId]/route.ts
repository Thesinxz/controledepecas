import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(req: Request, { params }: { params: { storyId: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data, error } = await supabase
        .from('story_visuals')
        .select('*')
        .eq('story_id', params.storyId)
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(data || null)
}

export async function POST(req: Request, { params }: { params: { storyId: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const body = await req.json()

        const { data, error } = await supabase
            .from('story_visuals')
            .upsert({
                story_id: params.storyId,
                user_id: user.id,
                ...body,
                updated_at: new Date().toISOString()
            }, { onConflict: 'story_id' })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
