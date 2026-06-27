'use client'

import { useState, useMemo } from 'react'
import GalleryFilters, { type GalleryFilter } from './GalleryFilters'
import PhotoGrid from './PhotoGrid'
import VideoGrid from './VideoGrid'

interface GalleryItem {
  id:           string
  type:         'PHOTO' | 'VIDEO'
  url:          string
  thumbnailUrl: string | null
  caption:      string | null
  altText:      string | null
  category:     string | null
  sortOrder:    number
}

interface Props {
  items: GalleryItem[]
}

export default function GalleryContent({ items }: Props) {
  const [filter, setFilter] = useState<GalleryFilter>('all')

  const filteredPhotos = useMemo(() => {
    return items.filter(i => {
      if (i.type !== 'PHOTO') return false
      if (filter === 'videos') return false
      if (filter === 'all' || filter === 'photos') return true
      return i.category === filter
    })
  }, [items, filter])

  const filteredVideos = useMemo(() => {
    return items.filter(i => {
      if (i.type !== 'VIDEO') return false
      if (filter === 'photos') return false
      if (filter === 'all' || filter === 'videos') return true
      return i.category === filter
    })
  }, [items, filter])

  const counts = useMemo(() => {
    const photos = items.filter(i => i.type === 'PHOTO')
    const videos = items.filter(i => i.type === 'VIDEO')
    const cats = ['kiting', 'restaurant', 'spot'] as const
    const catCounts: Partial<Record<GalleryFilter, number>> = {}
    cats.forEach(cat => {
      catCounts[cat] = items.filter(i => i.category === cat).length
    })
    return {
      all:        items.length,
      photos:     photos.length,
      videos:     videos.length,
      ...catCounts,
    }
  }, [items])

  return (
    <>
      <GalleryFilters active={filter} onChange={setFilter} counts={counts} />
      <PhotoGrid photos={filteredPhotos} />
      <VideoGrid videos={filteredVideos} />
    </>
  )
}
