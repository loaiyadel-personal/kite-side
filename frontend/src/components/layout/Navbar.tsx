'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Courses', href: '/courses' },
  { label: 'Restaurant', href: '/restaurant' },
  { label: 'Shop', href: '/shop' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-brand-dark/95 backdrop-blur-lg shadow-[0_1px_0_0_rgba(90,172,188,0.18),0_4px_24px_rgba(2,43,61,0.2)]'
          : 'bg-white/5 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.jpg"
            alt="Kite Side"
            width={36}
            height={36}
            className="rounded-full border-2 border-white/20 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-outfit font-bold text-xl text-white tracking-wider">KITE SIDE</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
                    isActive ? 'text-brand-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand-primary"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Contact Us CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 transition-all duration-200"
        >
          Contact Us
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-dark/98 backdrop-blur-md border-t border-white/10 px-4 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-3 py-3 rounded-xl text-base font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-primary/15 text-brand-primary border-l-2 border-brand-primary pl-[10px]'
                        : 'text-white/80 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href="/contact"
            className="mt-4 flex items-center justify-center w-full px-4 py-3 rounded-full text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  )
}
