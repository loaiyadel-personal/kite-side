'use client'

export type GalleryFilter = 'all' | 'photos' | 'videos' | 'kiting' | 'restaurant' | 'spot'

const FILTERS: { id: GalleryFilter; label: string }[] = [
  { id: 'all',        label: 'All'        },
  { id: 'photos',     label: 'Photos'     },
  { id: 'videos',     label: 'Videos'     },
  { id: 'kiting',     label: 'Kiting'     },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'spot',       label: 'The Spot'   },
]

interface Props {
  active:    GalleryFilter
  onChange:  (f: GalleryFilter) => void
  counts:    Partial<Record<GalleryFilter, number>>
}

export default function GalleryFilters({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 py-8 px-4">
      {FILTERS.map(({ id, label }) => {
        const count = counts[id]
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={[
              'px-5 py-2 rounded-full text-sm font-medium transition-all',
              isActive
                ? 'bg-[#1a9fd4] text-white shadow-md shadow-[#1a9fd4]/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            {label}
            {count !== undefined && (
              <span className={`ml-1.5 text-xs ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
