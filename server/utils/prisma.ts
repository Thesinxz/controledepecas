import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

let prismaInstance: PrismaClient

if (url) {
  const libsql = createClient({
    url: url,
    authToken: authToken,
  })
  const adapter = new PrismaLibSQL(libsql)
  prismaInstance = new PrismaClient({ adapter })
} else {
  // Local development fallback
  prismaInstance = new PrismaClient()
}

export const prisma = prismaInstance
