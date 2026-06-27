import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

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

const TAG_STYLE: Record<string, { bg: string }> = {
  kites:       { bg: 'from-brand-primary/60 to-brand-dark'  },
  boards:      { bg: 'from-teal-500/60 to-brand-dark'       },
  harnesses:   { bg: 'from-cyan-600/60 to-brand-dark'       },
  accessories: { bg: 'from-brand-accent/50 to-brand-dark'   },
  wetsuits:    { bg: 'from-blue-600/60 to-brand-dark'       },
  bags:        { bg: 'from-gray-500/60 to-brand-dark'       },
}

async function fetchFeaturedItems(): Promise<ShopItem[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const res = await fetch(`${api}/shop`, { cache: 'no-store' })
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
    <section className="py-24 px-4 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mb-3">
              Pro Shop
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark tracking-[-0.02em]">
              Pro Shop &amp; Rentals
            </h2>
            <p className="text-gray-500 mt-2 leading-relaxed">Quality gear to buy or rent right here at the beach</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-brand-primary font-semibold text-sm hover:gap-3 transition-all duration-200"
          >
            Visit the Shop <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {items.map(item => {
            const tag   = item.tags[0] ?? ''
            const style = TAG_STYLE[tag] ?? { bg: 'from-brand-primary/50 to-brand-dark' }
            const thumb = item.thumbnailUrl ?? item.imageUrl

            return (
              <Link
                key={item.id}
                href="/shop"
                className="group bg-white rounded-2xl border border-brand-surface overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-card-hover"
              >
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
                      <ShoppingBag size={36} className="text-white/40" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-brand-dark text-sm mb-1 tracking-[-0.01em]">{item.name}</h3>
                  <p className="font-outfit font-bold text-brand-primary">
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
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-dark text-white font-semibold text-sm transition-all duration-200 hover:bg-brand-deep hover:shadow-card"
          >
            Visit the Shop <ArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to rent equipment at Kite Side")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-brand-primary text-brand-primary font-semibold text-sm transition-all duration-200 hover:bg-brand-primary hover:text-white"
          >
            Rent Equipment
          </a>
        </div>
      </div>
    </section>
  )
}
