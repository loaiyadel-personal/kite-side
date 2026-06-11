import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RestaurantHero from '@/components/restaurant/RestaurantHero'
import RestaurantInfoBar from '@/components/restaurant/RestaurantInfoBar'
import MenuFilterBar from '@/components/restaurant/MenuFilterBar'
import MenuSection from '@/components/restaurant/MenuSection'
import ServiceChargeNotice from '@/components/restaurant/ServiceChargeNotice'

export const metadata = {
  title: 'Menu — Kite Side Beach Club',
  description: 'Fresh food and drinks at Kite Side Beach Club, Ras Sudr. Breakfast, mains, pizza, pasta, burgers and more.',
}

// Notes shown per category
const CATEGORY_NOTES: Record<string, string> = {
  'Breakfast':          'Served 9:00 AM – 1:00 PM',
  'Salads':             'All salads are plain — choose toppings from the list below',
  'Sandwiches & Wraps': 'All wraps served with golden fries',
  'Burgers':            'All burgers served with golden fries · Sauces: BBQ, Sweet Chilli, Ranch, Texas Mustard, Caesar',
  'Main Courses':       'Comes with 2 sides of your choice: rice, sauté, fries, green salad, or mashed potato',
}

interface MenuCategory {
  id: string
  name: string
  sortOrder: number
  items: {
    id: string
    name: string
    description?: string | null
    price: number | string
    imageUrl?: string | null
    tags: string[]
    isAvailable: boolean
    sortOrder: number
  }[]
}

async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function RestaurantPage() {
  const categories = await getMenu()

  return (
    <>
      <Navbar />
      <main className="pb-16">
        <RestaurantHero />
        <RestaurantInfoBar />
        <MenuFilterBar />

        {categories.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-lg">Menu coming soon — check back shortly.</p>
          </div>
        ) : (
          <div className="bg-gray-50">
            {categories.map((cat) => (
              <MenuSection
                key={cat.id}
                name={cat.name}
                note={CATEGORY_NOTES[cat.name]}
                items={cat.items}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ServiceChargeNotice />
    </>
  )
}
