const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

function waLink(text: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

function formatEGP(v: string | number) {
  return Number(v).toLocaleString('en-EG', { maximumFractionDigits: 0 })
}

const TAG_STYLE: Record<string, { bg: string; icon: string }> = {
  kites:       { bg: 'from-brand-primary to-brand-dark', icon: '🪁' },
  boards:      { bg: 'from-teal-500 to-brand-dark',  icon: '🏄' },
  harnesses:   { bg: 'from-cyan-600 to-brand-dark',  icon: '🎽' },
  accessories: { bg: 'from-[#e84a2e]/80 to-brand-dark', icon: '⚡' },
  wetsuits:    { bg: 'from-blue-600 to-brand-dark',  icon: '🌊' },
  bags:        { bg: 'from-gray-500 to-brand-dark',  icon: '🎒' },
}

export interface ShopItem {
  id:           string
  name:         string
  description:  string | null
  priceEGP:     string | number
  priceUSD:     string | number | null
  unit:         string
  tags:         string[]
  imageUrl:     string | null
  thumbnailUrl: string | null
  isActive:     boolean
}

interface Props {
  item: ShopItem
}

export default function ShopItemCard({ item }: Props) {
  const tag   = item.tags[0] ?? ''
  const style = TAG_STYLE[tag] ?? { bg: 'from-brand-primary to-brand-dark', icon: '🛒' }
  const thumb = item.thumbnailUrl ?? item.imageUrl

  return (
    <div className={[
      'group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-300',
      'hover:-translate-y-1 hover:shadow-xl hover:border-brand-primary/40',
      !item.isActive ? 'opacity-60' : '',
    ].join(' ')}>

      {/* Image / placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
            <span className="text-5xl">{style.icon}</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!item.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-outfit font-bold text-brand-dark text-base leading-snug mb-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <p className="font-outfit font-bold text-2xl text-brand-primary">
            {formatEGP(item.priceEGP)} <span className="text-sm font-medium text-gray-400">EGP</span>
          </p>
          {item.priceUSD && (
            <p className="text-xs text-gray-400 mt-0.5">
              (~{formatEGP(item.priceUSD)} USD)
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <a
            href={waLink(`Hi! I'm interested in buying: ${item.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-[#1589b8] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Buy via WhatsApp
          </a>
          <a
            href={waLink(`Hi! I have a question about: ${item.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2.5 rounded-xl border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary/5 transition-colors"
          >
            Ask a Question
          </a>
        </div>
      </div>
    </div>
  )
}
