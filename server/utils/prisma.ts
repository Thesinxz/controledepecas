import { PrismaClient } from '@prisma/client'

declare global {
  var globalPrisma: PrismaClient | undefined
}

export const getPrisma = (): PrismaClient => {
  if (!globalThis.globalPrisma) {
    try {
      console.log('[Nexus-Core] Initializing PostgreSQL Client...')
      globalThis.globalPrisma = new PrismaClient()
    } catch (err: any) {
      console.error('[Nexus-Core] FAILED to establish DB Connection:', err.message)
      throw new Error(`Prisma Init Failed: ${err.message} \nStack: ${err.stack}`)
    }
  }
  return globalThis.globalPrisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_, prop) => getPrisma()[prop as keyof PrismaClient]
})
