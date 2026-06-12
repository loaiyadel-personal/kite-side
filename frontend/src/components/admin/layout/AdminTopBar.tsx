'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import NotificationBell from './NotificationBell'
import AdminSidebar from './AdminSidebar'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminTopBar() {
  const { admin } = useAdminAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-white/5">
        <button onClick={() => setDrawerOpen(true)} className="text-white/60 hover:text-white p-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="font-outfit font-bold text-white text-sm">Kite Side Admin</span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          {admin && (
            <div className="w-7 h-7 rounded-full bg-[#1a9fd4]/20 flex items-center justify-center text-[#1a9fd4] text-xs font-bold">
              {initials(admin.name)}
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-60 flex-none">
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  )
}
