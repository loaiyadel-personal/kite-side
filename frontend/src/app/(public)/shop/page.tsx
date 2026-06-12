import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ShopHero from '@/components/shop/ShopHero'
import WhyBuyFromUs from '@/components/shop/WhyBuyFromUs'
import ShopContent from '@/components/shop/ShopContent'
import RentalSection from '@/components/shop/RentalSection'
import BeachPricing from '@/components/shop/BeachPricing'

export const metadata = {
  title: 'Shop & Rentals — Kite Side Beach Club Ras Sudr',
  description: 'Buy and rent kitesurfing equipment at Kite Side Beach Club in Ras Sudr, Egypt. Kites, boards, harnesses, wetsuits and accessories.',
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function fetchShopItems() {
  try {
    const res = await fetch(`${API}/shop`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function fetchPricing() {
  try {
    const res = await fetch(`${API}/pricing`, { next: { revalidate: 60 } })
    if (!res.ok) return { rentals: [], beach: [] }
    return res.json()
  } catch { return { rentals: [], beach: [] } }
}

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

export default async function ShopPage() {
  const [shopItems, pricing] = await Promise.all([fetchShopItems(), fetchPricing()])

  return (
    <>
      <Navbar />
      <main>
        <ShopHero />
        <WhyBuyFromUs />

        {/* Shop grid with filter tabs — client component */}
        <ShopContent items={shopItems} />

        <RentalSection rentals={pricing.rentals ?? []} />
        <BeachPricing  beach={pricing.beach ?? []} />

        {/* WhatsApp CTA strip */}
        <section className="py-16 px-4 bg-[#022b3d]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-outfit font-bold text-2xl text-white mb-2">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-white/50 mb-6">
              Our team is on the beach every day. Message us and we&apos;ll help you out.
            </p>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm looking for some gear and could use some help.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a9fd4] text-white font-semibold text-sm hover:bg-[#1589b8] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Chat with us on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
