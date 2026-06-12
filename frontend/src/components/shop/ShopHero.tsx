export default function ShopHero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '55vh' }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022b3d] via-[#034a6a] to-[#1a9fd4]" />

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      <div className="relative text-center px-4 py-24">
        <p className="text-[#1a9fd4] bg-white/10 inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
          Kite Side Pro Shop
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-4">
          Gear Up for the Water
        </h1>
        <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
          Buy and rent quality kitesurfing equipment in Ras Sudr.
          Expert advice included.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full border border-white/20">
            🏪 In-store at Ras Sudr
          </span>
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full border border-white/20">
            💬 Order via WhatsApp
          </span>
        </div>
      </div>
    </section>
  )
}
