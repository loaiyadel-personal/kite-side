import { Award, Wind, Waves } from 'lucide-react'

export default function CoursesHero() {
  return (
    <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#022b3d] via-[#0a4f6e] to-[#1a9fd4]">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-24">
        {/* IKO badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white text-sm font-semibold mb-8 backdrop-blur-sm">
          <Award size={16} className="text-[#f5c842]" />
          IKO Certified Kitesurfing Center
        </div>

        <h1 className="font-outfit font-bold text-5xl md:text-6xl text-white leading-tight mb-6">
          Learn to Kite<br />
          <span className="text-[#1a9fd4]">in Ras Sudr</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          IKO certified courses for all levels — from first timers to instructors.
          Flat shallow water, consistent wind, and expert coaching.
        </p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <Wind size={24} className="text-[#1a9fd4] flex-none" />
            <div className="text-left">
              <div className="font-outfit font-bold text-2xl text-white">300+</div>
              <div className="text-white/60 text-sm">Wind Days / Year</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <Waves size={24} className="text-[#1a9fd4] flex-none" />
            <div className="text-left">
              <div className="font-outfit font-bold text-sm text-white leading-snug">Flat Shallow Water</div>
              <div className="text-white/60 text-sm">Perfect for learning</div>
            </div>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="mt-16 flex justify-center">
          <div className="animate-bounce w-8 h-8 flex items-center justify-center text-white/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
