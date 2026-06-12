import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryContent from '@/components/gallery/GalleryContent'
import InstagramCTA from '@/components/gallery/InstagramCTA'

export const metadata = {
  title: 'Gallery — Kite Side Beach Club',
  description: 'Photos and videos from Kite Side Beach Club in Ras Sudr, Egypt. Kite sessions, sunsets, and beachfront dining.',
}

async function fetchGalleryItems() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const res = await fetch(`${apiBase}/gallery`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const items = await fetchGalleryItems()

  return (
    <>
      <Navbar />
      <main>
        <GalleryHero />
        <GalleryContent items={items} />
        <InstagramCTA />
      </main>
      <Footer />
    </>
  )
}
