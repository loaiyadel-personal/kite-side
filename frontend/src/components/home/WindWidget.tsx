'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

interface WindData {
  speed: number
  direction: number
  gusts: number
  updatedAt: string
}

function getWindProfile(speed: number): {
  color: string
  label: string
  status: string
  statusColor: string
} {
  if (speed < 8)  return { color: '#22c55e', label: 'Calm',       status: 'Too light',        statusColor: 'bg-green-100 text-green-800' }
  if (speed < 14) return { color: '#84cc16', label: 'Light',      status: 'Too light',        statusColor: 'bg-lime-100 text-lime-800' }
  if (speed < 20) return { color: '#eab308', label: 'Moderate',   status: 'Good for learning',statusColor: 'bg-yellow-100 text-yellow-800' }
  if (speed < 26) return { color: '#f97316', label: 'Fresh',      status: 'Good for kitesurfing', statusColor: 'bg-orange-100 text-orange-800' }
  return           { color: '#ef4444', label: 'Strong',      status: 'Expert only',      statusColor: 'bg-red-100 text-red-800' }
}

function CompassArrow({ degrees }: { degrees: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 flex items-center justify-center transition-transform duration-700"
        style={{ transform: `rotate(${degrees}deg)` }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 2L8 18l4-3 4 3L12 2z" fill="#0a6d96" />
        </svg>
      </div>
      <span className="text-xs text-gray-500">{degrees}°</span>
    </div>
  )
}

export default function WindWidget() {
  const [wind, setWind] = useState<WindData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchWind = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=29.6&longitude=32.7&current=windspeed_10m,winddirection_10m,windgusts_10m&windspeed_unit=kn'
      )
      const json = await res.json()
      const c = json.current
      setWind({
        speed: Math.round(c.windspeed_10m),
        direction: Math.round(c.winddirection_10m),
        gusts: Math.round(c.windgusts_10m),
        updatedAt: new Date().toLocaleTimeString('en-EG', { hour: '2-digit', minute: '2-digit' }),
      })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWind()
    const interval = setInterval(fetchWind, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchWind])

  const profile = wind ? getWindProfile(wind.speed) : null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-[#022b3d] text-center mb-8">
          Live Wind Conditions
        </h2>

        {/* Live data card */}
        <div className="bg-[#022b3d] rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Current Conditions — Ras Sudr / Paradise Resort</span>
            <button
              onClick={fetchWind}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              aria-label="Refresh wind data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {wind ? `Updated ${wind.updatedAt}` : 'Refresh'}
            </button>
          </div>

          {error && (
            <p className="text-center text-white/50 py-4">Could not load wind data. Please try again.</p>
          )}

          {!error && wind && profile && (
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Wind speed */}
              <div className="text-center">
                <div className="font-outfit font-bold text-5xl" style={{ color: profile.color }}>
                  {wind.speed}
                </div>
                <div className="text-sm text-white/60 mt-1">knots</div>
                <div className="text-xs font-medium mt-1" style={{ color: profile.color }}>
                  {profile.label}
                </div>
              </div>

              {/* Status + compass */}
              <div className="text-center flex flex-col items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.statusColor}`}>
                  {profile.status}
                </span>
                <CompassArrow degrees={wind.direction} />
              </div>

              {/* Gusts */}
              <div className="text-center">
                <div className="font-outfit font-bold text-3xl text-white/70">
                  {wind.gusts}
                </div>
                <div className="text-sm text-white/60 mt-1">gust kn</div>
              </div>
            </div>
          )}

          {!error && !wind && !loading && (
            <p className="text-center text-white/50 py-4">Loading...</p>
          )}
        </div>

        {/* Windfinder embed */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <iframe
            src="https://www.windfinder.com/widget/forecast/ras_sudr_paradise_resort"
            width="100%"
            height="330"
            frameBorder="0"
            title="Windfinder forecast Ras Sudr"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
