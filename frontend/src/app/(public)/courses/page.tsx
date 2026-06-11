import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CoursesHero from '@/components/courses/CoursesHero'
import WhyKiteSide from '@/components/courses/WhyKiteSide'
import CoursesSection from '@/components/courses/CoursesSection'
import RentalPricing from '@/components/courses/RentalPricing'
import BeachPricing from '@/components/courses/BeachPricing'
import CoursesFAQ from '@/components/courses/CoursesFAQ'
import type { Course } from '@/components/courses/CourseCard'
import type { PriceItem } from '@/components/courses/RentalPricing'

export const metadata = {
  title: 'Kite Courses — Kite Side Ras Sudr',
  description: 'IKO certified kitesurfing courses in Ras Sudr Egypt. Beginner to advanced. Flat water, consistent wind, expert instructors.',
}

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getPricing(): Promise<PriceItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function CoursesPage() {
  const [courses, pricing] = await Promise.all([getCourses(), getPricing()])

  const rentalItems = pricing.filter(p => p.category.startsWith('RENTAL'))
  const beachItems  = pricing.filter(p => p.category === 'BEACH_USE')

  return (
    <>
      <Navbar />
      <main>
        <CoursesHero />
        <WhyKiteSide />
        <CoursesSection courses={courses} />
        <RentalPricing items={rentalItems} />
        <BeachPricing items={beachItems} />
        <CoursesFAQ />
      </main>
      <Footer />
    </>
  )
}
