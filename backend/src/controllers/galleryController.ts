import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, GalleryItemType } from '@prisma/client'
import multer from 'multer'
import { AuthRequest } from '../middleware/auth'
import { processGalleryImage, deleteGalleryFiles } from '../services/storage/imageService'

const prisma = new PrismaClient()

// In-memory storage so sharp can process the buffer before writing to disk
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Images only (jpg, jpeg, png, webp)'))
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

export const uploadMiddleware = upload.single('image')

function sanitize(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

const photoSchema = z.object({
  caption:     z.string().max(200).optional(),
  altText:     z.string().max(200).optional(),
  category:    z.string().max(50).optional(),
  sortOrder:   z.coerce.number().int().default(0),
  isPublished: z.enum(['true', 'false']).default('true').transform(v => v === 'true'),
})

const videoSchema = z.object({
  url: z.string().url().refine(
    url => /youtube\.com|youtu\.be|vimeo\.com/.test(url),
    { message: 'Must be a YouTube or Vimeo URL' }
  ),
  thumbnailUrl: z.string().url().optional(),
  caption:      z.string().max(200).optional(),
  altText:      z.string().max(200).optional(),
  category:     z.string().max(50).optional(),
  sortOrder:    z.coerce.number().int().default(0),
  isPublished:  z.boolean().default(true),
})

const updateSchema = z.object({
  caption:     z.string().max(200).optional(),
  altText:     z.string().max(200).optional(),
  category:    z.string().max(50).optional(),
  sortOrder:   z.number().int().optional(),
  isPublished: z.boolean().optional(),
  url:         z.string().url().optional(),
})

const reorderSchema = z.object({
  items: z.array(z.object({
    id:        z.string(),
    sortOrder: z.number().int(),
  })),
})

// ── Public ────────────────────────────────────────────────────────────────────

export async function getGallery(req: Request, res: Response) {
  const { type, category } = req.query
  const where: Record<string, unknown> = { isPublished: true }
  if (type === 'PHOTO' || type === 'VIDEO') where.type = type as GalleryItemType
  if (typeof category === 'string') where.category = category

  const items = await prisma.galleryItem.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  res.json(items)
}

export async function getCategories(_req: Request, res: Response) {
  const rows = await prisma.galleryItem.findMany({
    where:    { isPublished: true, category: { not: null } },
    select:   { category: true },
    distinct: ['category'],
    orderBy:  { category: 'asc' },
  })
  res.json(rows.map(r => r.category).filter(Boolean))
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminGallery(_req: AuthRequest, res: Response) {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  res.json(items)
}

export async function createPhoto(req: AuthRequest, res: Response) {
  if (!req.file) return res.status(400).json({ error: 'Image file required' })

  const parse = photoSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  const { caption, altText, category, sortOrder, isPublished } = parse.data
  const { url, thumbnailUrl } = await processGalleryImage(req.file.buffer)

  const item = await prisma.galleryItem.create({
    data: {
      type:         GalleryItemType.PHOTO,
      url,
      thumbnailUrl,
      caption:      caption  ? sanitize(caption)  : null,
      altText:      altText  ? sanitize(altText)  : null,
      category:     category ? sanitize(category) : null,
      sortOrder,
      isPublished,
    },
  })
  res.status(201).json(item)
}

export async function createVideo(req: AuthRequest, res: Response) {
  const parse = videoSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  const { url, thumbnailUrl, caption, altText, category, sortOrder, isPublished } = parse.data

  const item = await prisma.galleryItem.create({
    data: {
      type:         GalleryItemType.VIDEO,
      url:          sanitize(url),
      thumbnailUrl: thumbnailUrl ? sanitize(thumbnailUrl) : null,
      caption:      caption      ? sanitize(caption)      : null,
      altText:      altText      ? sanitize(altText)      : null,
      category:     category     ? sanitize(category)     : null,
      sortOrder,
      isPublished,
    },
  })
  res.status(201).json(item)
}

export async function updateGalleryItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  const item = await prisma.galleryItem.findUnique({ where: { id } })
  if (!item) return res.status(404).json({ error: 'Not found' })

  const data: Record<string, unknown> = {}
  if (parse.data.caption     !== undefined) data.caption     = sanitize(parse.data.caption)
  if (parse.data.altText     !== undefined) data.altText     = sanitize(parse.data.altText)
  if (parse.data.category    !== undefined) data.category    = sanitize(parse.data.category)
  if (parse.data.sortOrder   !== undefined) data.sortOrder   = parse.data.sortOrder
  if (parse.data.isPublished !== undefined) data.isPublished = parse.data.isPublished
  if (parse.data.url !== undefined && item.type === GalleryItemType.VIDEO) {
    const v = videoSchema.shape.url.safeParse(parse.data.url)
    if (!v.success) return res.status(400).json({ error: 'Invalid video URL — must be YouTube or Vimeo' })
    data.url = sanitize(parse.data.url)
  }

  const updated = await prisma.galleryItem.update({ where: { id }, data })
  res.json(updated)
}

export async function togglePublish(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.galleryItem.findUnique({ where: { id } })
  if (!item) return res.status(404).json({ error: 'Not found' })

  const updated = await prisma.galleryItem.update({
    where: { id },
    data:  { isPublished: !item.isPublished },
  })
  res.json(updated)
}

export async function reorderGallery(req: AuthRequest, res: Response) {
  const parse = reorderSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

  await Promise.all(
    parse.data.items.map(({ id, sortOrder }) =>
      prisma.galleryItem.update({ where: { id }, data: { sortOrder } })
    )
  )
  res.json({ message: 'Reordered' })
}

export async function deleteGalleryItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const item = await prisma.galleryItem.findUnique({ where: { id } })
  if (!item) return res.status(404).json({ error: 'Not found' })

  await prisma.galleryItem.delete({ where: { id } })
  if (item.type === GalleryItemType.PHOTO) {
    deleteGalleryFiles(item.url, item.thumbnailUrl)
  }
  res.json({ message: 'Deleted' })
}
