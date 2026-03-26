import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing loan ID',
    })
  }

  const loan = await prisma.loan.update({
    where: { id: parseInt(id) },
    data: {
      partName: body.partName,
      model: body.model,
      brand: body.brand || '', // Added Marca
      fromStore: body.fromStore,
      toStore: body.toStore,
      employeeName: body.employeeName,
      expectedReturn: body.expectedReturn ? new Date(body.expectedReturn) : undefined,
    },
  })

  return loan
})
