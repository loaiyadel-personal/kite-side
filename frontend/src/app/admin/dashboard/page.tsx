'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface Stats {
  newMessages:  number
  galleryItems: number
  menuItems:    number
  shopItems:    number
}

interface RecentMessage {
  id:        string
  name:      string
  subject?:  string
  createdAt: string
}

function StatCard({ label, value, icon, href }: { label: string; value: number | string; icon: string; href: string }) {
  return (
    <Link href={href} className="bg-[#1e293b] border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-[#1a9fd4]/30 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-[#1a9fd4]/10 flex items-center justify-center text-2xl group-hover:bg-[#1a9fd4]/20 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-white font-outfit font-bold text-2xl">{value}</p>
        <p className="text-white/40 text-sm">{label}</p>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { token, admin } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentMessage[]>([])

  useEffect(() => {
    if (!token) return
    const h = { Authorization: `Bearer ${token}` }
    Promise.all([
      fetch(`${API}/contact?status=NEW&countOnly=true`, { headers: h }).then(r => r.ok ? r.json() : { count: 0 }),
      fetch(`${API}/gallery?countOnly=true`, { headers: h }).then(r => r.ok ? r.json() : { count: 0 }),
      fetch(`${API}/menu?countOnly=true`, { headers: h }).then(r => r.ok ? r.json() : { count: 0 }),
      fetch(`${API}/shop?countOnly=true`, { headers: h }).then(r => r.ok ? r.json() : { count: 0 }),
      fetch(`${API}/contact?limit=5`, { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([msg, gal, menu, shop, msgs]) => {
      setStats({
        newMessages:  msg.count ?? 0,
        galleryItems: gal.count ?? 0,
        menuItems:    menu.count ?? 0,
        shopItems:    shop.count ?? 0,
      })
      setRecent(Array.isArray(msgs) ? msgs : msgs.items ?? [])
    }).catch(() => {})
  }, [token])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${admin?.name?.split(' ')[0] ?? 'Admin'} 👋`}
        subtitle="Here's what's happening with your site"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Messages"  value={stats?.newMessages  ?? '–'} icon="📬" href="/admin/contact" />
        <StatCard label="Gallery Items" value={stats?.galleryItems ?? '–'} icon="🖼️" href="/admin/gallery" />
        <StatCard label="Menu Items"    value={stats?.menuItems    ?? '–'} icon="🍽️" href="/admin/menu" />
        <StatCard label="Shop Items"    value={stats?.shopItems    ?? '–'} icon="🏪" href="/admin/shop" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-outfit font-semibold">Recent Messages</h2>
            <Link href="/admin/contact" className="text-[#1a9fd4] text-sm hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-white/30 text-sm py-6 text-center">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recent.map(m => (
                <Link key={m.id} href={`/admin/contact?id=${m.id}`}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:opacity-80 transition-opacity">
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{m.name}</p>
                    {m.subject && <p className="text-white/40 text-xs truncate">{m.subject}</p>}
                  </div>
                  <p className="text-white/30 text-xs ml-3 flex-none">
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-outfit font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Photo',    href: '/admin/gallery', icon: '📸' },
              { label: 'Add Menu Item', href: '/admin/menu',   icon: '➕' },
              { label: 'Add Course',   href: '/admin/courses', icon: '🪁' },
              { label: 'Add Product',  href: '/admin/shop',    icon: '🛍️' },
            ].map(({ label, href, icon }) => (
              <Link key={label} href={href}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 flex items-center gap-2.5 text-white/60 hover:text-white transition-colors text-sm">
                <span>{icon}</span> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
