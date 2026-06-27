'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import {
  LayoutDashboard, Inbox, Images, UtensilsCrossed, Wind,
  Tag, ShoppingBag, BarChart3, Users, Settings, type LucideIcon,
} from 'lucide-react'

const NAV: { group: string; items: { label: string; href: string; icon: LucideIcon }[] }[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Inbox',     href: '/admin/contact',   icon: Inbox },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Gallery',  href: '/admin/gallery',  icon: Images },
      { label: 'Menu',     href: '/admin/menu',     icon: UtensilsCrossed },
      { label: 'Courses',  href: '/admin/courses',  icon: Wind },
      { label: 'Pricing',  href: '/admin/pricing',  icon: Tag },
      { label: 'Shop',     href: '/admin/shop',     icon: ShoppingBag },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
]

const SUPER_ONLY: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Users',    href: '/admin/users',    icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminSidebar() {
  const { admin, logout, isSuperAdmin } = useAdminAuth()
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-60 flex-col flex-none bg-[#0f1d2b] border-r border-white/[0.06]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Kite Side" width={40} height={40} className="rounded-lg object-cover flex-none" />
          <div>
            <p className="font-outfit font-bold text-white text-base leading-none">Kite Side</p>
            <p className="text-white/35 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Admin navigation">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-white/25 text-xs font-semibold uppercase tracking-wider px-3 mb-1.5">{group}</p>
            {items.map(({ label, href, icon }) => (
              <NavLink key={href} href={href} icon={icon} label={label} active={pathname.startsWith(href)} />
            ))}
          </div>
        ))}

        {isSuperAdmin && (
          <div>
            <p className="text-white/25 text-xs font-semibold uppercase tracking-wider px-3 mb-1.5">System</p>
            {SUPER_ONLY.map(({ label, href, icon }) => (
              <NavLink key={href} href={href} icon={icon} label={label} active={pathname.startsWith(href)} />
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
        {admin && (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-none bg-brand-primary/18 text-brand-primary"
            >
              {initials(admin.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin.name}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${admin.role === 'SUPER_ADMIN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-brand-primary/15 text-brand-primary'}`}>
                {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs text-white/35 hover:text-white/70 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all duration-150">
            View Site ↗
          </a>
          <button onClick={logout}
            className="flex-1 text-xs text-white/35 hover:text-red-400 py-1.5 rounded-lg border border-white/[0.08] hover:border-red-400/30 transition-all duration-150">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavLink({
  href, icon: Icon, label, active,
}: {
  href: string; icon: LucideIcon; label: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? 'text-white bg-brand-primary/12'
          : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05]'
      }`}
    >
      {/* Active left indicator */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full transition-all duration-200 bg-brand-primary"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(-50%) scaleY(1)' : 'translateY(-50%) scaleY(0)',
        }}
        aria-hidden="true"
      />
      <Icon
        size={16}
        className={`flex-none ${active ? 'text-brand-primary' : ''}`}
        aria-hidden="true"
      />
      {label}
    </Link>
  )
}
