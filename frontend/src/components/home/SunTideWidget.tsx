'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sunrise, Sunset, RefreshCw } from 'lucide-react'
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
      <div className="max-w-4xl mx-auto flex flex-col gap-4">

        {/* Sun row */}
        <div className="grid grid-cols-2 gap-4">
          <SunCard
            icon={<Sunrise size={20} className="text-amber-600" />}
            iconBg="bg-amber-100"
            gradient="from-amber-50 to-orange-50"
            border="border-amber-100"
            label="Sunrise"
            loading={loading}
            primary={sun?.sunrise ?? '—'}
            secondary={sun ? `Day length: ${sun.dayLength}` : ''}
          />
          <SunCard
            icon={<Sunset size={20} className="text-orange-600" />}
            iconBg="bg-orange-100"
            gradient="from-orange-50 to-rose-50"
            border="border-orange-100"
            label="Sunset"
            loading={loading}
            primary={sun?.sunset ?? '—'}
            secondary=""
          />
        </div>

        {/* Tides row */}
        <a
          href="https://wisuki.com/tide/36/ras-sudr"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Wave icon */}
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#0284c7" strokeWidth="2">
                  <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round"/>
                  <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-sky-900 text-sm">Today's Tides — Ras Sudr</span>
            </div>
            <span className="text-xs text-sky-400 group-hover:text-sky-600 transition-colors">Full chart →</span>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0,1,2,3].map(i => (
                <div key={i} className="h-20 bg-sky-100/50 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 text-sm text-sky-600/60">
              <RefreshCw size={13} />
              <span>Could not load tides — click to view on Wisuki</span>
            </div>
          )}

          {!loading && !error && tides?.entries && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tides.entries.map((entry, i) => (
                <TideCard key={i} entry={entry} />
              ))}
            </div>
          )}

          <p className="text-xs text-sky-400/70 mt-3">
            Data from Wisuki · Suez station (39 km)
          </p>
        </a>

      </div>
    </section>
  )
}

function TideCard({ entry }: { entry: TideEntry }) {
  const isHigh = entry.type === 'high'
  return (
    <div className={[
      'rounded-xl p-3.5 flex flex-col gap-1.5',
      isHigh ? 'bg-sky-100/70' : 'bg-white/70',
    ].join(' ')}>
      {/* Arrow + label */}
      <div className="flex items-center gap-1.5">
        <span className={`text-base leading-none ${isHigh ? 'text-sky-600' : 'text-slate-400'}`}>
          {isHigh ? '▲' : '▼'}
        </span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${isHigh ? 'text-sky-700' : 'text-slate-400'}`}>
          {isHigh ? 'High' : 'Low'}
        </span>
      </div>
      {/* Time */}
      <div className="font-outfit font-bold text-xl text-sky-900 leading-none">
        {entry.time}
      </div>
      {/* Height */}
      <div className={`text-sm font-semibold ${isHigh ? 'text-sky-700' : 'text-slate-500'}`}>
        {entry.height.toFixed(1)} m
      </div>
    </div>
  )
}

function SunCard({ icon, iconBg, gradient, border, label, loading, primary, secondary }: {
  icon: React.ReactNode; iconBg: string; gradient: string; border: string
  label: string; loading: boolean; primary: string; secondary: string
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} ${border} border rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      {loading
        ? <div className="h-7 w-16 bg-gray-200/60 rounded animate-pulse" />
        : <>
            <div className="font-outfit font-bold text-2xl text-gray-800 leading-none">{primary}</div>
            {secondary && <div className="text-xs text-gray-400">{secondary}</div>}
          </>
      }
    </div>
  )
}
