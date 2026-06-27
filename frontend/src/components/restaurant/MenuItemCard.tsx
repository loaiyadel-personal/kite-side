import Image from 'next/image'

interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number | string
  imageUrl?: string | null
  tags: string[]
  isAvailable: boolean
}

function slugColor(tag: string): string {
  const map: Record<string, string> = {
    vegan: 'bg-green-100 text-green-700',
    vegetarian: 'bg-lime-100 text-lime-700',
    chicken: 'bg-yellow-100 text-yellow-700',
    beef: 'bg-red-100 text-red-700',
    seafood: 'bg-blue-100 text-blue-700',
    spicy: 'bg-orange-100 text-orange-700',
  }
  return map[tag] ?? 'bg-gray-100 text-gray-600'
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:4000'

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const imageUrl = item.imageUrl ? `${API_BASE}${item.imageUrl}` : null

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${!item.isAvailable ? 'opacity-70' : ''}`}>
      {/* Image or placeholder */}
      <div className="relative h-44 w-full overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a9fd4 0%, var(--color-brand-dark) 100%)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-12 h-12 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v2h6v-2c0-1.657-1.343-3-3-3zM5 21V8m14 13V8M3 3h18" />
            </svg>
          </div>
        )}

        {/* Sold out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-brand-dark text-base leading-snug mb-1">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-outfit font-bold text-lg text-brand-primary">
            {Number(item.price).toFixed(0)} LE
          </span>

          {item.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {item.tags.slice(0, 2).map((tag) => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${slugColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
