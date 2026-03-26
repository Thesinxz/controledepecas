import { createClient } from '@libsql/client'
import pkg from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

// Robust CJS/ESM interop for PrismaLibSQL
const PrismaLibSQL = (pkg as any).PrismaLibSQL || (pkg as any).default?.PrismaLibSQL

declare global {
  var prisma: PrismaClient | undefined
}

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

let prisma: PrismaClient

if (!globalThis.prisma) {
  if (url) {
    const normalizedUrl = url.replace('libsql://', 'https://')
    console.log(`[Nexus] Initializing Cloud DB: ${normalizedUrl}`)
    
    // Safety check for the class
    if (!PrismaLibSQL) {
      throw new Error('[Nexus] Failed to load PrismaLibSQL adapter. Check deployment chunks.')
    }

    const libsql = createClient({
      url: normalizedUrl,
      authToken: authToken,
    })
    const adapter = new PrismaLibSQL(libsql)
    globalThis.prisma = new PrismaClient({ adapter })
  } else {
    console.log('[Nexus] Initializing Local Dev DB')
    globalThis.prisma = new PrismaClient()
  }
}

prisma = globalThis.prisma!

export { prisma }
