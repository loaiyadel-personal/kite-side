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
  { label: 'Contact', href: '/contact' },
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

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-[#022b3d] shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="Kite Side"
            width={36}
            height={36}
            className="rounded-full border-2 border-white/20"
          />
          <span className="font-outfit font-bold text-xl text-white tracking-wide">KITE SIDE</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-[#0a6d96] ${
                  pathname === href ? 'text-[#0a6d96]' : 'text-white/90'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/201116407080"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          WhatsApp
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#022b3d] border-t border-white/10 px-4 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    pathname === href
                      ? 'bg-[#0a6d96]/20 text-[#0a6d96]'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/201116407080"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      )}
    </header>
  )
}
