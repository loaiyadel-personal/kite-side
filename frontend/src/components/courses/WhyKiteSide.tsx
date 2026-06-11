import { Trophy, Wind, Waves, Users } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'IKO Certified',
    desc: 'Official IKO certification recognized worldwide. Train with accredited instructors following international standards.',
    color: 'text-[#f5c842]',
    bg: 'bg-amber-50',
  },
  {
    icon: Wind,
    title: 'Best Wind Spot',
    desc: '300+ wind days per year with consistent thermal winds — one of the most reliable kite spots on the Red Sea.',
    color: 'text-[#1a9fd4]',
    bg: 'bg-sky-50',
  },
  {
    icon: Waves,
    title: 'Flat Water',
    desc: 'Shallow flat lagoon perfect for learning safely. No waves, no currents — ideal conditions for beginners.',
    color: 'text-[#0a6d96]',
    bg: 'bg-teal-50',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Multilingual IKO certified instructors with years of experience. Small groups ensure personalized attention.',
    color: 'text-[#e84a2e]',
    bg: 'bg-red-50',
  },
]

export default function WhyKiteSide() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-[#022b3d] text-center mb-4">
          Why Learn at Kite Side?
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Everything you need for a safe, fun, and certified kitesurfing journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={24} className={color} />
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-[#022b3d] text-lg mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
