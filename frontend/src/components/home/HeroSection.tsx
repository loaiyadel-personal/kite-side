'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()

  // Subtle floating particles (wind effect)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0.3 + Math.random() * 0.7,
        vy: -0.1 - Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    let raf: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(228, 201, 122, ${p.opacity})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  const initial = prefersReduced ? false : { opacity: 0, y: 32 }
  const animate = prefersReduced ? {} : { opacity: 1, y: 0 }

  return (
    <section
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #022b3d 0%, #0a4f6e 45%, #1284a8 100%)' }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(90,172,188,0.18) 0%, transparent 65%)' }}
      />

      {/* Bottom wave fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-16 md:h-20">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pb-20">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logo.jpg"
            alt="Kite Side"
            width={120}
            height={120}
            className="rounded-full border-4 border-white/25 shadow-[0_8px_40px_rgba(90,172,188,0.3)]"
            priority
          />
        </motion.div>

        <motion.span
          className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-medium text-white/80 border border-white/20 bg-white/8 backdrop-blur-sm tracking-widest uppercase"
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Ras Sudr, Red Sea, Egypt
        </motion.span>

        <motion.h1
          className="font-display font-bold text-6xl sm:text-7xl md:text-[5.5rem] text-white leading-[1.05] mb-6 tracking-[-0.02em]"
          initial={initial}
          animate={animate}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Ride the{' '}
          <span className="text-hero-gradient">Wind</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-[1.7]"
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          IKO Certified Kitesurfing Center on Egypt's Most Consistent Wind Spot
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/courses"
              className="inline-block px-9 py-4 rounded-full font-semibold text-white text-base bg-brand-primary transition-all duration-200 hover:shadow-[0_0_28px_rgba(90,172,188,0.55)] hover:brightness-110"
            >
              Book a Course
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/gallery"
              className="inline-block px-9 py-4 rounded-full font-semibold text-white text-base border-2 border-white/40 transition-all duration-200 hover:bg-white/10 hover:border-white/70"
            >
              View Gallery
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown size={28} className="text-white/40" />
      </div>
    </section>
  )
}
