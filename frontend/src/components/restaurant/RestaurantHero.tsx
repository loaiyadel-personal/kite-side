import Image from 'next/image'
import { Clock, MapPin } from 'lucide-react'

export default function RestaurantHero() {
  return (
    <section
      className="relative py-24 px-4 text-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #022b3d 0%, #0a4f6e 50%, #1284a8 100%)' }}
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg"
            alt="Kite Side Beach Club"
            width={100}
            height={100}
            className="rounded-full border-4 border-white/25 shadow-[0_8px_40px_rgba(90,172,188,0.25)]"
            priority
          />
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mb-3 tracking-[-0.02em]">
          Kite Side Beach Club
        </h1>
        <p className="text-xl text-white/75 mb-8 leading-relaxed">
          Fresh food, sea views, good vibes
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
            <Clock size={14} className="text-brand-primary" />
            Open Daily 9:00 AM — Late
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
            <MapPin size={14} className="text-brand-primary" />
            Ras Sudr, Red Sea
          </span>
        </div>

        <a
          href="https://wa.me/201116407080?text=Hi!%20I'd%20like%20to%20reserve%20a%20table%20at%20Kite%20Side%20Beach%20Club"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.45)] active:scale-[0.97] shadow-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          Reserve a Table
        </a>
      </div>
    </section>
  )
}
