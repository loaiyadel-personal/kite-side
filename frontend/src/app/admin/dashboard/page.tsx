'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Inbox, Images, UtensilsCrossed, ShoppingBag, Camera, Plus, Wind, ShoppingCart, type LucideIcon } from 'lucide-react'

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

function StatCard({
  label, value, icon: Icon, href,
}: {
  label: string; value: number | string; icon: LucideIcon; href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] transition-all duration-200 hover:border-brand-primary/25 hover:bg-white/[0.03]"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-none transition-colors duration-200 group-hover:bg-brand-primary/20 bg-brand-primary/10"
      >
        <Icon size={20} className="text-brand-primary" />
      </div>
      <div>
        <p className="text-white font-outfit font-bold text-2xl leading-none mb-0.5 tabular-nums">{value}</p>
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
        title={`${greeting}, ${admin?.name?.split(' ')[0] ?? 'Admin'}`}
        subtitle="Here's what's happening with your site"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Messages"  value={stats?.newMessages  ?? '–'} icon={Inbox}          href="/admin/contact" />
        <StatCard label="Gallery Items" value={stats?.galleryItems ?? '–'} icon={Images}         href="/admin/gallery" />
        <StatCard label="Menu Items"    value={stats?.menuItems    ?? '–'} icon={UtensilsCrossed} href="/admin/menu" />
        <StatCard label="Shop Items"    value={stats?.shopItems    ?? '–'} icon={ShoppingBag}    href="/admin/shop" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent messages */}
        <div
          className="rounded-2xl border border-white/[0.08] p-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-display font-semibold tracking-[-0.01em]">Recent Messages</h2>
            <Link href="/admin/contact" className="text-sm font-medium hover:underline text-brand-primary">
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-white/25 text-sm py-6 text-center">No messages yet</p>
          ) : (
            <div className="space-y-1">
              {recent.map(m => (
                <Link
                  key={m.id}
                  href={`/admin/contact?id=${m.id}`}
                  className="flex items-center justify-between py-2.5 px-2 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04] transition-all duration-150"
                >
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{m.name}</p>
                    {m.subject && <p className="text-white/35 text-xs truncate">{m.subject}</p>}
                  </div>
                  <p className="text-white/25 text-xs ml-3 flex-none">
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-2xl border border-white/[0.08] p-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <h2 className="text-white font-display font-semibold mb-5 tracking-[-0.01em]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              { label: 'Add Photo',     href: '/admin/gallery',  icon: Camera },
              { label: 'Add Menu Item', href: '/admin/menu',     icon: Plus },
              { label: 'Add Course',    href: '/admin/courses',  icon: Wind },
              { label: 'Add Product',   href: '/admin/shop',     icon: ShoppingCart },
            ] as { label: string; href: string; icon: LucideIcon }[]).map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] text-white/55 hover:text-white hover:border-brand-primary/25 hover:bg-white/[0.04] transition-all duration-150 text-sm font-medium"
              >
                <Icon size={15} className="flex-none" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
