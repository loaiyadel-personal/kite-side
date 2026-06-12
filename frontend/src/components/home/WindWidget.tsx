'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'

interface WindData {
  speed:       number
  direction:   number
  gusts:       number
  temperature: number
  updatedAt:   string
}

function getWindProfile(speed: number): {
  color: string
  label: string
  status: string
  statusColor: string
} {
  if (speed < 8)  return { color: '#22c55e', label: 'Calm',     status: 'Too light',            statusColor: 'bg-green-100 text-green-800' }
  if (speed < 14) return { color: '#84cc16', label: 'Light',    status: 'Too light',            statusColor: 'bg-lime-100 text-lime-800' }
  if (speed < 20) return { color: '#eab308', label: 'Moderate', status: 'Good for learning',    statusColor: 'bg-yellow-100 text-yellow-800' }
  if (speed < 26) return { color: '#f97316', label: 'Fresh',    status: 'Good for kitesurfing', statusColor: 'bg-orange-100 text-orange-800' }
  return           { color: '#ef4444', label: 'Strong',   status: 'Expert only',          statusColor: 'bg-red-100 text-red-800' }
}

function CompassArrow({ degrees }: { degrees: number }) {
  const cardinalDir = (d: number) => {
    const dirs = ['N','NE','E','SE','S','SW','W','NW']
    return dirs[Math.round(d / 45) % 8]
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 flex items-center justify-center transition-transform duration-700"
        style={{ transform: `rotate(${degrees}deg)` }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
          <path d="M12 2L8 18l4-3 4 3L12 2z" fill="#0a6d96" />
        </svg>
      </div>
      <span className="text-xs text-white/50">{cardinalDir(degrees)} · {degrees}°</span>
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
        'https://api.open-meteo.com/v1/forecast?latitude=29.6&longitude=32.7&current=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m&windspeed_unit=kn'
      )
      const json = await res.json()
      const c = json.current
      setWind({
        speed:       Math.round(c.windspeed_10m),
        direction:   Math.round(c.winddirection_10m),
        gusts:       Math.round(c.windgusts_10m),
        temperature: Math.round(c.temperature_2m),
        updatedAt:   new Date().toLocaleTimeString('en-EG', { hour: '2-digit', minute: '2-digit' }),
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

        <div className="bg-[#022b3d] rounded-2xl p-8 shadow-xl">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Ras Sudr · Paradise Resort
              </span>
              {wind && (
                <span className="flex items-center gap-1 bg-[#1a9fd4]/20 text-[#1a9fd4] text-sm font-semibold px-2.5 py-0.5 rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {wind.temperature}°C
                </span>
              )}
            </div>
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
            <p className="text-center text-white/50 py-8">
              Could not load wind data. <button onClick={fetchWind} className="underline hover:text-white">Try again</button>
            </p>
          )}

          {!error && !wind && (
            <div className="flex justify-center py-8">
              <RefreshCw size={24} className="animate-spin text-white/40" />
            </div>
          )}

          {!error && wind && profile && (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Wind speed */}
                <div className="text-center">
                  <div className="font-outfit font-bold text-6xl leading-none" style={{ color: profile.color }}>
                    {wind.speed}
                  </div>
                  <div className="text-sm text-white/50 mt-2">knots</div>
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.statusColor}`}>
                      {profile.label}
                    </span>
                  </div>
                </div>

                {/* Direction */}
                <div className="text-center flex flex-col items-center justify-center gap-2">
                  <CompassArrow degrees={wind.direction} />
                  <span className="text-xs text-white/50 mt-1">Direction</span>
                </div>

                {/* Gusts */}
                <div className="text-center">
                  <div className="font-outfit font-bold text-6xl leading-none text-white/60">
                    {wind.gusts}
                  </div>
                  <div className="text-sm text-white/50 mt-2">gust kn</div>
                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60">
                      Gusts
                    </span>
                  </div>
                </div>
              </div>

              {/* Status banner */}
              <div
                className="rounded-xl px-4 py-3 text-center text-sm font-semibold mb-8"
                style={{ backgroundColor: `${profile.color}22`, color: profile.color, border: `1px solid ${profile.color}44` }}
              >
                {profile.status}
              </div>
            </>
          )}

          {/* Windfinder link */}
          <a
            href="https://www.windfinder.com/forecast/ras_sudr_paradise_resort"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm font-medium"
          >
            <ExternalLink size={15} />
            Full forecast on Windfinder
          </a>
        </div>
      </div>
    </section>
  )
}
