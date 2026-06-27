'use client'

import { Wind, Ruler, Car, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'

const STATS = [
  { icon: Wind,   value: '300+',   unit: 'Wind Days / Year' },
  { icon: Ruler,  value: '1–2m',   unit: 'Water Depth (ideal for learning)' },
  { icon: Car,    value: '130km',  unit: 'From Cairo (2.5 hr drive)' },
  { icon: Trophy, value: 'IKO',    unit: 'Certified Center' },
]

export default function AboutSection() {
  return (
    <section className="py-24 px-4 bg-brand-dark">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary"
          >
            About Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight tracking-[-0.02em]"
          >
            Egypt's Premier Kite Spot
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/65 text-lg leading-[1.75] mb-8"
          >
            Kite Side is an IKO certified kitesurfing center located in Ras Sudr, on the western
            shore of the Sinai Peninsula. With over 300 wind days per year and flat shallow water
            stretching for kilometers, Ras Sudr is one of the world's best spots for learning and
            progressing in kitesurfing.
          </motion.p>
          <motion.div variants={fadeUp}>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-primary/40 text-brand-primary font-semibold text-sm transition-all duration-200 hover:bg-brand-primary/10"
            >
              <Trophy size={15} />
              IKO Certified Center
            </div>
          </motion.div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          {STATS.map(({ icon: Icon, value, unit }) => (
            <motion.div
              key={unit}
              variants={fadeUp}
              className="rounded-2xl p-6 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.08] bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <Icon size={22} className="text-brand-primary" />
              <div className="font-outfit font-bold text-3xl text-white">{value}</div>
              <div className="text-sm text-white/50 leading-snug">{unit}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
