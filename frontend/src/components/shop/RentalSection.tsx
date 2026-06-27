const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

function fmt(v: string | number | null | undefined, fallback = '—') {
  if (v == null) return fallback
  const n = Number(v)
  return isNaN(n) ? fallback : n.toLocaleString('en-EG', { maximumFractionDigits: 0 })
}

interface PriceItem {
  id:           string
  name:         string
  description:  string | null
  priceEGP:     string | number
  priceUSD:     string | number | null
  unit:         string
  isHighlighted: boolean
}

interface Props {
  rentals: PriceItem[]
}

export default function RentalSection({ rentals }: Props) {
  if (!rentals.length) return null

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-brand-dark mb-2">
            Equipment Rental
          </h2>
          <p className="text-gray-500">Rent by the session — no commitment needed</p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-brand-dark text-white text-sm font-semibold px-6 py-3">
            <span>Equipment</span>
            <span className="text-center">Price (EGP)</span>
            <span className="text-right">Unit</span>
          </div>

          {/* Rows */}
          {rentals.map(item => (
            <div
              key={item.id}
              className={[
                'grid grid-cols-3 items-center px-6 py-4 border-b border-gray-100 last:border-b-0 transition-colors',
                item.isHighlighted
                  ? 'bg-brand-primary/10 border-l-4 border-l-brand-primary'
                  : 'bg-white hover:bg-gray-50',
              ].join(' ')}
            >
              <div>
                <p className={`font-semibold text-sm ${item.isHighlighted ? 'text-brand-primary' : 'text-brand-dark'}`}>
                  {item.name}
                  {item.isHighlighted && (
                    <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">Best Value</span>
                  )}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                )}
              </div>
              <div className="text-center">
                <p className="font-outfit font-bold text-brand-primary text-lg">{fmt(item.priceEGP)}</p>
                {item.priceUSD && (
                  <p className="text-xs text-gray-400">~{fmt(item.priceUSD)} USD</p>
                )}
              </div>
              <p className="text-right text-xs text-gray-500">{item.unit}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          All rental equipment is regularly inspected and safety-checked
        </p>

        <div className="text-center mt-8">
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to rent equipment at Kite Side")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-[#1589b8] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Rent Now
          </a>
        </div>
      </div>
    </section>
  )
}
