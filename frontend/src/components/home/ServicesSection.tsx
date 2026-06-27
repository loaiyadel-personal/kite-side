'use client'

import Link from 'next/link'
import { Wind, UtensilsCrossed, ShoppingBag, Camera, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'

const SERVICES: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: Wind,
    title: 'Kite Courses',
    description: 'From beginner to IKO certified — structured lessons in perfect conditions.',
    href: '/courses',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant',
    description: 'Fresh food with a sea view. Fuel up before and after your session.',
    href: '/restaurant',
  },
  {
    icon: ShoppingBag,
    title: 'Gear Shop',
    description: 'Buy and rent equipment. Everything you need to get on the water.',
    href: '/shop',
  },
  {
    icon: Camera,
    title: 'Gallery',
    description: 'See the spot and the vibe. Wind, waves, and good times.',
    href: '/gallery',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 px-4 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary"
          >
            What We Offer
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-4xl sm:text-5xl text-brand-dark tracking-[-0.02em]"
          >
            Everything at the Beach
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
        >
          {SERVICES.map(({ icon: Icon, title, description, href }) => (
            <motion.div key={href} variants={fadeUp}>
              <Link
                href={href}
                className="group block bg-white rounded-2xl p-7 border border-brand-surface transition-all duration-200 hover:-translate-y-2 hover:border-brand-primary/30 focus-visible:border-brand-primary shadow-card hover:shadow-card-hover"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200 group-hover:bg-brand-primary/20 bg-brand-primary/12"
                >
                  <Icon size={22} className="text-brand-primary" />
                </div>
                <h3
                  className="font-display font-bold text-xl text-brand-dark mb-2 transition-colors duration-200 group-hover:text-brand-deep tracking-[-0.01em]"
                >
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
