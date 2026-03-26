import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

// Use a global variable to prevent multiple instances
declare global {
  var prisma: PrismaClient | undefined
}

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

let prisma: PrismaClient

if (!globalThis.prisma) {
  if (url) {
    // Normalization for serverless environments (prefer https for fetch compatibility)
    const normalizedUrl = url.replace('libsql://', 'https://')
    console.log(`[Prisma] Initializing with Turso: ${normalizedUrl}`)
    const libsql = createClient({
      url: normalizedUrl,
      authToken: authToken,
    })
    const adapter = new PrismaLibSQL(libsql)
    globalThis.prisma = new PrismaClient({ adapter })
  } else {
    console.log('[Prisma] Initializing with local SQLite')
    globalThis.prisma = new PrismaClient()
  }
}

prisma = globalThis.prisma!

export { prisma }
