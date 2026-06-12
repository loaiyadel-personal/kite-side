import { Car } from 'lucide-react'

const directions = [
  {
    from: 'From Cairo',
    detail: '130 km via Ahmed Hamdi Tunnel',
    time: 'Approximately 2.5 hours',
  },
  {
    from: 'From Sharm El Sheikh',
    detail: '200 km via coastal road',
    time: 'Approximately 2.5 hours',
  },
  {
    from: 'From Suez',
    detail: '45 km south on coastal road',
    time: 'Approximately 45 minutes',
  },
]

export default function ContactMap() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-[#022b3d] text-center mb-10">
          How to Find Us
        </h2>

        {/* Map embed — exact pin (29.4945477°N, 32.7339648°E) */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-8">
          <iframe
            src="https://maps.google.com/maps?q=29.4945477,32.7339648&z=17&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kite Side — Inside Paradise Resort, Ras Sudr, Egypt"
          />
        </div>

        {/* Directions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {directions.map(({ from, detail, time }) => (
            <div key={from} className="bg-gray-50 rounded-2xl p-5 flex gap-3">
              <Car size={20} className="text-[#1a9fd4] flex-none mt-0.5" />
              <div>
                <div className="font-semibold text-[#022b3d] text-sm">{from}</div>
                <div className="text-gray-500 text-xs mt-1">{detail}</div>
                <div className="text-gray-400 text-xs">{time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="https://maps.app.goo.gl/2wMvsj449P4FDDRe8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#022b3d] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0a4f6e] transition-colors"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </section>
  )
}
