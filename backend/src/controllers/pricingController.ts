import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, Prisma } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

const PriceItemSchema = z.object({
  category: z.enum(['RENTAL_KITE', 'RENTAL_BOARD', 'RENTAL_HARNESS', 'RENTAL_WETSUIT', 'RENTAL_FULL_GEAR', 'BEACH_USE', 'SHOP_ITEM']),
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  priceEGP: z.number().positive(),
  priceUSD: z.number().positive().optional(),
  unit: z.string().min(1).max(50),
  sortOrder: z.number().int().default(0),
})

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPricing(req: Request, res: Response) {
  const category = req.query.category as string | undefined
  const items = await prisma.priceItem.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  })
  res.json(items)
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function createPriceItem(req: AuthRequest, res: Response) {
  const parsed = PriceItemSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
  }
  const { priceEGP, priceUSD, name, description, unit, ...rest } = parsed.data
  const item = await prisma.priceItem.create({
    data: {
      ...rest,
      name: sanitize(name),
      description: description ? sanitize(description) : null,
      unit: sanitize(unit),
      priceEGP: new Prisma.Decimal(priceEGP),
      priceUSD: priceUSD != null ? new Prisma.Decimal(priceUSD) : null,
    },
  })
  res.status(201).json(item)
}

export async function updatePriceItem(req: AuthRequest, res: Response) {
  const parsed = PriceItemSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() })
  }
  const { priceEGP, priceUSD, name, description, unit, ...rest } = parsed.data
  const item = await prisma.priceItem.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(name != null && { name: sanitize(name) }),
      ...(description != null && { description: sanitize(description) }),
      ...(unit != null && { unit: sanitize(unit) }),
      ...(priceEGP != null && { priceEGP: new Prisma.Decimal(priceEGP) }),
      ...(priceUSD != null && { priceUSD: new Prisma.Decimal(priceUSD) }),
    },
  })
  res.json(item)
}

export async function togglePriceItem(req: AuthRequest, res: Response) {
  const item = await prisma.priceItem.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Price item not found' })
  const updated = await prisma.priceItem.update({
    where: { id: req.params.id },
    data: { isActive: !item.isActive },
  })
  res.json(updated)
}

export async function deletePriceItem(req: AuthRequest, res: Response) {
  const item = await prisma.priceItem.update({
    where: { id: req.params.id },
    data: { isActive: false },
  })
  res.json(item)
}
