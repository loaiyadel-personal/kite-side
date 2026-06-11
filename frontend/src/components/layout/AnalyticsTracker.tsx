'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getOrCreateSessionId(): string {
  const key = 'ks_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(key, id)
  }
  return id
}

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const sessionId = getOrCreateSessionId()
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          sessionId,
          referrer: document.referrer || undefined,
        }),
      }).catch(() => {
        // Analytics is non-critical — never throw
      })
    } catch {
      // sessionStorage may be unavailable (private browsing edge cases)
    }
  }, [pathname])

  return null
}
