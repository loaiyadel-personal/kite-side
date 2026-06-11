import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, Prisma } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { sendCourseInquiryNotification } from '../services/email/emailService'

const prisma = new PrismaClient()

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

const InquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(200),
  phone: z.string().max(30).optional(),
  courseId: z.string().max(50).optional(),
  level: z.string().max(50).optional(),
  preferredDates: z.string().max(200).optional(),
  howHeard: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
})

const CourseSchema = z.object({
  level: z.enum(['DISCOVERY', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'IKO_CERTIFICATION', 'INSTRUCTOR']),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  outcome: z.string().max(300).optional(),
  durationHours: z.number().int().positive(),
  maxStudents: z.number().int().positive(),
  priceEGP: z.number().positive(),
  priceUSD: z.number().positive().optional(),
  includes: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
})

// ── Public ────────────────────────────────────────────────────────────────────

export async function getCourses(_req: Request, res: Response) {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  })
  res.json(courses)
}

export async function getCourse(req: Request, res: Response) {
  const course = await prisma.course.findFirst({
    where: { id: req.params.id, isPublished: true },
  })
  if (!course) return res.status(404).json({ error: 'Course not found' })
  res.json(course)
}

export async function submitInquiry(req: Request, res: Response) {
  const parsed = InquirySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid form data', details: parsed.error.flatten() })
  }
  const d = parsed.data

  const inquiry = await prisma.courseInquiry.create({
    data: {
      name: sanitize(d.name),
      email: sanitize(d.email),
      phone: d.phone ? sanitize(d.phone) : null,
      courseId: d.courseId || null,
      level: d.level ? sanitize(d.level) : null,
      preferredDates: d.preferredDates ? sanitize(d.preferredDates) : null,
      howHeard: d.howHeard ? sanitize(d.howHeard) : null,
      message: d.message ? sanitize(d.message) : null,
    },
  })

  sendCourseInquiryNotification(inquiry).catch(() => {})

  return res.json({ success: true, message: "We'll contact you within 24 hours!" })
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function createCourse(req: AuthRequest, res: Response) {
  const parsed = CourseSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
  }
  const { priceEGP, priceUSD, ...rest } = parsed.data
  const course = await prisma.course.create({
    data: {
      ...rest,
      priceEGP: new Prisma.Decimal(priceEGP),
      priceUSD: priceUSD != null ? new Prisma.Decimal(priceUSD) : null,
    },
  })
  res.status(201).json(course)
}

export async function updateCourse(req: AuthRequest, res: Response) {
  const parsed = CourseSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
  }
  const { priceEGP, priceUSD, ...rest } = parsed.data
  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(priceEGP != null && { priceEGP: new Prisma.Decimal(priceEGP) }),
      ...(priceUSD != null && { priceUSD: new Prisma.Decimal(priceUSD) }),
    },
  })
  res.json(course)
}

export async function togglePublish(req: AuthRequest, res: Response) {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } })
  if (!course) return res.status(404).json({ error: 'Course not found' })
  const updated = await prisma.course.update({
    where: { id: req.params.id },
    data: { isPublished: !course.isPublished },
  })
  res.json(updated)
}

export async function deleteCourse(req: AuthRequest, res: Response) {
  const inquiryCount = await prisma.courseInquiry.count({ where: { courseId: req.params.id } })
  if (inquiryCount > 0) {
    return res.status(409).json({ error: 'Cannot delete a course that has linked inquiries' })
  }
  await prisma.course.delete({ where: { id: req.params.id } })
  res.json({ success: true })
}

export async function getInquiries(req: AuthRequest, res: Response) {
  const status = req.query.status as string | undefined
  const inquiries = await prisma.courseInquiry.findMany({
    where: status ? { status: status as any } : undefined,
    include: { course: { select: { name: true, level: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(inquiries)
}

export async function updateInquiryStatus(req: AuthRequest, res: Response) {
  const StatusSchema = z.object({ status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED']) })
  const parsed = StatusSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid status' })
  const inquiry = await prisma.courseInquiry.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
  })
  res.json(inquiry)
}
