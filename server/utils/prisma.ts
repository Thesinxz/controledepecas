import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

declare global {
  var globalPrisma: PrismaClient | undefined
}

export const getPrisma = (): PrismaClient => {
  if (!globalThis.globalPrisma) {
    try {
      const url = process.env.TURSO_DATABASE_URL
      const authToken = process.env.TURSO_AUTH_TOKEN
      
      if (url) {
        const targetUrl = url.replace('libsql://', 'https://')
        console.log(`[Nexus-Core] Initializing Client Bridge... URL: ${targetUrl}`)
        
        const client = createClient({
          url: targetUrl,
          authToken: authToken,
        })

        const adapter = new PrismaLibSQL(client)
        globalThis.globalPrisma = new PrismaClient({ adapter })
      } else {
        console.log('[Nexus-Core] Dev Mode: SQLite Instance')
        globalThis.globalPrisma = new PrismaClient()
      }
    } catch (err: any) {
      console.error('[Nexus-Core] FAILED to establish DB Bridge:', err.message)
      throw new Error(`Prisma Init Failed: ${err.message} \nStack: ${err.stack}`)
    }
  }
  return globalThis.globalPrisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_, prop) => getPrisma()[prop as keyof PrismaClient]
})

export { prisma }
