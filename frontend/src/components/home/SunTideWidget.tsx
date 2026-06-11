'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sunrise, Sunset, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import type { TidesResponse } from '@/app/api/tides/route'

interface SunData {
  sunrise: string
  sunset:  string
  dayLength: string
}

function parseSunTime(iso: string): string {
  return iso.slice(11, 16)
}

function formatDayLength(seconds: number): string {
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

export default function SunTideWidget() {
  const [sun, setSun]       = useState<SunData | null>(null)
  const [tides, setTides]   = useState<TidesResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [sunRes, tidesRes] = await Promise.allSettled([
      fetch('https://api.sunrise-sunset.org/json?lat=29.4945&lng=32.7340&formatted=0&tzid=Africa%2FCairo'),
      fetch('/api/tides'),
    ])

    if (sunRes.status === 'fulfilled' && sunRes.value.ok) {
      const j = await sunRes.value.json()
      if (j.status === 'OK') {
        setSun({
          sunrise:   parseSunTime(j.results.sunrise),
          sunset:    parseSunTime(j.results.sunset),
          dayLength: formatDayLength(j.results.day_length),
        })
      }
    }

    if (tidesRes.status === 'fulfilled' && tidesRes.value.ok) {
      setTides(await tidesRes.value.json())
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const t = setTimeout(fetchAll, midnight.getTime() - now.getTime())
    return () => clearTimeout(t)
  }, [fetchAll])

  return (
    <section className="px-4 pb-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          {/* Sunrise */}
          <Card
            icon={<Sunrise size={20} className="text-amber-600" />}
            iconBg="bg-amber-100"
            gradient="from-amber-50 to-orange-50"
            border="border-amber-100"
            label="Sunrise"
            loading={loading}
            primary={sun?.sunrise ?? '—'}
            secondary={sun ? `Day: ${sun.dayLength}` : ''}
          />

          {/* Sunset */}
          <Card
            icon={<Sunset size={20} className="text-orange-600" />}
            iconBg="bg-orange-100"
            gradient="from-orange-50 to-rose-50"
            border="border-orange-100"
            label="Sunset"
            loading={loading}
            primary={sun?.sunset ?? '—'}
            secondary=""
          />

          {/* High tide */}
          <a
            href="https://wisuki.com/tide/36/ras-sudr"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <TrendingUp size={18} className="text-sky-600" />
              </div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">High tide</span>
            </div>
            {loading && <Skeleton />}
            {!loading && tides?.high ? (
              <>
                <div className="font-outfit font-bold text-2xl text-sky-900 leading-none">{tides.high.time}</div>
                <div className="text-sm font-semibold text-sky-700">{tides.high.height.toFixed(1)} m</div>
              </>
            ) : (!loading && (
              <div className="text-sm text-sky-500">—</div>
            ))}
            <div className="text-xs text-sky-400 group-hover:text-sky-600 transition-colors mt-auto">Full chart →</div>
          </a>

          {/* Low tide */}
          <a
            href="https://wisuki.com/tide/36/ras-sudr"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-slate-50 to-sky-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <TrendingDown size={18} className="text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low tide</span>
            </div>
            {loading && <Skeleton />}
            {!loading && tides?.low ? (
              <>
                <div className="font-outfit font-bold text-2xl text-slate-700 leading-none">{tides.low.time}</div>
                <div className="text-sm font-semibold text-slate-500">{tides.low.height.toFixed(1)} m</div>
              </>
            ) : (!loading && (
              <div className="text-sm text-slate-400">—</div>
            ))}
            <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors mt-auto">Full chart →</div>
          </a>

        </div>

        <p className="text-center text-xs text-gray-300 mt-3">
          Sun · Ras Sudr &nbsp;·&nbsp; Tides from <a href="https://wisuki.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Wisuki</a>
        </p>
      </div>
    </section>
  )
}

function Card({
  icon, iconBg, gradient, border, label, loading, primary, secondary,
}: {
  icon: React.ReactNode; iconBg: string; gradient: string; border: string
  label: string; loading: boolean; primary: string; secondary: string
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} ${border} border rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      {loading ? <Skeleton /> : (
        <>
          <div className="font-outfit font-bold text-2xl text-gray-800 leading-none">{primary}</div>
          {secondary && <div className="text-xs text-gray-400">{secondary}</div>}
        </>
      )}
    </div>
  )
}

function Skeleton() {
  return <div className="h-7 w-16 bg-gray-200/60 rounded animate-pulse" />
}
