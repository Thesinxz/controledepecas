import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing loan ID',
    })
  }

  await prisma.loan.delete({
    where: { id: parseInt(id) },
  })

  return { success: true }
})
