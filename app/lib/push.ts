import webpush from 'web-push'

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const privateVapidKey = process.env.VAPID_PRIVATE_KEY!
const email = process.env.VAPID_EMAIL!

webpush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey)

export async function sendNotification(subscription: webpush.PushSubscription, payload: string) {
    try {
        await webpush.sendNotification(subscription, payload)
    } catch (error) {
        console.error('Error sending push notification', error)
        throw error
    }
}
