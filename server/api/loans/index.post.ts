import { prisma } from '../../utils/prisma'
import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.partName || !body.fromStore || !body.toStore || !body.employeeName || !body.expectedReturn) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields (partName, fromStore, toStore, employeeName, expectedReturn)',
    })
  }

  const loan = await prisma.loan.create({
    data: {
      partName: body.partName,
      model: body.model,
      brand: body.brand || '', // Added Marca
      fromStore: body.fromStore,
      toStore: body.toStore,
      employeeName: body.employeeName,
      expectedReturn: new Date(body.expectedReturn),
      loanDate: new Date(),
    },
  })

  // Try to send push notifications
  try {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:admin@localhost',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      )

      const subscriptions = await prisma.pushSubscription.findMany()
      const payload = JSON.stringify({
        title: 'Nova Peça em Movimento! 📦',
        body: `${loan.partName} retirada por ${loan.employeeName} (${loan.fromStore} ➡️ ${loan.toStore})`,
        url: '/'
      })

      // Send notifications asynchronously
      Promise.all(subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth }
          }, payload)
        } catch (err: any) {
          // If subscription is gone, delete it
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
        }
      }))
    }
  } catch (e) {
    console.error('Push notification error', e)
  }

  return loan
})
