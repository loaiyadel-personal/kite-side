import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthRequest, tokenBlocklist } from '../middleware/auth'
import crypto from 'crypto'

const prisma = new PrismaClient()

function sanitize(str: string) { return str.replace(/<[^>]*>/g, '').trim() }

const usernameRule = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores')
const passwordRule = z.string().min(8).max(100).regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, 'Must contain uppercase and number')

const createUserSchema = z.object({
  username: usernameRule,
  name:     z.string().min(1).max(100),
  email:    z.string().email().optional().or(z.literal('')).transform(v => v || undefined),
  role:     z.enum(['SUPER_ADMIN', 'EDITOR']),
  password: passwordRule,
})

const updateUserSchema = z.object({
  name:     z.string().min(1).max(100).optional(),
  email:    z.string().email().optional().or(z.literal('')).transform(v => v || undefined),
  role:     z.enum(['SUPER_ADMIN', 'EDITOR']).optional(),
  isActive: z.boolean().optional(),
})

const settingsSchema = z.object({
  whatsapp:      z.string().min(1).max(30).optional(),
  phone:         z.string().min(1).max(30).optional(),
  email:         z.string().email().optional(),
  address:       z.string().max(200).optional(),
  instagramUrl:  z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  facebookUrl:   z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  googleMapsUrl: z.string().optional(),
})

function generateTempPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const nums  = '23456789'
  const all   = upper + lower + nums
  let pass = upper[Math.floor(Math.random() * upper.length)]
          + nums[Math.floor(Math.random() * nums.length)]
  for (let i = 0; i < 10; i++) pass += all[Math.floor(Math.random() * all.length)]
  return pass.split('').sort(() => Math.random() - 0.5).join('')
}

const SAFE_FIELDS = {
  id: true, username: true, name: true, email: true,
  role: true, isActive: true, lastLoginAt: true, createdAt: true,
} as const

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUsers(_req: AuthRequest, res: Response) {
  const users = await prisma.adminUser.findMany({
    select: SAFE_FIELDS,
    orderBy: { createdAt: 'desc' },
  })
  res.json(users)
}

export async function createUser(req: AuthRequest, res: Response) {
  const parsed = createUserSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { username, name, email, role, password } = parsed.data

  const existing = await prisma.adminUser.findUnique({ where: { username } })
  if (existing) return res.status(409).json({ error: 'Username already taken' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.adminUser.create({
    data: { username: sanitize(username), name: sanitize(name), email, role, passwordHash },
    select: SAFE_FIELDS,
  })
  res.status(201).json(user)
}

export async function updateUser(req: AuthRequest, res: Response) {
  const { id } = req.params
  const target = await prisma.adminUser.findUnique({ where: { id } })
  if (!target) return res.status(404).json({ error: 'User not found' })

  if (id === req.admin!.id) {
    if (req.body.isActive === false) return res.status(400).json({ error: 'Cannot deactivate your own account' })
    if (req.body.role && req.body.role !== req.admin!.role) return res.status(400).json({ error: 'Cannot change your own role' })
  }

  // Guard: cannot deactivate last SUPER_ADMIN
  if (req.body.isActive === false && target.role === 'SUPER_ADMIN') {
    const superAdmins = await prisma.adminUser.count({ where: { role: 'SUPER_ADMIN', isActive: true } })
    if (superAdmins <= 1) return res.status(400).json({ error: 'Cannot deactivate the last active super admin' })
  }

  const parsed = updateUserSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const data: Record<string, unknown> = {}
  if (parsed.data.name     !== undefined) data.name     = sanitize(parsed.data.name)
  if (parsed.data.email    !== undefined) data.email    = parsed.data.email
  if (parsed.data.role     !== undefined) data.role     = parsed.data.role
  if (parsed.data.isActive !== undefined) data.isActive = parsed.data.isActive

  const updated = await prisma.adminUser.update({ where: { id }, data, select: SAFE_FIELDS })
  res.json(updated)
}

export async function resetUserPassword(req: AuthRequest, res: Response) {
  const { id } = req.params
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { ...SAFE_FIELDS, email: true } })
  if (!target) return res.status(404).json({ error: 'User not found' })

  const tempPassword = generateTempPassword()
  const passwordHash = await bcrypt.hash(tempPassword, 12)
  await prisma.adminUser.update({ where: { id }, data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null } })

  if (target.email) {
    res.json({ message: `Password reset email sent to ${target.email}` })
  } else {
    res.json({ temporaryPassword: tempPassword })
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const { id } = req.params
  if (id === req.admin!.id) return res.status(400).json({ error: 'Cannot delete your own account' })

  const target = await prisma.adminUser.findUnique({ where: { id } })
  if (!target) return res.status(404).json({ error: 'User not found' })

  if (target.role === 'SUPER_ADMIN') {
    const count = await prisma.adminUser.count({ where: { role: 'SUPER_ADMIN', isActive: true } })
    if (count <= 1) return res.status(400).json({ error: 'Cannot delete the last super admin' })
  }

  const updated = await prisma.adminUser.update({ where: { id }, data: { isActive: false }, select: SAFE_FIELDS })
  res.json(updated)
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(_req: AuthRequest, res: Response) {
  const settings = await prisma.siteSettings.upsert({
    where:  { id: 'main' },
    update: {},
    create: { id: 'main' },
  })
  res.json(settings)
}

export async function updateSettings(req: AuthRequest, res: Response) {
  const parsed = settingsSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v !== undefined) data[k] = typeof v === 'string' ? sanitize(v) : v
  }

  const settings = await prisma.siteSettings.upsert({
    where:  { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  })
  res.json(settings)
}
