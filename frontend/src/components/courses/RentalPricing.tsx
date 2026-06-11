import { Package } from 'lucide-react'

export interface PriceItem {
  id: string
  category: string
  name: string
  description?: string | null
  priceEGP: number | string
  priceUSD?: number | string | null
  unit: string
}

interface Props {
  items: PriceItem[]
}

function fmt(v: number | string) {
  return typeof v === 'string' ? parseFloat(v).toLocaleString('en-EG') : v.toLocaleString('en-EG')
}

export default function RentalPricing({ items }: Props) {
  if (!items.length) return null

  const fullGear = items.find(i => i.category === 'RENTAL_FULL_GEAR')
  const others = items.filter(i => i.category !== 'RENTAL_FULL_GEAR')

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-[#022b3d] text-center mb-3">
          Equipment Rental
        </h2>
        <p className="text-gray-500 text-center mb-10">Rent by the session or day</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          <table className="w-full">
            <thead>
              <tr className="bg-[#022b3d] text-white text-sm">
                <th className="text-left px-5 py-3 font-semibold">Item</th>
                <th className="text-right px-5 py-3 font-semibold">EGP</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">USD</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">Unit</th>
              </tr>
            </thead>
            <tbody>
              {others.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3.5 text-sm font-medium text-[#022b3d]">{item.name}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-semibold text-[#022b3d]">{fmt(item.priceEGP)}</td>
                  <td className="px-5 py-3.5 text-sm text-right text-gray-500 hidden sm:table-cell">
                    {item.priceUSD != null ? `$${fmt(item.priceUSD)}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-right text-gray-400 hidden sm:table-cell">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fullGear && (
          <div className="bg-[#022b3d] text-white rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1a9fd4]/20 rounded-xl flex items-center justify-center flex-none">
              <Package size={20} className="text-[#1a9fd4]" />
            </div>
            <div className="flex-1">
              <div className="font-outfit font-bold text-lg">Full Gear Package — Best Value</div>
              {fullGear.description && <p className="text-white/60 text-sm">{fullGear.description}</p>}
            </div>
            <div className="text-right">
              <div className="font-outfit font-bold text-2xl">{fmt(fullGear.priceEGP)} EGP</div>
              {fullGear.priceUSD != null && (
                <div className="text-white/50 text-sm">~${fmt(fullGear.priceUSD)} USD</div>
              )}
              <div className="text-white/40 text-xs">{fullGear.unit}</div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          All equipment is regularly inspected and maintained
        </p>
      </div>
    </section>
  )
}
