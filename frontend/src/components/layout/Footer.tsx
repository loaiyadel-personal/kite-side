import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Courses', href: '/courses' },
  { label: 'Restaurant', href: '/restaurant' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.126 1.523 5.868L.057 23.868l6.195-1.623A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.601-.487-5.113-1.342l-.366-.216-3.676.964.98-3.578-.239-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#022b3d' }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + tagline + socials */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Image src="/logo.jpg" alt="Kite Side" width={40} height={40} className="rounded-full border-2 border-white/20" />
            <span className="font-outfit font-bold text-2xl">KITE SIDE</span>
          </div>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            IKO certified kitesurfing center on Egypt's Red Sea. Learn, ride, and explore Ras Sudr.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/kite_side"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com/p/Kite-Side-100093408729310"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://wa.me/201116407080"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-outfit font-semibold text-base mb-4 text-white/80 uppercase tracking-wider text-sm">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-outfit font-semibold text-base mb-4 text-white/80 uppercase tracking-wider text-sm">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Ras Sudr, South Sinai, Egypt</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📞</span>
              <a href="https://wa.me/201116407080" className="hover:text-white transition-colors">
                +20 11 16407080
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span>✉️</span>
              <a href="mailto:Ahmedyehya47@gmail.com" className="hover:text-white transition-colors">
                Ahmedyehya47@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Kite Side. All rights reserved.
      </div>
    </footer>
  )
}
