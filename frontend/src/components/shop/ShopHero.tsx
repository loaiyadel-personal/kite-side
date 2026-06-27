import { Store, MessageCircle } from 'lucide-react'

export default function ShopHero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '55vh' }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #022b3d 0%, #0a4f6e 45%, #1284a8 100%)' }} />

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-15" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      <div className="relative text-center px-4 py-24">
        <p className="text-brand-primary bg-white/10 inline-block px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-5 border border-white/15">
          Kite Side Pro Shop
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4 tracking-[-0.02em]">
          Gear Up for the Water
        </h1>
        <p className="text-white/70 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          Buy and rent quality kitesurfing equipment in Ras Sudr.
          Expert advice included.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full border border-white/20">
            <Store size={14} className="text-brand-primary" />
            In-store at Ras Sudr
          </span>
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full border border-white/20">
            <MessageCircle size={14} className="text-brand-primary" />
            Order via WhatsApp
          </span>
        </div>
      </div>
    </section>
  )
}
