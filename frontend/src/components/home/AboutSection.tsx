import { Wind, Ruler, Car, Trophy } from 'lucide-react'

const STATS = [
  { icon: Wind,   value: '300+',   unit: 'Wind Days / Year' },
  { icon: Ruler,  value: '1–2m',   unit: 'Water Depth (ideal for learning)' },
  { icon: Car,    value: '130km',  unit: 'From Cairo (2.5 hr drive)' },
  { icon: Trophy, value: 'IKO',    unit: 'Certified Center' },
]

export default function AboutSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-[#0a6d96]">
            About Us
          </span>
          <h2 className="font-outfit font-bold text-4xl text-[#022b3d] mb-6 leading-tight">
            Egypt's Premier Kite Spot
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Kite Side is an IKO certified kitesurfing center located in Ras Sudr, on the western
            shore of the Sinai Peninsula. With over 300 wind days per year and flat shallow water
            stretching for kilometers, Ras Sudr is one of the world's best spots for learning and
            progressing in kitesurfing.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0a6d96] text-[#0a6d96] font-semibold text-sm">
            🏆 IKO Certified Center
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {STATS.map(({ icon: Icon, value, unit }) => (
            <div
              key={unit}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2"
            >
              <Icon size={24} className="text-[#0a6d96]" />
              <div className="font-outfit font-bold text-3xl text-[#022b3d]">{value}</div>
              <div className="text-sm text-gray-500 leading-snug">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
