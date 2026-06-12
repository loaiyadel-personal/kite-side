import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

interface ShopItem {
  id:           string
  name:         string
  priceEGP:     string | number
  priceUSD:     string | number | null
  tags:         string[]
  thumbnailUrl: string | null
  imageUrl:     string | null
}

const TAG_STYLE: Record<string, { bg: string; icon: string }> = {
  kites:       { bg: 'from-[#1a9fd4] to-[#022b3d]',      icon: '🪁' },
  boards:      { bg: 'from-teal-500 to-[#022b3d]',        icon: '🏄' },
  harnesses:   { bg: 'from-cyan-600 to-[#022b3d]',        icon: '🎽' },
  accessories: { bg: 'from-[#e84a2e]/80 to-[#022b3d]',    icon: '⚡' },
  wetsuits:    { bg: 'from-blue-600 to-[#022b3d]',        icon: '🌊' },
  bags:        { bg: 'from-gray-500 to-[#022b3d]',        icon: '🎒' },
}

async function fetchFeaturedItems(): Promise<ShopItem[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const res = await fetch(`${api}/shop`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const all: ShopItem[] = await res.json()
    return all.slice(0, 3)
  } catch { return [] }
}

function formatEGP(v: string | number) {
  return Number(v).toLocaleString('en-EG', { maximumFractionDigits: 0 })
}

export default async function ShopPreview() {
  const items = await fetchFeaturedItems()
  if (!items.length) return null

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1a9fd4] text-sm font-medium uppercase tracking-widest mb-2">
              Pro Shop
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-[#022b3d]">
              Pro Shop & Rentals
            </h2>
            <p className="text-gray-500 mt-1">Quality gear to buy or rent right here at the beach</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#1a9fd4] font-semibold text-sm hover:gap-3 transition-all"
          >
            Visit the Shop <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {items.map(item => {
            const tag   = item.tags[0] ?? ''
            const style = TAG_STYLE[tag] ?? { bg: 'from-[#1a9fd4] to-[#022b3d]', icon: '🛒' }
            const thumb = item.thumbnailUrl ?? item.imageUrl

            return (
              <Link key={item.id} href="/shop" className="group rounded-2xl border border-gray-100 overflow-hidden hover:border-[#1a9fd4]/40 hover:shadow-lg transition-all">
                <div className="aspect-[4/3] overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                      <span className="text-4xl">{style.icon}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-outfit font-bold text-[#022b3d] text-sm mb-1">{item.name}</h3>
                  <p className="font-outfit font-bold text-[#1a9fd4]">
                    {formatEGP(item.priceEGP)} <span className="text-xs font-normal text-gray-400">EGP</span>
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#022b3d] text-white font-semibold text-sm hover:bg-[#034a6a] transition-colors"
          >
            Visit the Shop <ArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to rent equipment at Kite Side")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1a9fd4] text-[#1a9fd4] font-semibold text-sm hover:bg-[#1a9fd4]/5 transition-colors"
          >
            Rent Equipment
          </a>
        </div>
      </div>
    </section>
  )
}
