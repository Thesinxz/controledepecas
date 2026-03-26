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
    console.log('[Prisma] Initializing with LibSQL Adapter')
    const libsql = createClient({
      url: url,
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
