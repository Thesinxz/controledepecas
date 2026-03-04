import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const { subscription } = await req.json()

        if (!subscription || !subscription.endpoint) {
            return new NextResponse('Invalid subscription', { status: 400 })
        }

        // Upsert subscription
        const { error } = await supabase.from('push_subscriptions').upsert({
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
        }, { onConflict: 'user_id, endpoint' })

        if (error) throw error

        return new NextResponse('Subscribed successfully', { status: 200 })
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
