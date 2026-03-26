import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    return prisma.employee.findMany({
      orderBy: { name: 'asc' },
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (!body.name) {
      throw createError({ statusCode: 400, statusMessage: 'Name required' })
    }
    return prisma.employee.create({
      data: { 
        name: body.name,
        storeId: body.storeId ? parseInt(body.storeId) : null
      },
    })
  }
})
