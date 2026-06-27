'use client'

import { useEffect, useState, useCallback } from 'react'
import type { TidesResponse, TideEntry } from '@/app/api/tides/route'

interface SunData {
  sunrise:   string
  sunset:    string
  dayLength: string
}

function parseSunTime(iso: string) { return iso.slice(11, 16) }
function formatDayLen(s: number) {
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}

export default function SunTideWidget() {
  const [sun,     setSun]     = useState<SunData | null>(null)
  const [tides,   setTides]   = useState<TidesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(false)
    const [sunRes, tidesRes] = await Promise.allSettled([
      fetch('https://api.sunrise-sunset.org/json?lat=29.4945&lng=32.7340&formatted=0&tzid=Africa%2FCairo'),
      fetch('/api/tides'),
    ])

    if (sunRes.status === 'fulfilled' && sunRes.value.ok) {
      const j = await sunRes.value.json()
      if (j.status === 'OK') setSun({
        sunrise:   parseSunTime(j.results.sunrise),
        sunset:    parseSunTime(j.results.sunset),
        dayLength: formatDayLen(j.results.day_length),
      })
    }

    if (tidesRes.status === 'fulfilled' && tidesRes.value.ok) {
      const t = await tidesRes.value.json()
      if (t.entries) setTides(t)
      else setError(true)
    } else {
      setError(true)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const now = new Date()
    const midnight = new Date(now); midnight.setHours(24, 0, 0, 0)
    const t = setTimeout(fetchAll, midnight.getTime() - now.getTime())
    return () => clearTimeout(t)
  }, [fetchAll])

  return (
    <section className="px-4 pb-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-dark rounded-2xl p-6 shadow-xl">

          {/* Sun row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Sunrise */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                {/* sunrise icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                  <path d="M12 2v2M4.22 6.22l1.42 1.42M2 14h2M20 14h2M18.36 7.64l1.42-1.42M17 14a5 5 0 0 0-10 0"/>
                  <path d="M3 14h18" strokeLinecap="round"/>
                </svg>
                Sunrise
              </div>
              {loading
                ? <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                : <div className="font-outfit font-bold text-3xl text-white">{sun?.sunrise ?? '—'}</div>
              }
              {!loading && sun && (
                <div className="text-xs text-white/30 mt-1">Day: {sun.dayLength}</div>
              )}
            </div>

            {/* Sunset */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                  <path d="M12 10v2M4.22 10.22l1.42 1.42M2 18h2M20 18h2M18.36 11.64l1.42-1.42M17 18a5 5 0 0 0-10 0"/>
                  <path d="M3 18h18" strokeLinecap="round"/>
                  <path d="M8 22h8" strokeLinecap="round"/>
                </svg>
                Sunset
              </div>
              {loading
                ? <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                : <div className="font-outfit font-bold text-3xl text-white">{sun?.sunset ?? '—'}</div>
              }
            </div>
          </div>

          {/* Tides */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" className="w-4 h-4">
                  <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round"/>
                  <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                  Today's Tides — Ras Sudr
                </span>
              </div>
              <a
                href="https://wisuki.com/tide/36/ras-sudr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Full chart →
              </a>
            </div>

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="bg-white/5 rounded-xl px-4 py-3 text-sm text-white/40">
                Could not load tide data —{' '}
                <a href="https://wisuki.com/tide/36/ras-sudr" target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-white/60 transition-colors">view on Wisuki</a>
              </div>
            )}

            {!loading && !error && tides?.entries && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tides.entries.map((entry, i) => (
                  <TideCard key={i} entry={entry} />
                ))}
              </div>
            )}

            <p className="text-xs text-white/20 mt-3">
              Tide forecast for Ras Sudr · Data from Wisuki
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

function TideCard({ entry }: { entry: TideEntry }) {
  const isHigh = entry.type === 'high'
  return (
    <div className={[
      'rounded-xl p-4 flex flex-col gap-1',
      isHigh ? 'bg-brand-primary/20 border border-brand-primary/30' : 'bg-white/5',
    ].join(' ')}>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm leading-none ${isHigh ? 'text-brand-primary' : 'text-white/30'}`}>
          {isHigh ? '▲' : '▼'}
        </span>
        <span className={`text-xs font-medium uppercase tracking-wider ${isHigh ? 'text-brand-primary' : 'text-white/30'}`}>
          {isHigh ? 'High' : 'Low'}
        </span>
      </div>
      <div className="font-outfit font-bold text-2xl text-white leading-none mt-1">
        {entry.time}
      </div>
      <div className={`text-sm font-semibold ${isHigh ? 'text-brand-primary' : 'text-white/40'}`}>
        {entry.height.toFixed(1)} m
      </div>
    </div>
  )
}
