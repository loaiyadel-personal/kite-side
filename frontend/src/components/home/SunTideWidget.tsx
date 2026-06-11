'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sunrise, Sunset, Waves, RefreshCw, ExternalLink } from 'lucide-react'

interface SunData {
  sunrise: string   // "05:12"
  sunset: string    // "19:34"
  dayLength: string // "14h 22m"
  updatedDate: string
}

function parseSunTime(iso: string): string {
  // API returns local time ISO string e.g. "2026-06-11T04:48:00+02:00"
  // Slice the HH:MM directly from the local-time string
  return iso.slice(11, 16)
}

function formatDayLength(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export default function SunTideWidget() {
  const [sun, setSun] = useState<SunData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchSun = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        'https://api.sunrise-sunset.org/json?lat=29.4945&lng=32.7340&formatted=0&tzid=Africa%2FCairo'
      )
      const json = await res.json()
      if (json.status !== 'OK') throw new Error()
      const r = json.results
      setSun({
        sunrise:    parseSunTime(r.sunrise),
        sunset:     parseSunTime(r.sunset),
        dayLength:  formatDayLength(r.day_length),
        updatedDate: new Date().toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'short' }),
      })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSun()
    // Refresh once per day at midnight
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()
    const timer = setTimeout(fetchSun, msUntilMidnight)
    return () => clearTimeout(timer)
  }, [fetchSun])

  return (
    <section className="px-4 pb-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Sunrise card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-none">
              <Sunrise size={22} className="text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Sunrise</div>
              {loading && <div className="h-7 w-16 bg-amber-100 rounded animate-pulse" />}
              {!loading && (error || !sun) && <div className="font-outfit font-bold text-xl text-amber-900">—</div>}
              {!loading && sun && (
                <>
                  <div className="font-outfit font-bold text-2xl text-amber-900">{sun.sunrise}</div>
                  <div className="text-xs text-amber-600 mt-0.5">{sun.updatedDate}</div>
                </>
              )}
            </div>
          </div>

          {/* Sunset card */}
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-none">
              <Sunset size={22} className="text-orange-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-orange-700 uppercase tracking-wider mb-1">Sunset</div>
              {loading && <div className="h-7 w-16 bg-orange-100 rounded animate-pulse" />}
              {!loading && (error || !sun) && <div className="font-outfit font-bold text-xl text-orange-900">—</div>}
              {!loading && sun && (
                <>
                  <div className="font-outfit font-bold text-2xl text-orange-900">{sun.sunset}</div>
                  <div className="text-xs text-orange-600 mt-0.5">Day: {sun.dayLength}</div>
                </>
              )}
            </div>
          </div>

          {/* Tides card */}
          <a
            href="https://wisuki.com/tide/36/ras-sudr"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-none">
              <Waves size={22} className="text-sky-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-sky-700 uppercase tracking-wider mb-1">Tides</div>
              <div className="font-outfit font-bold text-lg text-sky-900 leading-snug">Ras Sudr</div>
              <div className="text-xs text-sky-600 mt-0.5">Full tide chart →</div>
            </div>
            <ExternalLink size={14} className="text-sky-400 group-hover:text-sky-600 transition-colors flex-none" />
          </a>

        </div>

        {/* Refresh / error hint */}
        {error && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <button onClick={fetchSun} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
              <RefreshCw size={12} />
              Retry sun times
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
