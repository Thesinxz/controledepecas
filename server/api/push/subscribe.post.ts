import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid subscription data' })
  }

  const existing = await prisma.pushSubscription.findUnique({
    where: { endpoint: body.endpoint }
  })

  if (existing) {
    return { success: true, message: 'Already subscribed' }
  }

  await prisma.pushSubscription.create({
    data: {
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth
    }
  })

  return { success: true }
})
