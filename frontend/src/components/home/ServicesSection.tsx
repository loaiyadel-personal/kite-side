import Link from 'next/link'

const SERVICES = [
  {
    emoji: '🪁',
    title: 'Kite Courses',
    description: 'From beginner to IKO certified — structured lessons in perfect conditions.',
    href: '/courses',
  },
  {
    emoji: '🍽️',
    title: 'Restaurant',
    description: 'Fresh food with a sea view. Fuel up before and after your session.',
    href: '/restaurant',
  },
  {
    emoji: '🏪',
    title: 'Gear Shop',
    description: 'Buy and rent equipment. Everything you need to get on the water.',
    href: '/shop',
  },
  {
    emoji: '📸',
    title: 'Gallery',
    description: 'See the spot and the vibe. Wind, waves, and good times.',
    href: '/gallery',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-[#0a6d96]">
            What We Offer
          </span>
          <h2 className="font-outfit font-bold text-4xl text-[#022b3d]">Everything at the Beach</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ emoji, title, description, href }) => (
            <Link
              key={href}
              href={href}
              className="group block bg-gray-50 rounded-2xl p-6 border-2 border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-[#0a6d96] hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-outfit font-bold text-xl text-[#022b3d] mb-2 group-hover:text-[#0a6d96] transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
