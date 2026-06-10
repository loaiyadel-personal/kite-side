import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Super admin
  await prisma.adminUser.upsert({
    where: { email: 'Ahmedyehya47@gmail.com' },
    update: {},
    create: {
      email: 'Ahmedyehya47@gmail.com',
      passwordHash: await bcrypt.hash('KiteSide2024!', 12),
      name: 'Ahmed Yahya',
      role: 'SUPER_ADMIN',
    },
  })

  // Menu categories + items
  const starters = await prisma.menuCategory.upsert({
    where: { id: 'cat-starters' },
    update: {},
    create: { id: 'cat-starters', name: 'Starters', nameAr: 'مقبلات', sortOrder: 1 },
  })
  const mains = await prisma.menuCategory.upsert({
    where: { id: 'cat-mains' },
    update: {},
    create: { id: 'cat-mains', name: 'Main Dishes', nameAr: 'الأطباق الرئيسية', sortOrder: 2 },
  })
  const drinks = await prisma.menuCategory.upsert({
    where: { id: 'cat-drinks' },
    update: {},
    create: { id: 'cat-drinks', name: 'Drinks', nameAr: 'المشروبات', sortOrder: 3 },
  })

  const menuItems = [
    { categoryId: starters.id, name: 'Hummus Plate', description: 'Creamy hummus with olive oil, warm pita bread', price: 85, tags: ['vegan'] },
    { categoryId: starters.id, name: 'Calamari Rings', description: 'Crispy fried calamari with garlic dip', price: 120, tags: ['seafood'] },
    { categoryId: starters.id, name: 'Mixed Salad', description: 'Fresh garden vegetables, lemon dressing', price: 70, tags: ['vegan'] },
    { categoryId: mains.id, name: 'Grilled Sea Bass', description: 'Fresh Red Sea sea bass, grilled with herbs', price: 280, tags: ['seafood'] },
    { categoryId: mains.id, name: 'Chicken Shawarma', description: 'Marinated chicken, garlic sauce, fries', price: 160, tags: [] },
    { categoryId: mains.id, name: 'Kofta Platter', description: 'Grilled beef kofta, rice, salad', price: 180, tags: [] },
    { categoryId: mains.id, name: 'Pasta Arrabiata', description: 'Spicy tomato sauce, penne, fresh basil', price: 140, tags: ['vegan'] },
    { categoryId: drinks.id, name: 'Fresh Mango Juice', description: 'Seasonal Egyptian mango', price: 60, tags: [] },
    { categoryId: drinks.id, name: 'Mint Lemonade', description: 'Fresh mint, lemon, sugar', price: 55, tags: ['vegan'] },
    { categoryId: drinks.id, name: 'Cold Brew Coffee', description: '12-hour cold brew', price: 75, tags: [] },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item as any }).catch(() => {})
  }

  // Courses
  const courses = [
    { level: 'DISCOVERY', name: 'Discovery Session', description: 'Try kitesurfing for the first time in a safe, supervised 2-hour session. No experience needed.', durationHours: 2, maxStudents: 2, priceEGP: 800, priceUSD: 17, includes: ['kite', 'board', 'harness', 'helmet', 'instructor'] },
    { level: 'BEGINNER', name: 'Beginner Course', description: 'Learn the fundamentals: kite control, body drag, water start. IKO Level 1 & 2 certification upon completion.', durationHours: 12, maxStudents: 3, priceEGP: 4500, priceUSD: 95, includes: ['kite', 'board', 'harness', 'wetsuit', 'theory book', 'IKO card'] },
    { level: 'INTERMEDIATE', name: 'Intermediate Course', description: 'Master riding upwind, board control, and basic jumps. IKO Level 3 certification.', durationHours: 8, maxStudents: 4, priceEGP: 3200, priceUSD: 68, includes: ['kite', 'board', 'harness', 'coaching'] },
    { level: 'ADVANCED', name: 'Advanced Progression', description: 'Jump higher, ride faster. Freestyle tricks, kite loops, and wave riding sessions.', durationHours: 6, maxStudents: 4, priceEGP: 2800, priceUSD: 59, includes: ['kite', 'board', 'harness', 'video analysis'] },
    { level: 'IKO_CERTIFICATION', name: 'IKO Assistant Instructor', description: 'Become a certified IKO Assistant Instructor. Theory, teaching practice, exam.', durationHours: 40, maxStudents: 6, priceEGP: 18000, priceUSD: 380, includes: ['full equipment', 'IKO manual', 'certification fee', 'exam'] },
  ]

  for (const course of courses) {
    await prisma.course.create({ data: course as any }).catch(() => {})
  }

  // Pricing
  const prices = [
    { category: 'RENTAL_KITE', name: 'Kite rental', priceEGP: 500, priceUSD: 11, unit: 'per session (2h)' },
    { category: 'RENTAL_BOARD', name: 'Twintip board', priceEGP: 200, priceUSD: 4, unit: 'per session (2h)' },
    { category: 'RENTAL_HARNESS', name: 'Harness', priceEGP: 100, priceUSD: 2, unit: 'per session (2h)' },
    { category: 'RENTAL_WETSUIT', name: 'Wetsuit (3mm)', priceEGP: 150, priceUSD: 3, unit: 'per day' },
    { category: 'RENTAL_FULL_GEAR', name: 'Full gear package', description: 'Kite + board + harness', priceEGP: 750, priceUSD: 16, unit: 'per session (2h)' },
    { category: 'BEACH_USE', name: 'Day pass', description: 'Beach access, shower, lockers', priceEGP: 150, priceUSD: 3, unit: 'per person' },
    { category: 'BEACH_USE', name: 'Sunbed + umbrella', priceEGP: 100, priceUSD: 2, unit: 'per day' },
    { category: 'BEACH_USE', name: 'Shower', priceEGP: 30, unit: 'per use' },
  ]

  for (const p of prices) {
    await prisma.priceItem.create({ data: p as any }).catch(() => {})
  }

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
