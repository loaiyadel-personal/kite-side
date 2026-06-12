import { Instagram } from 'lucide-react'

export default function InstagramCTA() {
  return (
    <section className="py-20 px-4 bg-[#022b3d]">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a9fd4]/20 mb-6">
          <Instagram size={28} className="text-[#1a9fd4]" />
        </div>
        <h2 className="font-outfit font-bold text-3xl text-white mb-3">
          Follow our story
        </h2>
        <p className="text-white/50 mb-8">
          Behind-the-scenes, daily conditions, and the moments we don&apos;t post here.
        </p>
        <a
          href="https://www.instagram.com/kite_side/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a9fd4] text-white font-semibold text-sm hover:bg-[#1589b8] transition-colors"
        >
          <Instagram size={18} />
          @kite_side
        </a>
      </div>
    </section>
  )
}
