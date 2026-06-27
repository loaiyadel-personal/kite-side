'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/captions.css'

interface GalleryItem {
  id:           string
  url:          string
  thumbnailUrl: string | null
  caption:      string | null
  altText:      string | null
  category:     string | null
}

interface Props {
  photos: GalleryItem[]
}

export default function PhotoGrid({ photos }: Props) {
  const [open,  setOpen]  = useState(false)
  const [index, setIndex] = useState(0)

  if (!photos.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16 text-center text-gray-400 py-20">
        No photos in this category yet.
      </div>
    )
  }

  const slides = photos.map(p => ({
    src:         p.url,
    alt:         p.altText ?? p.caption ?? '',
    title:       p.caption ?? undefined,
    description: p.category ?? undefined,
  }))

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  return (
    <section className="px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Masonry grid via CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openAt(i)}
            />
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Counter, Captions]}
      />
    </section>
  )
}

function PhotoCard({ photo, onClick }: { photo: GalleryItem; onClick: () => void }) {
  const [errored, setErrored] = useState(false)
  const thumb = photo.thumbnailUrl ?? photo.url
  const isPlaceholder = thumb.includes('placeholder')

  return (
    <div className="break-inside-avoid mb-4">
      <button
        onClick={onClick}
        className="group relative w-full overflow-hidden rounded-xl shadow-sm border border-gray-100 block focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        {isPlaceholder || errored ? (
          <PlaceholderCard category={photo.category} caption={photo.caption} />
        ) : (
          <img
            src={thumb}
            alt={photo.altText ?? photo.caption ?? ''}
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setErrored(true)}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          {photo.caption && (
            <p className="text-white text-sm font-medium leading-snug line-clamp-2">
              {photo.caption}
            </p>
          )}
        </div>
      </button>
    </div>
  )
}

const CATEGORY_STYLE: Record<string, { bg: string; icon: string }> = {
  kiting:     { bg: 'from-brand-primary/40 to-brand-dark',   icon: '🪁' },
  restaurant: { bg: 'from-amber-500/30 to-brand-dark',    icon: '🍽️' },
  spot:       { bg: 'from-teal-500/30 to-brand-dark',     icon: '🌊' },
}

function PlaceholderCard({ category, caption }: { category: string | null; caption: string | null }) {
  const style = CATEGORY_STYLE[category ?? ''] ?? { bg: 'from-brand-primary/20 to-brand-dark', icon: '📷' }
  return (
    <div className={`aspect-[4/3] bg-gradient-to-br ${style.bg} flex flex-col items-center justify-center gap-2`}>
      <span className="text-3xl">{style.icon}</span>
      {caption && <p className="text-white/60 text-xs text-center px-4 line-clamp-2">{caption}</p>}
    </div>
  )
}
