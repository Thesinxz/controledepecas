import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { sendNotification } from '@/app/lib/push'

export async function POST(req: Request) {
    const authHeader = req.headers.get('Authorization')
    const CRON_SECRET = process.env.CRON_SECRET || 'local-dev-secret'

    // Simplistic auth for cron / internal use
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const { userId, payload } = await req.json()

        // Supabase service role to fetch subscriptions
        const supabase = await createClient() // You should ideally use service role client here

        const { data: subs, error } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', userId)

        if (error) throw error
        if (!subs || subs.length === 0) return new NextResponse('No subscriptions found', { status: 404 })

        const promises = subs.map(sub => sendNotification({
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth }
        }, JSON.stringify(payload)))

        await Promise.allSettled(promises)

        return new NextResponse('Notifications sent', { status: 200 })
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 })
    }
}
