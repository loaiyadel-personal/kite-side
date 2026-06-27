'use client'

export type ShopFilter = 'all' | 'kites' | 'boards' | 'harnesses' | 'accessories' | 'wetsuits' | 'bags'

const FILTERS: { id: ShopFilter; label: string }[] = [
  { id: 'all',         label: 'All'         },
  { id: 'kites',       label: 'Kites'       },
  { id: 'boards',      label: 'Boards'      },
  { id: 'harnesses',   label: 'Harnesses'   },
  { id: 'accessories', label: 'Accessories' },
  { id: 'wetsuits',    label: 'Wetsuits'    },
  { id: 'bags',        label: 'Bags'        },
]

interface Props {
  active:  ShopFilter
  onChange: (f: ShopFilter) => void
  counts:  Partial<Record<ShopFilter, number>>
}

export default function ShopFilters({ active, onChange, counts }: Props) {
  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0 sm:justify-center py-6">
        {FILTERS.map(({ id, label }) => {
          const count = counts[id]
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={[
                'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30'
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
    </div>
  )
}
