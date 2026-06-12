'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import EmptyState from '@/components/admin/ui/EmptyState'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

type Status = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'

interface Message {
  id:        string
  name:      string
  email:     string
  phone?:    string
  subject?:  string
  message:   string
  status:    Status
  createdAt: string
}

const FILTERS: { label: string; value: Status | 'ALL' }[] = [
  { label: 'All',      value: 'ALL' },
  { label: 'New',      value: 'NEW' },
  { label: 'Read',     value: 'READ' },
  { label: 'Replied',  value: 'REPLIED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

export default function ContactPage() {
  const { token } = useAdminAuth()
  const [messages, setMessages]   = useState<Message[]>([])
  const [selected, setSelected]   = useState<Message | null>(null)
  const [filter, setFilter]       = useState<Status | 'ALL'>('ALL')
  const [loading, setLoading]     = useState(true)

  const fetchMessages = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const url = filter === 'ALL' ? `${API}/contact` : `${API}/contact?status=${filter}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token, filter])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  async function updateStatus(id: string, status: Status) {
    if (!token) return
    const res = await fetch(`${API}/contact/${id}/status`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success('Status updated')
    }
  }

  async function openMessage(msg: Message) {
    setSelected(msg)
    if (msg.status === 'NEW') await updateStatus(msg.id, 'READ')
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

  return (
    <div>
      <PageHeader title="Contact Inbox" subtitle="Messages from your website visitors" />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-[#1e293b] border border-white/10 rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.value ? 'bg-[#1a9fd4] text-white' : 'text-white/40 hover:text-white/70'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)]">
        {/* List */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState icon="📭" title="No messages" message="Nothing here yet" />
          ) : (
            messages.map(msg => (
              <button key={msg.id} onClick={() => openMessage(msg)}
                className={`w-full text-left px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${selected?.id === msg.id ? 'bg-white/5' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`text-sm font-medium truncate ${msg.status === 'NEW' ? 'text-white' : 'text-white/60'}`}>
                    {msg.status === 'NEW' && <span className="inline-block w-1.5 h-1.5 bg-[#1a9fd4] rounded-full mr-1.5 mb-0.5" />}
                    {msg.name}
                  </p>
                  <StatusBadge status={msg.status} />
                </div>
                {msg.subject && <p className="text-white/50 text-xs truncate">{msg.subject}</p>}
                <p className="text-white/30 text-xs mt-1">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-y-auto">
          {!selected ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/30">Select a message to read</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-white font-outfit font-semibold text-lg">{selected.subject || '(No subject)'}</h2>
                  <p className="text-white/40 text-sm mt-0.5">
                    From <span className="text-white/60">{selected.name}</span> · {format(new Date(selected.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-5 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}
                  onClick={() => updateStatus(selected.id, 'REPLIED')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg transition-colors">
                  ✉️ Reply via Email
                </a>
                {selected.phone && (
                  <a href={`https://wa.me/${waNumber}?text=Hi ${encodeURIComponent(selected.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => updateStatus(selected.id, 'REPLIED')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    📱 WhatsApp
                  </a>
                )}
                {selected.status !== 'ARCHIVED' && (
                  <button onClick={() => updateStatus(selected.id, 'ARCHIVED')}
                    className="px-4 py-2 text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 text-sm rounded-lg transition-colors">
                    Archive
                  </button>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-[#1a9fd4] hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-white/30 text-xs mb-0.5">Phone</p>
                    <p className="text-white/70">{selected.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
