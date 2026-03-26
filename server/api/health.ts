import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const stores = await prisma.store.count()
    return { status: 'ok', stores }
  } catch (err) {
    return { status: 'error', message: err.message, stack: err.stack }
  }
})
