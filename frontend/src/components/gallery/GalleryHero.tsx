export default function GalleryHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-[#022b3d] overflow-hidden">
      {/* Subtle wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path
            d="M0,100 C180,160 360,40 540,100 C720,160 900,40 1080,100 C1260,160 1380,80 1440,100 L1440,200 L0,200 Z"
            fill="#1a9fd4"
          />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-[#1a9fd4] text-sm font-medium uppercase tracking-widest mb-4">
          Kite Side Beach Club
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-5">
          Gallery
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Life on the water — kite sessions, sunsets, and good food at Ras Sudr.
        </p>
      </div>
    </section>
  )
}
