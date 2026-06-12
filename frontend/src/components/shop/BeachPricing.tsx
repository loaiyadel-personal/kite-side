const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

function fmt(v: string | number | null | undefined) {
  if (v == null) return '—'
  const n = Number(v)
  return isNaN(n) ? '—' : n.toLocaleString('en-EG', { maximumFractionDigits: 0 })
}

const BEACH_ICONS: Record<string, string> = {
  'Day Pass':         '☀️',
  'Sunbed + Umbrella': '🏖️',
  'Shower':           '🚿',
  'Parking':          '🚗',
  'Locker':           '🔒',
}

interface PriceItem {
  id:          string
  name:        string
  description: string | null
  priceEGP:    string | number
  priceUSD:    string | number | null
  unit:        string
}

interface Props {
  beach: PriceItem[]
}

export default function BeachPricing({ beach }: Props) {
  if (!beach.length) return null

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-outfit font-bold text-3xl text-[#022b3d] mb-2">
            Beach Club Access
          </h2>
          <p className="text-gray-500">Everything you need for a perfect day on the beach</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {beach.map(item => (
            <div key={item.id} className="text-center p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#1a9fd4]/30 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{BEACH_ICONS[item.name] ?? '🏝️'}</div>
              <h3 className="font-semibold text-[#022b3d] text-sm mb-2 leading-tight">{item.name}</h3>
              <p className="font-outfit font-bold text-xl text-[#1a9fd4]">
                {fmt(item.priceEGP)}
                <span className="text-xs font-normal text-gray-400 ml-1">EGP</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.unit}</p>
              {item.description && (
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center bg-[#022b3d]/5 rounded-2xl p-6">
          <p className="text-sm text-gray-600 mb-4">
            Day pass includes beach access, shower and locker
          </p>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to book a day at Kite Side Beach Club")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#022b3d] text-white font-semibold text-sm hover:bg-[#034a6a] transition-colors"
          >
            Book Your Day
          </a>
        </div>
      </div>
    </section>
  )
}
