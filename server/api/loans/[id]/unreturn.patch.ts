import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing loan ID',
    })
  }

  const loan = await prisma.loan.update({
    where: { id: parseInt(id) },
    data: {
      returnDate: null,
    },
  })

  return loan
})
