import { Response } from 'express'
import { z } from 'zod'
import { PrismaClient, Prisma } from '@prisma/client'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

// ── Upload config ─────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../../uploads/menu')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp']

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ALLOWED_EXTS.includes(ext)) cb(null, true)
  else cb(new Error('Images only (jpg, jpeg, png, webp)'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

// ── Sanitize user text ────────────────────────────────────────────────────────
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

function deleteUploadedFile(imageUrl: string | null | undefined) {
  if (!imageUrl) return
  const filename = path.basename(imageUrl)
  const filepath = path.join(UPLOAD_DIR, filename)
  fs.unlink(filepath, () => {})
}

// ── Zod schemas ───────────────────────────────────────────────────────────────
const categorySchema = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().max(100).optional(),
  sortOrder: z.coerce.number().int().optional(),
})

const itemCreateSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().optional(),
  tags: z.string().optional(),
})

const itemUpdateSchema = itemCreateSchema.partial()

const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    sortOrder: z.coerce.number().int(),
  })).min(1),
})

// ── PUBLIC ────────────────────────────────────────────────────────────────────

export async function getMenu(_req: AuthRequest, res: Response) {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
  res.json(categories)
}

export async function getCategories(_req: AuthRequest, res: Response) {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, nameAr: true, sortOrder: true },
  })
  res.json(categories)
}

// ── ADMIN — categories ────────────────────────────────────────────────────────

export async function createCategory(req: AuthRequest, res: Response) {
  const data = categorySchema.parse(req.body)
  const category = await prisma.menuCategory.create({
    data: { ...data, name: sanitize(data.name) },
  })
  res.status(201).json(category)
}

export async function updateCategory(req: AuthRequest, res: Response) {
  const { id } = req.params
  const data = categorySchema.partial().parse(req.body)
  const category = await prisma.menuCategory.update({
    where: { id },
    data: data.name ? { ...data, name: sanitize(data.name) } : data,
  })
  res.json(category)
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  const { id } = req.params
  const itemCount = await prisma.menuItem.count({ where: { categoryId: id } })
  if (itemCount > 0) {
    return res.status(400).json({ error: 'Cannot delete category that contains items. Remove items first.' })
  }
  await prisma.menuCategory.delete({ where: { id } })
  res.status(204).end()
}

// ── ADMIN — items ─────────────────────────────────────────────────────────────

export async function createItem(req: AuthRequest, res: Response) {
  const validated = itemCreateSchema.parse(req.body)
  const tags = validated.tags ? JSON.parse(validated.tags) : []
  const imageUrl = req.file ? `/uploads/menu/${req.file.filename}` : undefined

  const item = await prisma.menuItem.create({
    data: {
      name: sanitize(validated.name),
      categoryId: validated.categoryId,
      price: new Prisma.Decimal(validated.price),
      description: validated.description ? sanitize(validated.description) : undefined,
      sortOrder: validated.sortOrder ?? 0,
      tags,
      imageUrl,
    },
  })
  res.status(201).json(item)
}

export async function updateItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const validated = itemUpdateSchema.parse(req.body)
  const tags = validated.tags !== undefined ? JSON.parse(validated.tags) : undefined

  const existing = await prisma.menuItem.findUniqueOrThrow({ where: { id } })

  let imageUrl = existing.imageUrl
  if (req.file) {
    deleteUploadedFile(existing.imageUrl)
    imageUrl = `/uploads/menu/${req.file.filename}`
  }

  const updateData: Prisma.MenuItemUpdateInput = {
    ...(validated.name && { name: sanitize(validated.name) }),
    ...(validated.categoryId && { category: { connect: { id: validated.categoryId } } }),
    ...(validated.price !== undefined && { price: new Prisma.Decimal(validated.price) }),
    ...(validated.description !== undefined && { description: sanitize(validated.description) }),
    ...(validated.sortOrder !== undefined && { sortOrder: validated.sortOrder }),
    ...(tags !== undefined && { tags }),
    imageUrl,
  }

  const item = await prisma.menuItem.update({ where: { id }, data: updateData })
  res.json(item)
}

export async function toggleAvailability(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id } })
  const updated = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
  })
  res.json({ id: updated.id, isAvailable: updated.isAvailable })
}

export async function deleteItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id } })
  deleteUploadedFile(item.imageUrl)
  await prisma.menuItem.delete({ where: { id } })
  res.status(204).end()
}

export async function reorderItems(req: AuthRequest, res: Response) {
  const { items } = reorderSchema.parse(req.body)
  await prisma.$transaction(
    items.map(({ id, sortOrder }) =>
      prisma.menuItem.update({ where: { id }, data: { sortOrder } })
    )
  )
  res.json({ updated: items.length })
}
