'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  return (
    <section
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #022b3d 0%, #0a6d96 60%, #0e8bb5 100%)' }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium text-white/80 border border-white/20 bg-white/10 backdrop-blur-sm">
          🌊 Ras Sudr, Red Sea, Egypt
        </span>

        <h1 className="font-outfit font-bold text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-6 drop-shadow-lg">
          Ride the Wind
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
          IKO Certified Kitesurfing Center on Egypt's Most Consistent Wind Spot
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/courses"
            className="px-8 py-4 rounded-full font-semibold text-white text-base transition-all hover:brightness-110 hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#0a6d96' }}
          >
            Book a Course
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-4 rounded-full font-semibold text-white text-base border-2 border-white/60 transition-all hover:bg-white/10 hover:scale-105"
          >
            View Gallery
          </Link>
        </div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-white/50" />
      </div>
    </section>
  )
}
