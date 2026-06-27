import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import GalleryPreviewClient from './GalleryPreviewClient'

interface GalleryItem {
  id:           string
  url:          string
  thumbnailUrl: string | null
  caption:      string | null
  altText:      string | null
  category:     string | null
}

async function fetchPreviewPhotos(): Promise<GalleryItem[]> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const res = await fetch(`${apiBase}/gallery?type=PHOTO`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const all: GalleryItem[] = await res.json()
    return all.slice(0, 6)
  } catch {
    return []
  }
}

export default async function GalleryPreview() {
  const photos = await fetchPreviewPhotos()
  if (!photos.length) return null

  return (
    <section className="py-24 px-4 bg-brand-dark">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-brand-primary">
              Gallery
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-[-0.02em]">
              Life at Kite Side
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-sm hover:gap-3 transition-all duration-200 text-brand-primary hover:text-white"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <GalleryPreviewClient photos={photos} />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm bg-brand-primary hover:shadow-[0_0_24px_rgba(90,172,188,0.5)] transition-all duration-200"
          >
            View full gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
