'use client'

import { useState, useMemo } from 'react'
import ShopFilters, { type ShopFilter } from './ShopFilters'
import ShopGrid from './ShopGrid'
import type { ShopItem } from './ShopItemCard'

interface Props {
  items: ShopItem[]
}

const ALL_TAGS: ShopFilter[] = ['kites', 'boards', 'harnesses', 'accessories', 'wetsuits', 'bags']

export default function ShopContent({ items }: Props) {
  const [filter, setFilter] = useState<ShopFilter>('all')

  const counts = useMemo(() => {
    const c: Partial<Record<ShopFilter, number>> = { all: items.length }
    ALL_TAGS.forEach(tag => {
      const n = items.filter(i => i.tags.includes(tag)).length
      if (n > 0) c[tag] = n
    })
    return c
  }, [items])

  return (
    <section className="bg-white pt-2 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <ShopFilters active={filter} onChange={setFilter} counts={counts} />
      </div>
      <ShopGrid items={items} activeFilter={filter} />
    </section>
  )
}
