import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.partName || !body.model || !body.fromStore || !body.toStore || !body.employeeName || !body.expectedReturn) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  const loan = await prisma.loan.create({
    data: {
      partName: body.partName,
      model: body.model,
      brand: body.brand || '', // Added Marca
      fromStore: body.fromStore,
      toStore: body.toStore,
      employeeName: body.employeeName,
      expectedReturn: new Date(body.expectedReturn),
      loanDate: new Date(),
    },
  })

  return loan
})
