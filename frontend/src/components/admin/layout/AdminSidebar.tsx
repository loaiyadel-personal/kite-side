'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',   href: '/admin/dashboard',  icon: '📊' },
      { label: 'Inbox',       href: '/admin/contact',    icon: '📬' },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Gallery',  href: '/admin/gallery',   icon: '🖼️' },
      { label: 'Menu',     href: '/admin/menu',      icon: '🍽️' },
      { label: 'Courses',  href: '/admin/courses',   icon: '🪁' },
      { label: 'Pricing',  href: '/admin/pricing',   icon: '💰' },
      { label: 'Shop',     href: '/admin/shop',      icon: '🏪' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    ],
  },
]

const SUPER_ONLY = [
  { label: 'Users',    href: '/admin/users',    icon: '👥' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminSidebar() {
  const { admin, logout, isSuperAdmin } = useAdminAuth()
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-60 flex-col flex-none bg-[#1e293b] border-r border-white/5">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Kite Side" width={40} height={40} className="rounded-lg object-cover flex-none" />
          <div>
            <p className="font-outfit font-bold text-white text-base leading-none">Kite Side</p>
            <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-1">{group}</p>
            {items.map(({ label, href, icon }) => (
              <NavLink key={href} href={href} icon={icon} label={label} active={pathname.startsWith(href)} />
            ))}
          </div>
        ))}

        {isSuperAdmin && (
          <div>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-1">System</p>
            {SUPER_ONLY.map(({ label, href, icon }) => (
              <NavLink key={href} href={href} icon={icon} label={label} active={pathname.startsWith(href)} />
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-4 space-y-3">
        {admin && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a9fd4]/20 flex items-center justify-center text-[#1a9fd4] text-sm font-bold flex-none">
              {initials(admin.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin.name}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${admin.role === 'SUPER_ADMIN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#1a9fd4]/20 text-[#1a9fd4]'}`}>
                {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs text-white/40 hover:text-white/70 py-1.5 rounded border border-white/10 hover:border-white/20 transition-colors">
            View Site ↗
          </a>
          <button onClick={logout}
            className="flex-1 text-xs text-white/40 hover:text-red-400 py-1.5 rounded border border-white/10 hover:border-red-400/30 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link href={href}
      className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-[#1a9fd4]/10 text-[#1a9fd4] border-l-2 border-[#1a9fd4] pl-[6px]'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      }`}>
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  )
}
