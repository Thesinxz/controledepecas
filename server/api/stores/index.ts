import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    return prisma.store.findMany({
      orderBy: { name: 'asc' },
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (!body.name) {
      throw createError({ statusCode: 400, statusMessage: 'Name required' })
    }
    return prisma.store.create({
      data: { 
        name: body.name,
        logo: body.logo // Base64
      },
    })
  }
})
