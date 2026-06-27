'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface AnalyticsData {
  pageViews?:    number
  visitors?:     number
  topPages?:     { path: string; views: number }[]
  deviceBreakdown?: { device: string; pct: number }[]
  visitorsByDay?: { date: string; count: number }[]
}

export default function AnalyticsPage() {
  const { token } = useAdminAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API}/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div>
        <PageHeader title="Analytics" subtitle="Site traffic and engagement" />
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>
      </div>
    )
  }

  const days = data?.visitorsByDay ?? []

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Site traffic and engagement" />

      {(!data || (!data.pageViews && !data.visitors)) ? (
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-10 text-center">
          <p className="text-4xl mb-3 opacity-40">📈</p>
          <p className="text-white/40 text-sm">Analytics data is not available yet.<br />Connect your analytics provider to see traffic insights.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Page Views',   value: data?.pageViews?.toLocaleString()  ?? '–' },
              { label: 'Visitors',     value: data?.visitors?.toLocaleString()   ?? '–' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1e293b] border border-white/10 rounded-xl p-5">
                <p className="text-white font-outfit font-bold text-2xl">{value}</p>
                <p className="text-white/40 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {days.length > 0 && (
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 mb-6">
              <h2 className="text-white font-outfit font-semibold mb-4">Visitors — Last 30 Days</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={days} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="date" tick={{ fill: '#ffffff40', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="count" fill="#1a9fd4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {data?.topPages && data.topPages.length > 0 && (
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-outfit font-semibold mb-4">Top Pages</h2>
              <div className="space-y-2">
                {data.topPages.map(p => (
                  <div key={p.path} className="flex items-center justify-between py-1.5">
                    <p className="text-white/70 text-sm font-mono">{p.path}</p>
                    <p className="text-brand-primary text-sm font-semibold">{p.views.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
