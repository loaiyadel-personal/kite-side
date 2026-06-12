import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const all: GalleryItem[] = await res.json()
    return all.slice(0, 6)
  } catch {
    return []
  }
}

const CATEGORY_STYLE: Record<string, { bg: string; icon: string }> = {
  kiting:     { bg: 'from-[#1a9fd4]/40 to-[#022b3d]', icon: '🪁' },
  restaurant: { bg: 'from-amber-500/30 to-[#022b3d]',  icon: '🍽️' },
  spot:       { bg: 'from-teal-500/30 to-[#022b3d]',   icon: '🌊' },
}

export default async function GalleryPreview() {
  const photos = await fetchPreviewPhotos()
  if (!photos.length) return null

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1a9fd4] text-sm font-medium uppercase tracking-widest mb-2">
              Gallery
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-[#022b3d]">
              Life at Kite Side
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#1a9fd4] font-semibold text-sm hover:gap-3 transition-all"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((photo, i) => {
            const thumb = photo.thumbnailUrl ?? photo.url
            const isPlaceholder = thumb.includes('placeholder')
            const style = CATEGORY_STYLE[photo.category ?? ''] ?? { bg: 'from-[#1a9fd4]/20 to-[#022b3d]', icon: '📷' }

            return (
              <Link
                key={photo.id}
                href="/gallery"
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2' : ''}`}
              >
                {isPlaceholder ? (
                  <div className={`w-full ${i === 0 ? 'h-64 sm:h-full' : 'aspect-square'} bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                    <span className="text-4xl">{style.icon}</span>
                  </div>
                ) : (
                  <img
                    src={thumb}
                    alt={photo.altText ?? photo.caption ?? ''}
                    loading="lazy"
                    className={`w-full ${i === 0 ? 'h-64 sm:h-full' : 'aspect-square'} object-cover transition-transform duration-500 group-hover:scale-105`}
                  />
                )}
                <div className="absolute inset-0 bg-[#022b3d]/0 group-hover:bg-[#022b3d]/40 transition-colors duration-300" />
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a9fd4] text-white font-semibold text-sm"
          >
            View full gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
