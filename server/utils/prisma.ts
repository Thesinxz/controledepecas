import { createClient } from '@libsql/client'
import * as LibSQLAdapter from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

// Robust resolution for PrismaLibSQL class (ESM/CJS interop)
const PrismaLibSQL = (LibSQLAdapter as any).PrismaLibSQL || (LibSQLAdapter as any).default?.PrismaLibSQL

declare global {
  var prisma: PrismaClient | undefined
}

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

let prisma: PrismaClient

if (!globalThis.prisma) {
  try {
    if (url) {
      // Normalize URL for LibSQL client compatibility
      const targetUrl = url.replace('libsql://', 'https://')
      console.log(`[Nexus-Core] Initializing Client Bridge...`)
      console.log(`[Nexus-Core] URL: ${targetUrl}`)
      console.log(`[Nexus-Core] AuthToken: ${authToken ? 'SECURE_SET' : 'NOT_FOUND'}`)
      
      if (typeof PrismaLibSQL !== 'function') {
        throw new Error(`PrismaLibSQL resolution failed. Received: ${typeof PrismaLibSQL}`)
      }

      const client = createClient({
        url: targetUrl,
        authToken: authToken,
      })

      const adapter = new PrismaLibSQL(client)
      globalThis.prisma = new PrismaClient({ adapter })
      console.log('[Nexus-Core] Bridge Established Successfully')
    } else {
      console.log('[Nexus-Core] Dev Mode: SQLite Instance')
      globalThis.prisma = new PrismaClient()
    }
  } catch (err: any) {
    console.error('[Nexus-Core] FAILED to establish DB Bridge:', err.message)
    console.error(err.stack)
    // We let the error throw to cause a 500 but with detailed logs in Vercel
    throw err
  }
}

prisma = globalThis.prisma!

export { prisma }
