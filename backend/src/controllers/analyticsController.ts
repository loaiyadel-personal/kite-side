import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { subDays, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

const trackSchema = z.object({
  path: z.string().max(500),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(128),
})

function getDeviceType(ua: string = ''): string {
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}

export async function trackPageView(req: Request, res: Response) {
  const { path, referrer, sessionId } = trackSchema.parse(req.body)
  await prisma.pageView.create({
    data: {
      path,
      referrer,
      userAgent: req.headers['user-agent'],
      deviceType: getDeviceType(req.headers['user-agent']),
      sessionId,
    }
  })
  res.status(204).end()
}

export async function getDashboardStats(req: Request, res: Response) {
  const days = Number(req.query.days) || 30
  const since = startOfDay(subDays(new Date(), days))

  const [totalViews, uniqueSessions, topPages, deviceBreakdown, dailyViews, contactCount] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.groupBy({ by: ['sessionId'], where: { createdAt: { gte: since } } }).then(r => r.length),
    prisma.pageView.groupBy({
      by: ['path'], _count: { path: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['deviceType'], _count: { deviceType: true },
      where: { createdAt: { gte: since } },
    }),
    // daily views for chart
    prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as views
      FROM "PageView"
      WHERE created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    prisma.contactSubmission.count({ where: { createdAt: { gte: since } } }),
  ])

  res.json({ totalViews, uniqueSessions, topPages, deviceBreakdown, dailyViews, contactCount, days })
}
