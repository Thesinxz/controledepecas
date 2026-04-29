import { createClient } from '@libsql/client'
import * as pkg from '@prisma/adapter-libsql'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.TURSO_DATABASE_URL,
      hasToken: !!process.env.TURSO_AUTH_TOKEN,
      nodeEnv: process.env.NODE_ENV,
    },
    adapter: {
      pkgType: typeof pkg,
      hasPrismaLibSQL: !!((pkg as any).PrismaLibSQL || (pkg as any).default?.PrismaLibSQL),
    },
    prisma: {
      status: 'pending'
    }
  }

  try {
    // Basic connectivity check to Turso directly
    if (process.env.TURSO_DATABASE_URL) {
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://'),
        authToken: process.env.TURSO_AUTH_TOKEN
      })
      const rs = await client.execute('SELECT 1')
      diagnostics.tursoDirect = { status: 'ok', response: rs.rows[0] }
    }

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
