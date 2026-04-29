import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = query.search as string
  const filter = query.filter as string

  const where: any = {}

  if (search) {
    where.OR = [
      { partName: { contains: search } },
      { model: { contains: search } },
      { employeeName: { contains: search } },
    ]
  }

  const today = new Date()

  if (filter === 'pending') {
    where.returnDate = null
    where.expectedReturn = { gte: today }
  } else if (filter === 'overdue') {
    where.returnDate = null
    where.expectedReturn = { lt: today }
  } else if (filter === 'returned') {
    where.returnDate = { not: null }
  }

  try {
    const [loans, stats] = await Promise.all([
      prisma.loan.findMany({
        where,
        orderBy: { loanDate: 'desc' },
      }),
      prisma.$transaction([
        prisma.loan.count(), // Total
        prisma.loan.count({ where: { returnDate: null, expectedReturn: { gte: today } } }), // Pending
        prisma.loan.count({ where: { returnDate: null, expectedReturn: { lt: today } } }), // Overdue
        prisma.loan.count({ where: { returnDate: { not: null } } }), // Returned
      ])
    ])

    return {
      loans,
      stats: {
        total: stats[0],
        pending: stats[1],
        overdue: stats[2],
        returned: stats[3],
      }
    }
  } catch (err: any) {
    return {
      error: true,
      message: err.message,
      stack: err.stack
    }
  }
})
