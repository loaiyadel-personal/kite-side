import { Zap } from 'lucide-react'

export default function ContactHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#022b3d] via-[#0a4f6e] to-[#1a9fd4]"
      style={{ minHeight: '50vh' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6 backdrop-blur-sm">
          <Zap size={14} className="text-[#f5c842]" />
          We reply within 24 hours
        </div>
        <h1 className="font-outfit font-bold text-5xl md:text-6xl text-white leading-tight mb-5">
          Get in Touch
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Questions about courses, reservations, or just want to say hi?
          We'd love to hear from you.
        </p>
      </div>
    </section>
  )
}
