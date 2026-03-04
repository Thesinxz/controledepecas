import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const { scriptId, platform, scheduled_for } = await req.json()

        if (!scriptId || !platform || !scheduled_for) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const { error } = await supabase.from('scheduled_posts').insert({
            user_id: user.id,
            script_id: scriptId,
            platform,
            scheduled_for
        })

        if (error) throw error

        return new NextResponse('Scheduled successfully', { status: 200 })
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
