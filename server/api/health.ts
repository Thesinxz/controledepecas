import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
    },
    prisma: {
      status: 'pending'
    }
  }

  try {
    // Prisma check
    const count = await prisma.loan.count()
    diagnostics.prisma = { status: 'ok', count }
  } catch (err: any) {
    diagnostics.error = {
      message: err.message,
      stack: err.stack?.split('\n').slice(0, 3)
    }
    diagnostics.prisma.status = 'failed'
  }

  return diagnostics
})
