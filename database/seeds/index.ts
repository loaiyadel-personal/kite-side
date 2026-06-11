import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ── Category IDs — stable so re-seeding is idempotent ─────────────────────────
const CAT = {
  breakfast:    'cat-breakfast',
  appetizers:   'cat-appetizers',
  salads:       'cat-salads',
  wraps:        'cat-wraps',
  pizza:        'cat-pizza',
  pasta:        'cat-pasta',
  burgers:      'cat-burgers',
  mains:        'cat-mains',
  coffeeHot:    'cat-coffee-hot',
  coffeeIced:   'cat-coffee-iced',
  coffeeAddons: 'cat-coffee-addons',
  milkshakes:   'cat-milkshakes',
  juices:       'cat-juices',
  smoothies:    'cat-smoothies',
  hotDrinks:    'cat-hot-drinks',
  softDrinks:   'cat-soft-drinks',
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Super admin ──────────────────────────────────────────────────────────────
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

  // ── Menu: wipe and replace ────────────────────────────────────────────────────
  await prisma.menuItem.deleteMany({})
  await prisma.menuCategory.deleteMany({})

  // Categories
  const categories = [
    { id: CAT.breakfast,    name: 'Breakfast',          sortOrder: 1  },
    { id: CAT.appetizers,   name: 'Appetizers',         sortOrder: 2  },
    { id: CAT.salads,       name: 'Salads',             sortOrder: 3  },
    { id: CAT.wraps,        name: 'Sandwiches & Wraps', sortOrder: 4  },
    { id: CAT.pizza,        name: 'Pizza',              sortOrder: 5  },
    { id: CAT.pasta,        name: 'Pasta',              sortOrder: 6  },
    { id: CAT.burgers,      name: 'Burgers',            sortOrder: 7  },
    { id: CAT.mains,        name: 'Main Courses',       sortOrder: 8  },
    { id: CAT.coffeeHot,    name: 'Coffee — Hot',       sortOrder: 9  },
    { id: CAT.coffeeIced,   name: 'Coffee — Iced',      sortOrder: 10 },
    { id: CAT.coffeeAddons, name: 'Coffee Add-Ons',     sortOrder: 11 },
    { id: CAT.milkshakes,   name: 'Milkshakes',         sortOrder: 12 },
    { id: CAT.juices,       name: 'Fresh Juices',       sortOrder: 13 },
    { id: CAT.smoothies,    name: 'Smoothies',          sortOrder: 14 },
    { id: CAT.hotDrinks,    name: 'Hot Drinks',         sortOrder: 15 },
    { id: CAT.softDrinks,   name: 'Soft Drinks',        sortOrder: 16 },
  ]
  await prisma.menuCategory.createMany({ data: categories })

  // Items
  const items = [
    // ── Breakfast ──────────────────────────────────────────────────────────────
    { categoryId: CAT.breakfast, name: 'Egyptian Breakfast', description: 'Foul, falafel, white cheese, and omelette', price: 200, tags: ['vegetarian'], sortOrder: 1 },
    { categoryId: CAT.breakfast, name: 'Omelette',           price: 80,  tags: ['vegetarian'], sortOrder: 2 },
    { categoryId: CAT.breakfast, name: 'Cheese Omelette',    price: 100, tags: ['vegetarian'], sortOrder: 3 },
    { categoryId: CAT.breakfast, name: 'Mushroom Omelette',  price: 120, tags: ['vegetarian'], sortOrder: 4 },
    { categoryId: CAT.breakfast, name: 'Bacon Omelette',     price: 130, tags: [],             sortOrder: 5 },
    { categoryId: CAT.breakfast, name: 'Sausage Plate',      price: 150, tags: [],             sortOrder: 6 },

    // ── Appetizers ────────────────────────────────────────────────────────────
    { categoryId: CAT.appetizers, name: 'Fries',              price: 95,  tags: ['vegan'],      sortOrder: 1 },
    { categoryId: CAT.appetizers, name: 'Wedges',             price: 105, tags: ['vegan'],      sortOrder: 2 },
    { categoryId: CAT.appetizers, name: 'Sweet Potato Fries', price: 130, tags: ['vegan'],      sortOrder: 3 },
    { categoryId: CAT.appetizers, name: 'Onion Rings',        price: 105, tags: ['vegan'],      sortOrder: 4 },
    { categoryId: CAT.appetizers, name: 'Chicken Tenders',    price: 195, tags: ['chicken'],    sortOrder: 5 },
    { categoryId: CAT.appetizers, name: 'Shrimp & Calamari',  price: 310, tags: ['seafood'],    sortOrder: 6 },
    { categoryId: CAT.appetizers, name: 'Hawawshi',           price: 155, tags: ['beef'],       sortOrder: 7 },

    // ── Salads ────────────────────────────────────────────────────────────────
    { categoryId: CAT.salads, name: 'Green Salad',                    price: 125, tags: ['vegan'],       sortOrder: 1  },
    { categoryId: CAT.salads, name: 'Caesar Salad',                   price: 150, tags: ['vegetarian'],  sortOrder: 2  },
    { categoryId: CAT.salads, name: 'Rocca Salad',                    price: 160, tags: ['vegetarian'],  sortOrder: 3  },
    { categoryId: CAT.salads, name: 'Greek Salad',                    price: 150, tags: ['vegetarian'],  sortOrder: 4  },
    { categoryId: CAT.salads, name: 'Tuna Salad',                     price: 250, tags: ['seafood'],     sortOrder: 5  },
    { categoryId: CAT.salads, name: 'Halloumi Salad',                 price: 185, tags: ['vegetarian'],  sortOrder: 6  },
    { categoryId: CAT.salads, name: 'Topping — Extra Shrimp',         price: 200, tags: ['seafood'],     sortOrder: 7  },
    { categoryId: CAT.salads, name: 'Topping — Extra Chicken',        price: 150, tags: ['chicken'],     sortOrder: 8  },
    { categoryId: CAT.salads, name: 'Topping — Extra Halloumi',       price: 110, tags: ['vegetarian'],  sortOrder: 9  },
    { categoryId: CAT.salads, name: 'Topping — Extra Tuna',           price: 150, tags: ['seafood'],     sortOrder: 10 },

    // ── Sandwiches & Wraps ────────────────────────────────────────────────────
    { categoryId: CAT.wraps, name: 'Beef Fajita Wrap',       price: 365, tags: ['beef'],       sortOrder: 1 },
    { categoryId: CAT.wraps, name: 'Chicken Fajita Wrap',    price: 320, tags: ['chicken'],    sortOrder: 2 },
    { categoryId: CAT.wraps, name: 'Crispy Chicken Wrap',    price: 310, tags: ['chicken'],    sortOrder: 3 },
    { categoryId: CAT.wraps, name: 'Shish Tawook Wrap',      price: 300, tags: ['chicken'],    sortOrder: 4 },
    { categoryId: CAT.wraps, name: 'Tuna Wrap',              price: 280, tags: ['seafood'],    sortOrder: 5 },
    { categoryId: CAT.wraps, name: 'Sausage Wrap',           price: 290, tags: [],             sortOrder: 6 },
    { categoryId: CAT.wraps, name: 'Halloumi Wrap',          price: 220, tags: ['vegetarian'], sortOrder: 7 },
    { categoryId: CAT.wraps, name: 'Hot Dog Sandwich',       price: 210, tags: [],             sortOrder: 8 },
    { categoryId: CAT.wraps, name: 'Chicken Pane Sandwich',  price: 245, tags: ['chicken'],    sortOrder: 9 },

    // ── Pizza ─────────────────────────────────────────────────────────────────
    { categoryId: CAT.pizza, name: 'Margherita',           price: 275, tags: ['vegetarian'], sortOrder: 1  },
    { categoryId: CAT.pizza, name: 'Four Cheese',          price: 360, tags: ['vegetarian'], sortOrder: 2  },
    { categoryId: CAT.pizza, name: 'Veggie',               price: 300, tags: ['vegetarian'], sortOrder: 3  },
    { categoryId: CAT.pizza, name: 'Marinara',             price: 250, tags: ['vegan'],      sortOrder: 4  },
    { categoryId: CAT.pizza, name: 'Chicken Mushroom',     price: 365, tags: ['chicken'],    sortOrder: 5  },
    { categoryId: CAT.pizza, name: 'Chicken BBQ',          price: 365, tags: ['chicken'],    sortOrder: 6  },
    { categoryId: CAT.pizza, name: 'Chicken Ranch',        price: 375, tags: ['chicken'],    sortOrder: 7  },
    { categoryId: CAT.pizza, name: 'Shrimp',               price: 460, tags: ['seafood'],    sortOrder: 8  },
    { categoryId: CAT.pizza, name: 'Tuna',                 price: 355, tags: ['seafood'],    sortOrder: 9  },
    { categoryId: CAT.pizza, name: 'Anchovies',            price: 430, tags: ['seafood'],    sortOrder: 10 },
    { categoryId: CAT.pizza, name: 'Pepperoni',            price: 345, tags: [],             sortOrder: 11 },
    { categoryId: CAT.pizza, name: 'Sausage',              price: 330, tags: [],             sortOrder: 12 },
    { categoryId: CAT.pizza, name: 'Extra — Mushroom',     price: 80,  tags: ['vegetarian'], sortOrder: 13 },
    { categoryId: CAT.pizza, name: 'Extra — Chicken',      price: 150, tags: ['chicken'],    sortOrder: 14 },
    { categoryId: CAT.pizza, name: 'Extra — Halloumi',     price: 105, tags: ['vegetarian'], sortOrder: 15 },
    { categoryId: CAT.pizza, name: 'Extra — Shrimp',       price: 200, tags: ['seafood'],    sortOrder: 16 },
    { categoryId: CAT.pizza, name: 'Extra — Cheese',       price: 80,  tags: ['vegetarian'], sortOrder: 17 },
    { categoryId: CAT.pizza, name: 'Extra — Sauce',        price: 40,  tags: ['vegan'],      sortOrder: 18 },

    // ── Pasta ─────────────────────────────────────────────────────────────────
    { categoryId: CAT.pasta, name: 'Penne Arrabbiata',    price: 235, tags: ['vegan'],       sortOrder: 1 },
    { categoryId: CAT.pasta, name: 'Fettuccine Alfredo',  price: 330, tags: ['vegetarian'],  sortOrder: 2 },
    { categoryId: CAT.pasta, name: 'Penne Alfredo',       price: 330, tags: ['vegetarian'],  sortOrder: 3 },
    { categoryId: CAT.pasta, name: 'Scallopini Pasta',    price: 350, tags: ['chicken'],     sortOrder: 4 },
    { categoryId: CAT.pasta, name: 'Pasta with Shrimp',   price: 390, tags: ['seafood'],     sortOrder: 5 },
    { categoryId: CAT.pasta, name: 'Pasta with Mushroom', price: 285, tags: ['vegetarian'],  sortOrder: 6 },
    { categoryId: CAT.pasta, name: 'Pesto Pasta',         price: 360, tags: ['vegetarian'],  sortOrder: 7 },
    { categoryId: CAT.pasta, name: 'Stroganoff Pasta',    price: 360, tags: ['beef'],        sortOrder: 8 },
    { categoryId: CAT.pasta, name: 'Bolognese',           price: 400, tags: ['beef'],        sortOrder: 9 },

    // ── Burgers ───────────────────────────────────────────────────────────────
    { categoryId: CAT.burgers, name: 'Cheese Burger',          price: 330, tags: ['beef'],        sortOrder: 1 },
    { categoryId: CAT.burgers, name: 'Mushroom Burger',        price: 350, tags: ['beef'],        sortOrder: 2 },
    { categoryId: CAT.burgers, name: 'Beef Bacon Burger',      price: 390, tags: ['beef'],        sortOrder: 3 },
    { categoryId: CAT.burgers, name: 'Halloumi & Beef Burger', price: 375, tags: ['beef'],        sortOrder: 4 },
    { categoryId: CAT.burgers, name: 'Kite Side Burger',       price: 390, tags: ['beef'],        sortOrder: 5 },
    { categoryId: CAT.burgers, name: 'Halloumi Veggie Burger', price: 270, tags: ['vegetarian'],  sortOrder: 6 },

    // ── Main Courses ──────────────────────────────────────────────────────────
    { categoryId: CAT.mains, name: 'Chicken Mushroom',    price: 390, tags: ['chicken'],  sortOrder: 1  },
    { categoryId: CAT.mains, name: 'Chicken Lemon Garlic',price: 380, tags: ['chicken'],  sortOrder: 2  },
    { categoryId: CAT.mains, name: 'Shish Tawook',        price: 380, tags: ['chicken'],  sortOrder: 3  },
    { categoryId: CAT.mains, name: 'Half Grilled Chicken',price: 450, tags: ['chicken'],  sortOrder: 4  },
    { categoryId: CAT.mains, name: 'Cordon Bleu',         price: 430, tags: ['chicken'],  sortOrder: 5  },
    { categoryId: CAT.mains, name: 'Chicken Fajita',      price: 410, tags: ['chicken'],  sortOrder: 6  },
    { categoryId: CAT.mains, name: 'Chicken Parmesan',    price: 420, tags: ['chicken'],  sortOrder: 7  },
    { categoryId: CAT.mains, name: 'Beef Steak',          price: 590, tags: ['beef'],     sortOrder: 8  },
    { categoryId: CAT.mains, name: 'Beef Stroganoff',     price: 510, tags: ['beef'],     sortOrder: 9  },
    { categoryId: CAT.mains, name: 'Beef Fajita',         price: 465, tags: ['beef'],     sortOrder: 10 },
    { categoryId: CAT.mains, name: 'Salmon',              price: 695, tags: ['seafood'],  sortOrder: 11 },
    { categoryId: CAT.mains, name: 'Grilled Shrimp',      price: 690, tags: ['seafood'],  sortOrder: 12 },
    { categoryId: CAT.mains, name: 'Shrimp Fajita',       price: 685, tags: ['seafood'],  sortOrder: 13 },

    // ── Coffee Hot ────────────────────────────────────────────────────────────
    { categoryId: CAT.coffeeHot, name: 'Espresso',                   price: 60,  tags: ['vegan'], sortOrder: 1  },
    { categoryId: CAT.coffeeHot, name: 'Double Espresso',            price: 80,  tags: ['vegan'], sortOrder: 2  },
    { categoryId: CAT.coffeeHot, name: 'Macchiato Single',           price: 75,  tags: ['vegan'], sortOrder: 3  },
    { categoryId: CAT.coffeeHot, name: 'Macchiato Double',           price: 95,  tags: ['vegan'], sortOrder: 4  },
    { categoryId: CAT.coffeeHot, name: 'Americano',                  price: 90,  tags: ['vegan'], sortOrder: 5  },
    { categoryId: CAT.coffeeHot, name: 'Cappuccino',                 price: 110, tags: [],        sortOrder: 6  },
    { categoryId: CAT.coffeeHot, name: 'Latte',                      price: 105, tags: [],        sortOrder: 7  },
    { categoryId: CAT.coffeeHot, name: 'Mocha',                      price: 110, tags: [],        sortOrder: 8  },
    { categoryId: CAT.coffeeHot, name: 'Turkish Coffee',             price: 60,  tags: ['vegan'], sortOrder: 9  },
    { categoryId: CAT.coffeeHot, name: 'Turkish Coffee Double',      price: 80,  tags: ['vegan'], sortOrder: 10 },
    { categoryId: CAT.coffeeHot, name: 'Turkish Coffee with Milk',   price: 95,  tags: [],        sortOrder: 11 },
    { categoryId: CAT.coffeeHot, name: 'Cortado',                    price: 105, tags: [],        sortOrder: 12 },
    { categoryId: CAT.coffeeHot, name: 'Flat White',                 price: 125, tags: [],        sortOrder: 13 },
    { categoryId: CAT.coffeeHot, name: 'Spanish Latte',              price: 135, tags: [],        sortOrder: 14 },
    { categoryId: CAT.coffeeHot, name: 'Vanilla Latte',              price: 115, tags: [],        sortOrder: 15 },
    { categoryId: CAT.coffeeHot, name: 'Caramel Macchiato',          price: 100, tags: [],        sortOrder: 16 },

    // ── Coffee Iced ───────────────────────────────────────────────────────────
    { categoryId: CAT.coffeeIced, name: 'Iced Frappe',         price: 125, tags: [], sortOrder: 1 },
    { categoryId: CAT.coffeeIced, name: 'Iced Latte',          price: 115, tags: [], sortOrder: 2 },
    { categoryId: CAT.coffeeIced, name: 'Iced Mocha',          price: 125, tags: [], sortOrder: 3 },
    { categoryId: CAT.coffeeIced, name: 'Iced Spanish Latte',  price: 135, tags: [], sortOrder: 4 },

    // ── Coffee Add-Ons ────────────────────────────────────────────────────────
    { categoryId: CAT.coffeeAddons, name: 'Extra Shot of Espresso',                  price: 55, tags: [], sortOrder: 1 },
    { categoryId: CAT.coffeeAddons, name: 'Flavored Syrup (Vanilla, Caramel, Hazelnut)', price: 35, tags: [], sortOrder: 2 },
    { categoryId: CAT.coffeeAddons, name: 'Milk Alternative (Almond, Soy, Oat)',     price: 45, tags: ['vegan'], sortOrder: 3 },

    // ── Milkshakes ────────────────────────────────────────────────────────────
    { categoryId: CAT.milkshakes, name: 'Mango Milkshake',      price: 135, tags: [], sortOrder: 1 },
    { categoryId: CAT.milkshakes, name: 'Strawberry Milkshake', price: 135, tags: [], sortOrder: 2 },
    { categoryId: CAT.milkshakes, name: 'Vanilla Milkshake',    price: 135, tags: [], sortOrder: 3 },
    { categoryId: CAT.milkshakes, name: 'Chocolate Milkshake',  price: 135, tags: [], sortOrder: 4 },
    { categoryId: CAT.milkshakes, name: 'Caramel Milkshake',    price: 135, tags: [], sortOrder: 5 },
    { categoryId: CAT.milkshakes, name: 'Coffee Milkshake',     price: 160, tags: [], sortOrder: 6 },
    { categoryId: CAT.milkshakes, name: 'Oreo Milkshake',       price: 150, tags: [], sortOrder: 7 },

    // ── Fresh Juices ──────────────────────────────────────────────────────────
    { categoryId: CAT.juices, name: 'Mango Juice',       price: 120, tags: ['vegan'], sortOrder: 1 },
    { categoryId: CAT.juices, name: 'Strawberry Juice',  price: 110, tags: ['vegan'], sortOrder: 2 },
    { categoryId: CAT.juices, name: 'Guava Juice',       price: 110, tags: ['vegan'], sortOrder: 3 },
    { categoryId: CAT.juices, name: 'Lemon Mint Juice',  price: 105, tags: ['vegan'], sortOrder: 4 },
    { categoryId: CAT.juices, name: 'Orange Juice',      price: 110, tags: ['vegan'], sortOrder: 5 },

    // ── Smoothies ─────────────────────────────────────────────────────────────
    { categoryId: CAT.smoothies, name: 'Blueberry',         price: 125, tags: ['vegan'], sortOrder: 1 },
    { categoryId: CAT.smoothies, name: 'Strawberry',        price: 120, tags: ['vegan'], sortOrder: 2 },
    { categoryId: CAT.smoothies, name: 'Mango Madness',     price: 135, tags: ['vegan'], sortOrder: 3 },
    { categoryId: CAT.smoothies, name: 'Pina Colada',       price: 130, tags: ['vegan'], sortOrder: 4 },
    { categoryId: CAT.smoothies, name: 'Passion Fruit',     price: 120, tags: ['vegan'], sortOrder: 5 },
    { categoryId: CAT.smoothies, name: 'Watermelon',        price: 125, tags: ['vegan'], sortOrder: 6 },
    { categoryId: CAT.smoothies, name: 'Pink Lemonade',     price: 125, tags: ['vegan'], sortOrder: 7 },

    // ── Hot Drinks ────────────────────────────────────────────────────────────
    { categoryId: CAT.hotDrinks, name: 'Black Tea',    price: 45, tags: ['vegan'], sortOrder: 1 },
    { categoryId: CAT.hotDrinks, name: 'Green Tea',    price: 45, tags: ['vegan'], sortOrder: 2 },
    { categoryId: CAT.hotDrinks, name: 'Herbal Tea',   price: 55, tags: ['vegan'], sortOrder: 3 },
    { categoryId: CAT.hotDrinks, name: 'Hot Chocolate',price: 85, tags: [],        sortOrder: 4 },
    { categoryId: CAT.hotDrinks, name: 'Tea with Milk',price: 60, tags: [],        sortOrder: 5 },

    // ── Soft Drinks ───────────────────────────────────────────────────────────
    { categoryId: CAT.softDrinks, name: 'V Cola',                 price: 60,  tags: ['vegan'], sortOrder: 1 },
    { categoryId: CAT.softDrinks, name: 'Soda (Coke, Sprite, Fanta)', price: 55, tags: ['vegan'], sortOrder: 2 },
    { categoryId: CAT.softDrinks, name: 'Red Bull',               price: 115, tags: ['vegan'], sortOrder: 3 },
    { categoryId: CAT.softDrinks, name: 'Bottled Water',          price: 25,  tags: ['vegan'], sortOrder: 4 },
    { categoryId: CAT.softDrinks, name: 'Ice Cup',                price: 15,  tags: ['vegan'], sortOrder: 5 },
  ]

  await prisma.menuItem.createMany({ data: items })
  console.log(`✅ Menu: ${categories.length} categories, ${items.length} items`)

  // ── Courses (keep existing — skip if already seeded) ─────────────────────────
  const courseData = [
    { level: 'DISCOVERY',        name: 'Discovery Session',        description: 'Try kitesurfing for the first time in a safe, supervised 2-hour session. No experience needed.',                         durationHours: 2,  maxStudents: 2, priceEGP: 800,   priceUSD: 17,  includes: ['kite', 'board', 'harness', 'helmet', 'instructor'] },
    { level: 'BEGINNER',         name: 'Beginner Course',          description: 'Learn the fundamentals: kite control, body drag, water start. IKO Level 1 & 2 certification upon completion.',           durationHours: 12, maxStudents: 3, priceEGP: 4500,  priceUSD: 95,  includes: ['kite', 'board', 'harness', 'wetsuit', 'theory book', 'IKO card'] },
    { level: 'INTERMEDIATE',     name: 'Intermediate Course',      description: 'Master riding upwind, board control, and basic jumps. IKO Level 3 certification.',                                       durationHours: 8,  maxStudents: 4, priceEGP: 3200,  priceUSD: 68,  includes: ['kite', 'board', 'harness', 'coaching'] },
    { level: 'ADVANCED',         name: 'Advanced Progression',     description: 'Jump higher, ride faster. Freestyle tricks, kite loops, and wave riding sessions.',                                      durationHours: 6,  maxStudents: 4, priceEGP: 2800,  priceUSD: 59,  includes: ['kite', 'board', 'harness', 'video analysis'] },
    { level: 'IKO_CERTIFICATION',name: 'IKO Assistant Instructor', description: 'Become a certified IKO Assistant Instructor. Theory, teaching practice, exam.',                                         durationHours: 40, maxStudents: 6, priceEGP: 18000, priceUSD: 380, includes: ['full equipment', 'IKO manual', 'certification fee', 'exam'] },
  ]
  for (const c of courseData) {
    await prisma.course.create({ data: c as any }).catch(() => {})
  }

  // ── Pricing (keep existing) ───────────────────────────────────────────────────
  const priceData = [
    { category: 'RENTAL_KITE',      name: 'Kite rental',        priceEGP: 500, priceUSD: 11, unit: 'per session (2h)' },
    { category: 'RENTAL_BOARD',     name: 'Twintip board',      priceEGP: 200, priceUSD: 4,  unit: 'per session (2h)' },
    { category: 'RENTAL_HARNESS',   name: 'Harness',            priceEGP: 100, priceUSD: 2,  unit: 'per session (2h)' },
    { category: 'RENTAL_WETSUIT',   name: 'Wetsuit (3mm)',      priceEGP: 150, priceUSD: 3,  unit: 'per day' },
    { category: 'RENTAL_FULL_GEAR', name: 'Full gear package',  description: 'Kite + board + harness', priceEGP: 750, priceUSD: 16, unit: 'per session (2h)' },
    { category: 'BEACH_USE',        name: 'Day pass',           description: 'Beach access, shower, lockers', priceEGP: 150, priceUSD: 3, unit: 'per person' },
    { category: 'BEACH_USE',        name: 'Sunbed + umbrella',  priceEGP: 100, priceUSD: 2,  unit: 'per day' },
    { category: 'BEACH_USE',        name: 'Shower',             priceEGP: 30,                unit: 'per use' },
  ]
  for (const p of priceData) {
    await prisma.priceItem.create({ data: p as any }).catch(() => {})
  }

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
