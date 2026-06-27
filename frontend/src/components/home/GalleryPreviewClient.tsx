'use client'

import Link from 'next/link'
import { Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerFast, scaleIn, VIEWPORT } from '@/lib/motion'

interface GalleryItem {
  id:           string
  url:          string
  thumbnailUrl: string | null
  caption:      string | null
  altText:      string | null
  category:     string | null
}

const CATEGORY_STYLE: Record<string, { bg: string }> = {
  kiting:     { bg: 'from-brand-primary/40 to-brand-dark' },
  restaurant: { bg: 'from-amber-500/30 to-brand-dark'     },
  spot:       { bg: 'from-teal-500/30 to-brand-dark'      },
}

export default function GalleryPreviewClient({ photos }: { photos: GalleryItem[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerFast}
    >
      {photos.map((photo, i) => {
        const thumb = photo.thumbnailUrl ?? photo.url
        const isPlaceholder = thumb.includes('placeholder')
        const style = CATEGORY_STYLE[photo.category ?? ''] ?? { bg: 'from-brand-primary/20 to-brand-dark' }

        return (
          <motion.div
            key={photo.id}
            variants={scaleIn}
            className={i === 0 ? 'row-span-2' : ''}
          >
            <Link
              href="/gallery"
              className="group relative overflow-hidden rounded-2xl block h-full"
            >
              {isPlaceholder ? (
                <div className={`w-full ${i === 0 ? 'h-64 sm:h-full' : 'aspect-square'} bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                  <Camera size={36} className="text-white/30" aria-hidden="true" />
                </div>
              ) : (
                <img
                  src={thumb}
                  alt={photo.altText ?? photo.caption ?? 'Gallery photo'}
                  loading="lazy"
                  className={`w-full ${i === 0 ? 'h-64 sm:h-full' : 'aspect-square'} object-cover transition-transform duration-500 group-hover:scale-105`}
                />
              )}
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors duration-300 rounded-2xl" />
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
