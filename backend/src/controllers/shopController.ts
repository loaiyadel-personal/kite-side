import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, Prisma } from '@prisma/client'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import sharp from 'sharp'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

// ── Upload directory ──────────────────────────────────────────────────────────
const SHOP_DIR = path.join(__dirname, '../../uploads/shop')
if (!fs.existsSync(SHOP_DIR)) fs.mkdirSync(SHOP_DIR, { recursive: true })

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXT  = ['.jpg', '.jpeg', '.png', '.webp']

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_MIME.includes(file.mimetype) && ALLOWED_EXT.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Images only (jpg, jpeg, png, webp)'))
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

export const uploadMiddleware = upload.single('image')

async function saveShopImage(buffer: Buffer) {
  const uuid = crypto.randomUUID()
  const filename      = `${uuid}.webp`
  const thumbFilename = `thumb_${uuid}.webp`

  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(SHOP_DIR, filename))

  await sharp(buffer)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(SHOP_DIR, thumbFilename))

  return {
    imageUrl:     `/uploads/shop/${filename}`,
    thumbnailUrl: `/uploads/shop/${thumbFilename}`,
  }
}

function deleteShopFiles(imageUrl?: string | null, thumbnailUrl?: string | null) {
  for (const u of [imageUrl, thumbnailUrl]) {
    if (!u) continue
    fs.unlink(path.join(SHOP_DIR, path.basename(u)), () => {})
  }
}

function sanitize(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

const createSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priceEGP:    z.coerce.number().positive(),
  priceUSD:    z.coerce.number().positive().optional(),
  unit:        z.string().min(1).max(50),
  tags:        z.preprocess(
    v => (typeof v === 'string' ? JSON.parse(v) : v),
    z.array(z.string().max(50)).default([])
  ),
  sortOrder:   z.coerce.number().int().default(0),
  isActive:    z.preprocess(v => v === 'true' || v === true, z.boolean()).default(true),
})

const updateSchema = createSchema.partial()

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
})

// ── Public ────────────────────────────────────────────────────────────────────

export async function getShopItems(req: Request, res: Response) {
  const { category } = req.query
  const where: Record<string, unknown> = { isActive: true, category: 'SHOP_ITEM' }
  if (typeof category === 'string') where.tags = { has: category }

  const items = await prisma.priceItem.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  })
  res.json(items)
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function createShopItem(req: AuthRequest, res: Response) {
  const parse = createSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  const { name, description, priceEGP, priceUSD, unit, tags, sortOrder, isActive } = parse.data

  let imageUrl: string | null    = null
  let thumbnailUrl: string | null = null
  if (req.file) {
    const paths = await saveShopImage(req.file.buffer)
    imageUrl     = paths.imageUrl
    thumbnailUrl = paths.thumbnailUrl
  }

  const item = await prisma.priceItem.create({
    data: {
      category:    'SHOP_ITEM',
      name:        sanitize(name),
      description: description ? sanitize(description) : null,
      priceEGP:    new Prisma.Decimal(priceEGP),
      priceUSD:    priceUSD != null ? new Prisma.Decimal(priceUSD) : null,
      unit:        sanitize(unit),
      tags,
      sortOrder,
      isActive,
      imageUrl,
      thumbnailUrl,
    },
  })
  res.status(201).json(item)
}

export async function updateShopItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const existing = await prisma.priceItem.findUnique({ where: { id } })
  if (!existing || existing.category !== 'SHOP_ITEM') {
    return res.status(404).json({ error: 'Not found' })
  }

  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  const { name, description, priceEGP, priceUSD, unit, tags, sortOrder, isActive } = parse.data
  const data: Record<string, unknown> = {}

  if (name        !== undefined) data.name        = sanitize(name)
  if (description !== undefined) data.description = sanitize(description)
  if (priceEGP    !== undefined) data.priceEGP    = new Prisma.Decimal(priceEGP)
  if (priceUSD    !== undefined) data.priceUSD    = new Prisma.Decimal(priceUSD)
  if (unit        !== undefined) data.unit        = sanitize(unit)
  if (tags        !== undefined) data.tags        = tags
  if (sortOrder   !== undefined) data.sortOrder   = sortOrder
  if (isActive    !== undefined) data.isActive    = isActive

  if (req.file) {
    deleteShopFiles(existing.imageUrl, existing.thumbnailUrl)
    const paths = await saveShopImage(req.file.buffer)
    data.imageUrl     = paths.imageUrl
    data.thumbnailUrl = paths.thumbnailUrl
  }

  const updated = await prisma.priceItem.update({ where: { id }, data })
  res.json(updated)
}

export async function toggleShopItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.priceItem.findUnique({ where: { id } })
  if (!item || item.category !== 'SHOP_ITEM') return res.status(404).json({ error: 'Not found' })

  const updated = await prisma.priceItem.update({
    where: { id },
    data:  { isActive: !item.isActive },
  })
  res.json(updated)
}

export async function reorderShopItems(req: AuthRequest, res: Response) {
  const parse = reorderSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  await Promise.all(
    parse.data.items.map(({ id, sortOrder }) =>
      prisma.priceItem.update({ where: { id }, data: { sortOrder } })
    )
  )
  res.json({ message: 'Reordered' })
}

export async function deleteShopItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.priceItem.findUnique({ where: { id } })
  if (!item || item.category !== 'SHOP_ITEM') return res.status(404).json({ error: 'Not found' })

  await prisma.priceItem.delete({ where: { id } })
  deleteShopFiles(item.imageUrl, item.thumbnailUrl)
  res.json({ message: 'Deleted' })
}
