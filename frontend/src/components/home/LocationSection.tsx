const INFO_CARDS = [
  { emoji: '📍', label: 'Address', detail: 'Ras Sudr, South Sinai, Egypt' },
  { emoji: '🚗', label: 'From Cairo', detail: '130km via Ahmed Hamdi Tunnel (2.5 hrs)' },
  { emoji: '🚗', label: 'From Sharm', detail: '200km via coastal road (2.5 hrs)' },
]

export default function LocationSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-[#0a6d96]">
            Location
          </span>
          <h2 className="font-outfit font-bold text-4xl text-[#022b3d]">Find Us in Ras Sudr</h2>
        </div>

        {/* Map embed */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3422.0!2d32.6977!3d29.5997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRas+Sudr!5e0!3m2!1sen!2seg!4v1234567890"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kite Side location — Ras Sudr, Egypt"
          />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {INFO_CARDS.map(({ emoji, label, detail }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <div className="font-semibold text-[#022b3d] text-sm">{label}</div>
                <div className="text-gray-500 text-sm mt-0.5">{detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://maps.google.com/?q=Ras+Sudr+Kite+Side+Egypt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:brightness-110 hover:scale-105"
            style={{ backgroundColor: '#0a6d96' }}
          >
            📍 Get Directions
          </a>
        </div>
      </div>
    </section>
  )
}
