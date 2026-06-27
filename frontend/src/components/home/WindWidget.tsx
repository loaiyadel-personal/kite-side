'use client'

import { useEffect, useState, useCallback } from 'react'
import type { TidesResponse, TideEntry } from '@/app/api/tides/route'

interface WindData {
  speed:       number
  direction:   number
  gusts:       number
  temperature: number
}

function getCondition(speed: number): { label: string; dot: string } {
  if (speed < 14) return { label: 'Too Light',         dot: 'bg-blue-400' }
  if (speed < 20) return { label: 'Good for Learning', dot: 'bg-yellow-400' }
  if (speed < 26) return { label: 'Perfect',           dot: 'bg-green-500' }
  return               { label: 'Expert Only',         dot: 'bg-red-500' }
}

function cardinalDir(d: number) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(d / 22.5) % 16]
}

function getNextTide(entries: TideEntry[]): TideEntry | null {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  for (const e of entries) {
    const [h, m] = e.time.split(':').map(Number)
    if (h * 60 + m > nowMins) return e
  }
  return entries[0] ?? null
}

export default function WindWidget() {
  const [wind,        setWind]        = useState<WindData | null>(null)
  const [tides,       setTides]       = useState<TidesResponse | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchWind = useCallback(async () => {
    try {
      const res  = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=29.6&longitude=32.7&current=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m&windspeed_unit=kn'
      )
      const json = await res.json()
      const c = json.current
      setWind({
        speed:       Math.round(c.windspeed_10m),
        direction:   Math.round(c.winddirection_10m),
        gusts:       Math.round(c.windgusts_10m),
        temperature: Math.round(c.temperature_2m),
      })
      setLastFetched(new Date())
    } catch { /* silent */ }
  }, [])

  const fetchTides = useCallback(async () => {
    try {
      const res = await fetch('/api/tides')
      if (res.ok) {
        const t = await res.json()
        if (t.entries) setTides(t)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchWind()
    fetchTides()
    const interval = setInterval(fetchWind, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchWind, fetchTides])

  const condition = wind ? getCondition(wind.speed) : null
  const nextTide  = tides ? getNextTide(tides.entries) : null
  const minsAgo   = lastFetched
    ? Math.round((Date.now() - lastFetched.getTime()) / 60000)
    : null
  const updatedLabel = minsAgo === null ? '' : minsAgo < 1 ? 'Updated just now' : `Updated ${minsAgo} min ago`

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
            Live Conditions · Kite Side
          </p>
          {updatedLabel && (
            <span className="text-xs text-gray-400">{updatedLabel}</span>
          )}
        </div>

        <div className="bg-brand-dark/5 border border-brand-primary/20 rounded-2xl overflow-hidden">

          {/* ── WIND ROW ── */}
          <div className="px-6 pt-5 pb-5 border-b border-brand-primary/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary/50 mb-4">
              Wind
            </p>

            {/* Mobile: 2-row grid. Desktop (sm+): single flex row */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-y-5">

              {/* Speed */}
              <div className="flex flex-col items-center gap-1 border-r border-brand-primary/15 sm:flex-1 sm:px-5">
                <span className="font-outfit font-bold text-4xl leading-none text-brand-dark">
                  {wind ? wind.speed : '—'}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">knots</span>
              </div>

              {/* Direction */}
              <div className="flex flex-col items-center gap-1.5 sm:border-r border-brand-primary/15 sm:flex-1 sm:px-5">
                <div
                  className="w-7 h-7 transition-transform duration-700"
                  style={{ transform: `rotate(${wind?.direction ?? 0}deg)` }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                    <path d="M12 2L8 18l4-3 4 3L12 2z" fill="#0a6d96" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {wind ? cardinalDir(wind.direction) : '—'}
                </span>
              </div>

              {/* Gusts */}
              <div className="flex flex-col items-center gap-1 border-r border-brand-primary/15 sm:flex-1 sm:px-5">
                <span className="font-outfit font-bold text-4xl leading-none text-brand-dark/40">
                  {wind ? wind.gusts : '—'}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">gusts kn</span>
              </div>

              {/* Temp + Condition stacked on mobile right col, two separate cols on desktop */}
              <div className="flex flex-col items-center gap-1 sm:border-r border-brand-primary/15 sm:flex-1 sm:px-5">
                <span className="font-outfit font-bold text-4xl leading-none text-brand-dark">
                  {wind ? `${wind.temperature}°` : '—'}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">°C</span>
              </div>

              {/* Condition */}
              <div className="hidden sm:flex flex-col items-center gap-2 sm:flex-1 sm:px-5">
                {condition ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${condition.dot}`} />
                      <span className="font-medium text-sm text-brand-dark">{condition.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">condition</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>

            </div>

            {/* Condition visible on mobile below the grid */}
            {condition && (
              <div className="sm:hidden flex items-center gap-2 justify-center mt-4 pt-4 border-t border-brand-primary/10">
                <span className={`w-2 h-2 rounded-full ${condition.dot}`} />
                <span className="text-sm font-medium text-brand-dark">{condition.label}</span>
                <span className="text-xs text-gray-400">· condition</span>
              </div>
            )}
          </div>

          {/* ── TIDES ── */}
          <div className="px-6 pt-5 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary/50 mb-4">
              Tides
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Next tide — accented */}
              <div className="rounded-xl border border-brand-primary/30 bg-brand-primary/5 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    Next Tide
                  </span>
                  {nextTide && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      nextTide.type === 'high'
                        ? 'bg-brand-primary/15 text-brand-primary'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {nextTide.type === 'high' ? '▲ High' : '▼ Low'}
                    </span>
                  )}
                </div>
                <div className="font-outfit font-bold text-5xl leading-none text-brand-dark tracking-tight mb-2">
                  {nextTide ? nextTide.time : '—'}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {nextTide ? `${nextTide.height.toFixed(1)} m` : '—'}
                </div>
              </div>

              {/* High tide */}
              <div className="rounded-xl border border-brand-primary/15 bg-white/70 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    High Today
                  </span>
                  <span className="text-xs font-bold text-brand-primary">▲</span>
                </div>
                <div className="font-outfit font-bold text-5xl leading-none text-brand-dark tracking-tight mb-2">
                  {tides?.high ? tides.high.time : '—'}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {tides?.high ? `${tides.high.height.toFixed(1)} m` : '—'}
                </div>
              </div>

              {/* Low tide */}
              <div className="rounded-xl border border-brand-primary/15 bg-white/70 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Low Today
                  </span>
                  <span className="text-xs font-bold text-gray-400">▼</span>
                </div>
                <div className="font-outfit font-bold text-5xl leading-none text-brand-dark tracking-tight mb-2">
                  {tides?.low ? tides.low.time : '—'}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {tides?.low ? `${tides.low.height.toFixed(1)} m` : '—'}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
