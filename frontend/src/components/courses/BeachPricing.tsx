import { Sun, Umbrella, Droplets, Car } from 'lucide-react'
import type { PriceItem } from './RentalPricing'

const ICONS: Record<string, React.ElementType> = {
  'Day pass': Sun,
  'Sunbed + umbrella': Umbrella,
  'Shower': Droplets,
  'Parking': Car,
}

function fmt(v: number | string) {
  return typeof v === 'string' ? parseFloat(v).toLocaleString('en-EG') : v.toLocaleString('en-EG')
}

interface Props {
  items: PriceItem[]
}

export default function BeachPricing({ items }: Props) {
  if (!items.length) return null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-brand-dark text-center mb-3">
          Beach Club Access
        </h2>
        <p className="text-gray-500 text-center mb-10">Sun, sea, and everything in between</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map(item => {
            const Icon = ICONS[item.name] ?? Sun
            return (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-gray-100">
                <div className="w-12 h-12 bg-brand-dark/5 rounded-xl flex items-center justify-center">
                  <Icon size={22} className="text-[#0a6d96]" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-brand-dark">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                  )}
                </div>
                <div>
                  <div className="font-outfit font-bold text-xl text-brand-dark">{fmt(item.priceEGP)}</div>
                  <div className="text-xs text-gray-400">EGP · {item.unit}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
