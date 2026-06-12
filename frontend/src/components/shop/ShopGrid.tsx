'use client'

import ShopItemCard, { type ShopItem } from './ShopItemCard'

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

interface Props {
  items:        ShopItem[]
  activeFilter: string
}

export default function ShopGrid({ items, activeFilter }: Props) {
  const filtered = activeFilter === 'all'
    ? items
    : items.filter(i => i.tags.includes(activeFilter))

  if (!filtered.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-16 text-center py-20">
        <p className="text-gray-400 mb-4">No items in this category yet. Check back soon or WhatsApp us.</p>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent('Hi! Do you have any gear available in this category?')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a9fd4] text-white text-sm font-semibold"
        >
          Ask on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
