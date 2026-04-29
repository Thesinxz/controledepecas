import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  try {
    if (method === 'GET') {
      return await prisma.store.findMany({
        orderBy: { name: 'asc' },
      })
    }

    if (method === 'POST') {
      const body = await readBody(event)
      if (!body.name) {
        throw createError({ statusCode: 400, statusMessage: 'Name required' })
      }
      return await prisma.store.create({
        data: { 
          name: body.name,
          logo: body.logo // Base64
        },
      })
    }
  } catch (err) {
    console.error('[API Stores Error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database Error: ${err instanceof Error ? err.message : String(err)}`,
    })
  }
})
