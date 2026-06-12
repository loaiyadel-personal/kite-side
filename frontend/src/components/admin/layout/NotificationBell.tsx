'use client'

import { useEffect, useRef, useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const POLL_MS = 120_000

export default function NotificationBell() {
  const { token } = useAdminAuth()
  const [unread, setUnread] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function poll() {
    if (!token) return
    try {
      const res = await fetch(`${API}/contact?status=NEW&limit=1&countOnly=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setUnread(data.count ?? 0)
    } catch {}
  }

  useEffect(() => {
    poll()
    timerRef.current = setInterval(poll, POLL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [token])

  return (
    <button className="relative p-1 text-white/50 hover:text-white transition-colors">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e84a2e] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}
