import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthRequest, tokenBlocklist } from '../middleware/auth'

const prisma = new PrismaClient()

const loginSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(1).max(128),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword:     z.string().min(8).max(100).regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Password must be at least 8 characters with one uppercase letter and one number',
  }),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

function extractToken(req: Request): string | null {
  return req.headers.authorization?.split(' ')[1] ?? null
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid username or password' })

  const { username, password } = parsed.data
  const admin = await prisma.adminUser.findUnique({ where: { username } })

  if (!admin) return res.status(401).json({ error: 'Invalid username or password' })

  if (!admin.isActive) return res.status(403).json({ error: 'Account deactivated. Contact admin.' })

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    const t = admin.lockedUntil.toLocaleTimeString('en-EG', { hour: '2-digit', minute: '2-digit' })
    return res.status(403).json({ error: `Account locked. Try again after ${t}` })
  }

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) {
    const attempts = admin.failedLoginAttempts + 1
    if (attempts >= 5) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data:  { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + 30 * 60 * 1000) },
      })
      return res.status(403).json({ error: 'Too many failed attempts. Account locked for 30 minutes.' })
    }
    await prisma.adminUser.update({ where: { id: admin.id }, data: { failedLoginAttempts: attempts } })
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data:  { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  })

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as `${number}${'s'|'m'|'h'|'d'}` }
  )

  res.json({
    token,
    admin: { id: admin.id, username: admin.username, name: admin.name, role: admin.role, lastLoginAt: admin.lastLoginAt },
  })
}

export async function logout(req: AuthRequest, res: Response) {
  const token = extractToken(req)
  if (token) tokenBlocklist.add(token)
  res.json({ message: 'Logged out' })
}

export async function me(req: AuthRequest, res: Response) {
  const admin = await prisma.adminUser.findUnique({
    where:  { id: req.admin!.id },
    select: { id: true, username: true, name: true, role: true, lastLoginAt: true },
  })
  if (!admin) return res.status(404).json({ error: 'Not found' })
  res.json(admin)
}

export async function changePassword(req: AuthRequest, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { currentPassword, newPassword } = parsed.data
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } })
  if (!admin) return res.status(404).json({ error: 'Not found' })

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!valid) return res.status(400).json({ error: 'Current password is incorrect' })

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash: hash } })

  const token = extractToken(req)
  if (token) tokenBlocklist.add(token)

  res.json({ message: 'Password updated. Please log in again.' })
}
