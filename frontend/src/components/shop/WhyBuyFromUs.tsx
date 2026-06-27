const REASONS = [
  {
    icon: '🏷️',
    title: 'Competitive Prices',
    desc:  'Best prices on quality kite gear in Egypt',
  },
  {
    icon: '🔧',
    title: 'Expert Advice',
    desc:  'Our IKO instructors help you choose the right gear for your level',
  },
  {
    icon: '✅',
    title: 'Quality Guaranteed',
    desc:  'All equipment tested and approved by our instructors',
  },
  {
    icon: '🚚',
    title: 'Available In-Store',
    desc:  'Try before you buy at our Ras Sudr beach location',
  },
]

export default function WhyBuyFromUs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-brand-primary/5 transition-colors">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-outfit font-bold text-brand-dark mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
