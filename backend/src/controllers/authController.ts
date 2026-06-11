import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
})

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin || !admin.isActive) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as `${number}${'s'|'m'|'h'|'d'}` }
  )
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } })
}

export async function me(req: AuthRequest, res: Response) {
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, email: true, name: true, role: true, lastLoginAt: true }
  })
  res.json(admin)
}

export async function changePassword(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } })
  if (!admin) return res.status(404).json({ error: 'Not found' })

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!valid) return res.status(400).json({ error: 'Current password incorrect' })

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash: hash } })
  res.json({ message: 'Password updated' })
}
