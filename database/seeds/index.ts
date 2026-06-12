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
    where: { username: 'superadmin' },
    update: { email: 'loaiy.adel@gmail.com', name: 'Loaiy Adel', isActive: true },
    create: {
      username:     'superadmin',
      email:        'loaiy.adel@gmail.com',
      passwordHash: await bcrypt.hash('KiteSide2024!', 12),
      name:         'Loaiy Adel',
      role:         'SUPER_ADMIN',
      isActive:     true,
    },
  })

  // ── Site settings ────────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where:  { id: 'main' },
    update: {},
    create: {
      id:           'main',
      whatsapp:     '+201116407080',
      phone:        '+201116407080',
      email:        'loaiy.adel@gmail.com',
      address:      'Inside Paradise Resort, Ras Sudr, South Sinai, Egypt',
      instagramUrl: 'https://instagram.com/kite_side',
      facebookUrl:  'https://facebook.com/p/Kite-Side-100093408729310',
      googleMapsUrl: 'https://maps.google.com/maps?q=29.4945477,32.7339648&z=17&output=embed',
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

  // ── Courses — wipe and replace ───────────────────────────────────────────────
  await prisma.courseInquiry.deleteMany({})
  await prisma.course.deleteMany({})

  const courseData = [
    {
      level: 'DISCOVERY', sortOrder: 1,
      name: 'Discovery Session',
      description: "Try kitesurfing for the first time in a safe supervised session. No experience needed. Feel the power of the kite in Ras Sudr's shallow flat water.",
      outcome: 'Understanding kite safety and basic kite control',
      durationHours: 2, maxStudents: 2, priceEGP: 800, priceUSD: 17,
      includes: ['Kite', 'Board', 'Harness', 'Helmet', 'Instructor', 'Theory introduction'],
    },
    {
      level: 'BEGINNER', sortOrder: 2,
      name: 'Beginner Course — IKO Level 1 & 2',
      description: 'Learn all the fundamentals from scratch. Kite setup, safety systems, body drag, water start, and first rides. IKO Level 1 and 2 certification included.',
      outcome: 'IKO Level 1 & 2 certified, riding independently in safe conditions',
      durationHours: 12, maxStudents: 3, priceEGP: 4500, priceUSD: 95,
      includes: ['Kite', 'Board', 'Harness', 'Wetsuit', 'Theory book', 'IKO certification card'],
    },
    {
      level: 'INTERMEDIATE', sortOrder: 3,
      name: 'Intermediate Course — IKO Level 3',
      description: 'Master riding upwind, board control, transitions, and basic jumps.',
      outcome: 'IKO Level 3 certified, riding upwind confidently',
      durationHours: 8, maxStudents: 4, priceEGP: 3200, priceUSD: 68,
      includes: ['Kite', 'Board', 'Harness', 'Coaching', 'Video analysis session'],
    },
    {
      level: 'ADVANCED', sortOrder: 4,
      name: 'Advanced Progression',
      description: 'Push your limits with jumps, kite loops, handle passes, and wave riding. Personalized coaching for your progression.',
      outcome: 'Freestyle foundations, jump technique, advanced maneuvers',
      durationHours: 6, maxStudents: 4, priceEGP: 2800, priceUSD: 59,
      includes: ['Kite', 'Board', 'Harness', 'Video analysis', 'Personalized feedback'],
    },
    {
      level: 'IKO_CERTIFICATION', sortOrder: 5,
      name: 'IKO Assistant Instructor',
      description: 'Become a certified IKO Assistant Instructor. Full theory program, teaching practice, exam preparation, and official IKO certification.',
      outcome: 'IKO Assistant Instructor certification, able to teach beginners',
      durationHours: 40, maxStudents: 6, priceEGP: 18000, priceUSD: 380,
      includes: ['Full equipment', 'IKO manual', 'Certification exam fee', 'Assessment'],
    },
  ]
  await prisma.course.createMany({ data: courseData as any })
  console.log(`✅ Courses: ${courseData.length} courses`)

  // ── Pricing + Shop — wipe and replace ────────────────────────────────────────
  await prisma.priceItem.deleteMany({})

  const priceData = [
    // Rentals
    { category: 'RENTAL_KITE',      sortOrder: 1, name: 'Kite Rental',         description: 'Includes kite, bar and lines',                           priceEGP: 500,  priceUSD: 11, unit: 'per session (2h)', isHighlighted: false },
    { category: 'RENTAL_BOARD',     sortOrder: 2, name: 'Twintip Board Rental', description: 'Board with fins and pads',                               priceEGP: 200,  priceUSD: 4,  unit: 'per session (2h)', isHighlighted: false },
    { category: 'RENTAL_HARNESS',   sortOrder: 3, name: 'Harness Rental',       description: 'Seat or waist harness',                                  priceEGP: 100,  priceUSD: 2,  unit: 'per session (2h)', isHighlighted: false },
    { category: 'RENTAL_WETSUIT',   sortOrder: 4, name: 'Wetsuit Rental 3mm',   description: 'Full wetsuit',                                           priceEGP: 150,  priceUSD: 3,  unit: 'per day',           isHighlighted: false },
    { category: 'RENTAL_FULL_GEAR', sortOrder: 5, name: 'Full Gear Package',    description: 'Kite + board + harness — best value for a full session', priceEGP: 750,  priceUSD: 16, unit: 'per session (2h)', isHighlighted: true  },
    // Beach
    { category: 'BEACH_USE',        sortOrder: 1, name: 'Day Pass',             description: 'Beach access, shower and locker included',               priceEGP: 150,  priceUSD: 3,  unit: 'per person per day', isHighlighted: false },
    { category: 'BEACH_USE',        sortOrder: 2, name: 'Sunbed + Umbrella',    description: 'Comfortable sunbed with shade umbrella on the beach',    priceEGP: 100,  priceUSD: 2,  unit: 'per day',            isHighlighted: false },
    { category: 'BEACH_USE',        sortOrder: 3, name: 'Shower',               description: 'Fresh water shower',                                     priceEGP: 30,               unit: 'per use',            isHighlighted: false },
    { category: 'BEACH_USE',        sortOrder: 4, name: 'Parking',              description: 'Secure beach parking',                                   priceEGP: 50,               unit: 'per day',            isHighlighted: false },
    { category: 'BEACH_USE',        sortOrder: 5, name: 'Locker',               description: 'Secure locker rental',                                   priceEGP: 50,               unit: 'per day',            isHighlighted: false },
    // Shop items — Kites
    { category: 'SHOP_ITEM', sortOrder: 1,  name: 'Trainer Kite 4m',         description: 'Perfect for beginners and kids. Includes bar and lines.',                    priceEGP: 8500,  priceUSD: 180,  unit: 'each', tags: ['kites']       },
    { category: 'SHOP_ITEM', sortOrder: 2,  name: 'Cabrinha Crossbow 12m',   description: 'All-round performance kite. Excellent for intermediate riders.',             priceEGP: 42000, priceUSD: 890,  unit: 'each', tags: ['kites']       },
    { category: 'SHOP_ITEM', sortOrder: 3,  name: 'Core XR7 10m',            description: 'High performance freeride kite. Great range and depower.',                   priceEGP: 48000, priceUSD: 1020, unit: 'each', tags: ['kites']       },
    // Boards
    { category: 'SHOP_ITEM', sortOrder: 4,  name: 'Twintip Board 138cm',     description: 'All-round twintip for beginners and intermediate riders. Includes fins and pads.', priceEGP: 18000, priceUSD: 380, unit: 'each', tags: ['boards'] },
    { category: 'SHOP_ITEM', sortOrder: 5,  name: 'Twintip Board 142cm',     description: 'Larger board for lighter riders or low wind conditions.',                     priceEGP: 19500, priceUSD: 415,  unit: 'each', tags: ['boards']      },
    // Harnesses
    { category: 'SHOP_ITEM', sortOrder: 6,  name: 'Kite Harness — Seat',     description: 'Comfortable seat harness. Ideal for beginners.',                             priceEGP: 6500,  priceUSD: 138,  unit: 'each', tags: ['harnesses']   },
    { category: 'SHOP_ITEM', sortOrder: 7,  name: 'Kite Harness — Waist',    description: 'Performance waist harness for intermediate to advanced riders.',             priceEGP: 7500,  priceUSD: 159,  unit: 'each', tags: ['harnesses']   },
    // Accessories
    { category: 'SHOP_ITEM', sortOrder: 8,  name: 'Helmet (Kite)',           description: 'Impact helmet for kitesurfing. Required for all lessons.',                   priceEGP: 2800,  priceUSD: 60,   unit: 'each', tags: ['accessories'] },
    { category: 'SHOP_ITEM', sortOrder: 9,  name: 'Impact Vest',             description: 'Buoyancy and impact protection vest. IKO recommended.',                      priceEGP: 3200,  priceUSD: 68,   unit: 'each', tags: ['accessories'] },
    { category: 'SHOP_ITEM', sortOrder: 10, name: 'Kite Lines Set',          description: '24m replacement lines set. Compatible with most bars.',                       priceEGP: 3800,  priceUSD: 81,   unit: 'each', tags: ['accessories'] },
    { category: 'SHOP_ITEM', sortOrder: 11, name: 'Bar & Lines Complete',    description: 'Complete control bar with 24m lines and chicken loop.',                       priceEGP: 12000, priceUSD: 255,  unit: 'each', tags: ['accessories'] },
    { category: 'SHOP_ITEM', sortOrder: 12, name: 'Kite Pump',               description: 'High pressure kite pump with pressure gauge.',                                priceEGP: 1200,  priceUSD: 26,   unit: 'each', tags: ['accessories'] },
    // Wetsuits
    { category: 'SHOP_ITEM', sortOrder: 13, name: 'Wetsuit 3mm Full',        description: 'Full 3mm wetsuit. Ideal for winter sessions in Ras Sudr.',                   priceEGP: 5500,  priceUSD: 117,  unit: 'each', tags: ['wetsuits']    },
    // Bags
    { category: 'SHOP_ITEM', sortOrder: 14, name: 'Kite Bag',                description: 'Large kite backpack. Fits kite, bar, and accessories.',                       priceEGP: 2200,  priceUSD: 47,   unit: 'each', tags: ['bags']        },
    { category: 'SHOP_ITEM', sortOrder: 15, name: 'Board Bag',               description: 'Padded twintip board bag. Protects up to 145cm board.',                       priceEGP: 1800,  priceUSD: 38,   unit: 'each', tags: ['bags']        },
  ]
  await prisma.priceItem.createMany({ data: priceData as any })
  console.log(`✅ Pricing + Shop: ${priceData.length} items`)

  // ── Gallery — wipe and replace ────────────────────────────────────────────────
  await prisma.galleryItem.deleteMany({})

  const galleryData = [
    // Kiting photos (sortOrder 1-6)
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite1/1200/800', thumbnailUrl: 'https://picsum.photos/seed/kite1/600/400', caption: 'High-flying jump at Ras Sudr', altText: 'Kitesurfer jumping high above the water', category: 'kiting', sortOrder: 1, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite2/1200/800', thumbnailUrl: 'https://picsum.photos/seed/kite2/600/400', caption: 'Perfect flat water session', altText: 'Kitesurfer riding across flat turquoise water', category: 'kiting', sortOrder: 2, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite3/1200/800', thumbnailUrl: 'https://picsum.photos/seed/kite3/600/400', caption: 'Beginners course on the beach', altText: 'Instructor teaching kite control on the beach', category: 'kiting', sortOrder: 3, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite4/1200/900', thumbnailUrl: 'https://picsum.photos/seed/kite4/600/450', caption: 'Sunset kite session', altText: 'Silhouette of a kitesurfer at sunset', category: 'kiting', sortOrder: 4, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite5/1200/800', thumbnailUrl: 'https://picsum.photos/seed/kite5/600/400', caption: 'Group lesson in progress', altText: 'Group of students learning to kitesurf', category: 'kiting', sortOrder: 5, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/kite6/1200/800', thumbnailUrl: 'https://picsum.photos/seed/kite6/600/400', caption: 'Downwinder along the coast', altText: 'Kitesurfer riding a downwind run along the coast', category: 'kiting', sortOrder: 6, isPublished: true },
    // Restaurant photos (sortOrder 7-10)
    { type: 'PHOTO', url: 'https://picsum.photos/seed/resto1/1200/800', thumbnailUrl: 'https://picsum.photos/seed/resto1/600/400', caption: 'Fresh seafood platter', altText: 'Colorful seafood platter on a wooden table', category: 'restaurant', sortOrder: 7, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/resto2/1200/900', thumbnailUrl: 'https://picsum.photos/seed/resto2/600/450', caption: 'Beachfront dining at golden hour', altText: 'Restaurant tables on the beach at sunset', category: 'restaurant', sortOrder: 8, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/resto3/1200/800', thumbnailUrl: 'https://picsum.photos/seed/resto3/600/400', caption: 'Cold drinks on a hot day', altText: 'Tropical drinks on a beach bar counter', category: 'restaurant', sortOrder: 9, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/resto4/1200/800', thumbnailUrl: 'https://picsum.photos/seed/resto4/600/400', caption: 'Shisha and view', altText: 'Shisha pipe with sea view in the background', category: 'restaurant', sortOrder: 10, isPublished: true },
    // Spot photos (sortOrder 11-12)
    { type: 'PHOTO', url: 'https://picsum.photos/seed/spot1/1200/800', thumbnailUrl: 'https://picsum.photos/seed/spot1/600/400', caption: 'The Ras Sudr lagoon', altText: 'Crystal-clear shallow lagoon at Ras Sudr', category: 'spot', sortOrder: 11, isPublished: true },
    { type: 'PHOTO', url: 'https://picsum.photos/seed/spot2/1200/800', thumbnailUrl: 'https://picsum.photos/seed/spot2/600/400', caption: 'The Red Sea horizon', altText: 'Wide panoramic view of the Red Sea at Ras Sudr', category: 'spot', sortOrder: 12, isPublished: true },
    // Videos (sortOrder 13-15)
    { type: 'VIDEO', url: 'https://www.youtube.com/embed/placeholder-kite-video-1', thumbnailUrl: null, caption: 'Best of Ras Sudr — Season Highlights', altText: null, category: 'kiting', sortOrder: 13, isPublished: true },
    { type: 'VIDEO', url: 'https://www.youtube.com/embed/placeholder-kite-video-2', thumbnailUrl: null, caption: 'Learn to Kitesurf at Kite Side', altText: null, category: 'kiting', sortOrder: 14, isPublished: true },
    { type: 'VIDEO', url: 'https://www.youtube.com/embed/placeholder-resto-video-1', thumbnailUrl: null, caption: 'A day at Kite Side Beach Club', altText: null, category: 'restaurant', sortOrder: 15, isPublished: true },
  ]
  await prisma.galleryItem.createMany({ data: galleryData as any })
  console.log(`✅ Gallery: ${galleryData.length} items`)

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
