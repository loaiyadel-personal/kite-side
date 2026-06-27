import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, Prisma, PriceCategory } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

const RENTAL_CATS: PriceCategory[] = [
  'RENTAL_KITE', 'RENTAL_BOARD', 'RENTAL_HARNESS', 'RENTAL_WETSUIT', 'RENTAL_FULL_GEAR',
]

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

const PriceItemSchema = z.object({
  category:      z.enum(['RENTAL_KITE', 'RENTAL_BOARD', 'RENTAL_HARNESS', 'RENTAL_WETSUIT', 'RENTAL_FULL_GEAR', 'BEACH_USE']),
  name:          z.string().min(1).max(100),
  description:   z.string().max(500).optional(),
  priceEGP:      z.number().positive(),
  priceUSD:      z.number().positive().optional(),
  unit:          z.string().min(1).max(50),
  isHighlighted: z.boolean().optional(),
  sortOrder:     z.number().int().default(0),
})

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPricing(req: Request, res: Response) {
  const { category } = req.query

  // Specific category — return flat array
  if (typeof category === 'string') {
    const items = await prisma.priceItem.findMany({
      where: { isActive: true, category: category as PriceCategory },
      orderBy: { sortOrder: 'asc' },
    })
    return res.json(items)
  }

  // Default — return grouped (SHOP_ITEMs served by /api/shop)
  const [rentals, beach] = await Promise.all([
    prisma.priceItem.findMany({
      where:   { isActive: true, category: { in: RENTAL_CATS } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.priceItem.findMany({
      where:   { isActive: true, category: 'BEACH_USE' },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  res.json({ rentals, beach })
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function createPriceItem(req: AuthRequest, res: Response) {
  const parsed = PriceItemSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { priceEGP, priceUSD, name, description, unit, isHighlighted, ...rest } = parsed.data
  const item = await prisma.priceItem.create({
    data: {
      ...rest,
      name:          sanitize(name),
      description:   description ? sanitize(description) : null,
      unit:          sanitize(unit),
      isHighlighted: isHighlighted ?? false,
      priceEGP:      new Prisma.Decimal(priceEGP),
      priceUSD:      priceUSD != null ? new Prisma.Decimal(priceUSD) : null,
    },
  })
  res.status(201).json(item)
}

export async function updatePriceItem(req: AuthRequest, res: Response) {
  const parsed = PriceItemSchema.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { priceEGP, priceUSD, name, description, unit, ...rest } = parsed.data
  const item = await prisma.priceItem.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(name        != null && { name:        sanitize(name) }),
      ...(description != null && { description: sanitize(description) }),
      ...(unit        != null && { unit:        sanitize(unit) }),
      ...(priceEGP    != null && { priceEGP:    new Prisma.Decimal(priceEGP) }),
      ...(priceUSD    != null && { priceUSD:    new Prisma.Decimal(priceUSD) }),
    },
  })
  res.json(item)
}

export async function togglePriceItem(req: AuthRequest, res: Response) {
  const item = await prisma.priceItem.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Not found' })
  const updated = await prisma.priceItem.update({
    where: { id: req.params.id },
    data:  { isActive: !item.isActive },
  })
  res.json(updated)
}

export async function deletePriceItem(req: AuthRequest, res: Response) {
  const updated = await prisma.priceItem.update({
    where: { id: req.params.id },
    data:  { isActive: false },
  })
  res.json(updated)
}
