import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/app/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    // Use service role to bypass RLS in webhook
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const session = event.data.object as any

    switch (event.type) {
        case 'checkout.session.completed':
            if (session.payment_status === 'paid') {
                const customerId = session.customer
                const userId = session.client_reference_id
                const subscriptionId = session.subscription

                // Retrieve subscription to check plan
                const subscription: any = await stripe.subscriptions.retrieve(subscriptionId as string)
                const priceId = subscription.items.data[0].price.id

                let plan = 'free'
                let limit = 10
                if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
                    plan = 'pro'
                    limit = 100
                } else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) {
                    plan = 'business'
                    limit = -1 // unlimited
                }

                // 1. Save subscription
                await supabase.from('subscriptions').insert({
                    user_id: userId,
                    stripe_subscription_id: subscriptionId,
                    stripe_price_id: priceId,
                    plan,
                    status: subscription.status,
                    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                })

                // 2. Update profile
                await supabase.from('profiles').update({
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    plan,
                    scripts_limit: limit,
                }).eq('id', userId)
            }
            break

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object as any
            const stripeSubId = subscription.id

            const priceId = subscription.items.data[0].price.id
            let plan = 'free'
            let limit = 10
            if (priceId === process.env.STRIPE_PRO_PRICE_ID && subscription.status === 'active') {
                plan = 'pro'
                limit = 100
            } else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID && subscription.status === 'active') {
                plan = 'business'
                limit = -1
            }

            await supabase.from('subscriptions').update({
                status: subscription.status,
                plan,
                stripe_price_id: priceId,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end
            }).eq('stripe_subscription_id', stripeSubId)

            // Get user ID from subscription record
            const { data: sub } = await supabase.from('subscriptions').select('user_id').eq('stripe_subscription_id', stripeSubId).single()

            if (sub?.user_id) {
                await supabase.from('profiles').update({
                    plan,
                    scripts_limit: limit,
                }).eq('id', sub.user_id)
            }
            break
    }

    return new NextResponse(null, { status: 200 })
}
