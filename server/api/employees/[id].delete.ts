import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })
  
  await prisma.employee.delete({
    where: { id: parseInt(id) },
  })
  return { success: true }
})
