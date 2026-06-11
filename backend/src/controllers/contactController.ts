import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { sendContactConfirmation, sendAdminNotification, sendAdminReply } from '../services/email/emailService'
import { z } from 'zod'

const prisma = new PrismaClient()

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().max(30).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
  website: z.string().optional(), // honeypot — bots fill this, humans don't
})

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED']),
})

const replySchema = z.object({
  replyText: z.string().min(10).max(5000),
})

export async function submitContact(req: Request, res: Response) {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
  }
  const { website, name, email, phone, subject, message } = parsed.data

  // Honeypot: silently accept but do nothing
  if (website) {
    return res.json({ message: "Message received! We'll get back to you within 24 hours." })
  }

  const submission = await prisma.contactSubmission.create({
    data: {
      name:    sanitize(name),
      email:   sanitize(email),
      phone:   phone ? sanitize(phone) : null,
      subject: sanitize(subject),
      message: sanitize(message),
    },
  })

  sendContactConfirmation(email, name).catch(() => {})
  sendAdminNotification(submission).catch(() => {})

  return res.json({ message: "Message received! We'll get back to you within 24 hours." })
}

export async function getSubmissions(req: Request, res: Response) {
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>
  const where = status ? { status: status as any } : {}
  const [items, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.contactSubmission.count({ where }),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
}

export async function updateStatus(req: Request, res: Response) {
  const { id } = req.params
  const parsed = updateStatusSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid status' })
  const item = await prisma.contactSubmission.update({ where: { id }, data: { status: parsed.data.status } })
  res.json(item)
}

export async function replyToSubmission(req: Request, res: Response) {
  const { id } = req.params
  const parsed = replySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Reply text must be at least 10 characters' })
  const submission = await prisma.contactSubmission.findUniqueOrThrow({ where: { id } })
  await sendAdminReply(submission.email, submission.name, parsed.data.replyText)
  await prisma.contactSubmission.update({
    where: { id },
    data: { status: 'REPLIED', repliedAt: new Date() },
  })
  res.json({ message: 'Reply sent' })
}
