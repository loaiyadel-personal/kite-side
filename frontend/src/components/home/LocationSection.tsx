'use client'

import { MapPin, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'

const INFO_CARDS = [
  { icon: MapPin, label: 'Address', detail: 'Inside Paradise Resort, Ras Sudr, South Sinai Governorate, Egypt 8742101' },
  { icon: Car,    label: 'From Cairo', detail: '130km via Ahmed Hamdi Tunnel (2.5 hrs)' },
  { icon: Car,    label: 'From Sharm', detail: '200km via coastal road (2.5 hrs)' },
]

export default function LocationSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary"
          >
            Location
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-4xl sm:text-5xl text-brand-dark tracking-[-0.02em]"
          >
            Find Us in Ras Sudr
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-gray-500 text-sm">
            Inside Paradise Resort · South Sinai, Egypt
          </motion.p>
        </motion.div>

        {/* Map embed */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ boxShadow: '0 8px 40px 0 rgba(2,43,61,0.12)', border: '1px solid rgba(90,172,188,0.15)' }}
        >
          <iframe
            src="https://maps.google.com/maps?q=29.4945477,32.7339648&z=17&output=embed"
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kite Side — Inside Paradise Resort, Ras Sudr, Egypt"
          />
        </motion.div>

        {/* Info cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          {INFO_CARDS.map(({ icon: Icon, label, detail }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-brand-surface rounded-xl p-5 flex items-start gap-3 border border-brand-primary/15"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-none mt-0.5 bg-brand-primary/15"
              >
                <Icon size={16} className="text-brand-primary" />
              </div>
              <div>
                <div className="font-semibold text-brand-dark text-sm">{label}</div>
                <div className="text-gray-500 text-sm mt-0.5 leading-relaxed">{detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="https://maps.app.goo.gl/2wMvsj449P4FDDRe8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 bg-brand-primary hover:shadow-[0_0_24px_rgba(90,172,188,0.5)] hover:scale-105 active:scale-[0.97]"
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </motion.div>
      </div>
    </section>
  )
}
