'use client'

import { useState, useEffect } from 'react'

export default function ServiceChargeNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ks_service_charge_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('ks_service_charge_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 text-sm text-white/90" style={{ backgroundColor: 'rgba(2,43,61,0.92)', backdropFilter: 'blur(8px)' }}>
      <p>* All prices are subject to 12% service charge</p>
      <button
        onClick={dismiss}
        className="flex-none text-white/60 hover:text-white transition-colors text-lg leading-none px-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
