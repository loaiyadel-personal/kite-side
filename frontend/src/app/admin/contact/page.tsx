'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import EmptyState from '@/components/admin/ui/EmptyState'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

type MsgStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
type InqStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'

interface Message {
  id:        string
  name:      string
  email:     string
  phone?:    string
  subject?:  string
  message:   string
  status:    MsgStatus
  createdAt: string
}

interface Inquiry {
  id:             string
  name:           string
  email:          string
  phone?:         string | null
  level?:         string | null
  preferredDates?: string | null
  howHeard?:      string | null
  message?:       string | null
  status:         InqStatus
  createdAt:      string
  course?:        { name: string; level: string } | null
}

type Tab = 'messages' | 'bookings'

const MSG_FILTERS: { label: string; value: MsgStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' }, { label: 'New', value: 'NEW' },
  { label: 'Read', value: 'READ' }, { label: 'Replied', value: 'REPLIED' },
  { label: 'Archived', value: 'ARCHIVED' },
]
const INQ_FILTERS: { label: string; value: InqStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' }, { label: 'New', value: 'NEW' },
  { label: 'Read', value: 'READ' }, { label: 'Replied', value: 'REPLIED' },
  { label: 'Closed', value: 'CLOSED' },
]

const LEVEL_LABEL: Record<string, string> = {
  DISCOVERY: 'Discovery', BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced', IKO_CERTIFICATION: 'IKO Cert', INSTRUCTOR: 'Instructor',
}

export default function ContactPage() {
  const { token } = useAdminAuth()
  const [tab, setTab]                 = useState<Tab>('messages')
  const [messages, setMessages]       = useState<Message[]>([])
  const [inquiries, setInquiries]     = useState<Inquiry[]>([])
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null)
  const [selectedInq, setSelectedInq] = useState<Inquiry | null>(null)
  const [msgFilter, setMsgFilter]     = useState<MsgStatus | 'ALL'>('ALL')
  const [inqFilter, setInqFilter]     = useState<InqStatus | 'ALL'>('ALL')
  const [loading, setLoading]         = useState(true)

  const fetchMessages = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const url = msgFilter === 'ALL' ? `${API}/contact` : `${API}/contact?status=${msgFilter}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token, msgFilter])

  const fetchInquiries = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const url = inqFilter === 'ALL' ? `${API}/courses/inquiries` : `${API}/courses/inquiries?status=${inqFilter}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setInquiries(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token, inqFilter])

  useEffect(() => {
    if (tab === 'messages') fetchMessages()
    else fetchInquiries()
  }, [tab, fetchMessages, fetchInquiries])

  async function updateMsgStatus(id: string, status: MsgStatus) {
    if (!token) return
    const res = await fetch(`${API}/contact/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      setSelectedMsg(prev => prev?.id === id ? { ...prev, status } : prev)
      toast.success('Status updated')
    }
  }

  async function updateInqStatus(id: string, status: InqStatus) {
    if (!token) return
    const res = await fetch(`${API}/courses/inquiries/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      setSelectedInq(prev => prev?.id === id ? { ...prev, status } : prev)
      toast.success('Status updated')
    }
  }

  async function openMsg(msg: Message) {
    setSelectedMsg(msg)
    setSelectedInq(null)
    if (msg.status === 'NEW') await updateMsgStatus(msg.id, 'READ')
  }

  async function openInq(inq: Inquiry) {
    setSelectedInq(inq)
    setSelectedMsg(null)
    if (inq.status === 'NEW') await updateInqStatus(inq.id, 'READ')
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201116407080'

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Contact messages and course booking requests" />

      {/* Top-level tabs */}
      <div className="flex gap-1 mb-4 bg-[#1e293b] border border-white/10 rounded-xl p-1 w-fit">
        <button onClick={() => { setTab('messages'); setSelectedMsg(null); setSelectedInq(null) }}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === 'messages' ? 'bg-[#1a9fd4] text-white' : 'text-white/40 hover:text-white/70'}`}>
          Messages
          {messages.filter(m => m.status === 'NEW').length > 0 && (
            <span className="ml-1.5 bg-[#e84a2e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {messages.filter(m => m.status === 'NEW').length}
            </span>
          )}
        </button>
        <button onClick={() => { setTab('bookings'); setSelectedMsg(null); setSelectedInq(null) }}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === 'bookings' ? 'bg-[#1a9fd4] text-white' : 'text-white/40 hover:text-white/70'}`}>
          Course Bookings
          {inquiries.filter(i => i.status === 'NEW').length > 0 && (
            <span className="ml-1.5 bg-[#e84a2e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {inquiries.filter(i => i.status === 'NEW').length}
            </span>
          )}
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-1 mb-5 bg-[#1e293b] border border-white/10 rounded-xl p-1 w-fit">
        {(tab === 'messages' ? MSG_FILTERS : INQ_FILTERS).map(f => (
          <button key={f.value}
            onClick={() => tab === 'messages' ? setMsgFilter(f.value as MsgStatus | 'ALL') : setInqFilter(f.value as InqStatus | 'ALL')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              (tab === 'messages' ? msgFilter : inqFilter) === f.value
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-280px)]">
        {/* List */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tab === 'messages' ? (
            messages.length === 0
              ? <EmptyState icon="📭" title="No messages" message="Nothing here yet" />
              : messages.map(msg => (
                <button key={msg.id} onClick={() => openMsg(msg)}
                  className={`w-full text-left px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${selectedMsg?.id === msg.id ? 'bg-white/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium truncate ${msg.status === 'NEW' ? 'text-white' : 'text-white/60'}`}>
                      {msg.status === 'NEW' && <span className="inline-block w-1.5 h-1.5 bg-[#1a9fd4] rounded-full mr-1.5 mb-0.5" />}
                      {msg.name}
                    </p>
                    <StatusBadge status={msg.status} />
                  </div>
                  {msg.subject && <p className="text-white/50 text-xs truncate">{msg.subject}</p>}
                  <p className="text-white/30 text-xs mt-1">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</p>
                </button>
              ))
          ) : (
            inquiries.length === 0
              ? <EmptyState icon="🪁" title="No bookings yet" message="Course booking requests will appear here" />
              : inquiries.map(inq => (
                <button key={inq.id} onClick={() => openInq(inq)}
                  className={`w-full text-left px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${selectedInq?.id === inq.id ? 'bg-white/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium truncate ${inq.status === 'NEW' ? 'text-white' : 'text-white/60'}`}>
                      {inq.status === 'NEW' && <span className="inline-block w-1.5 h-1.5 bg-[#1a9fd4] rounded-full mr-1.5 mb-0.5" />}
                      {inq.name}
                    </p>
                    <StatusBadge status={inq.status} />
                  </div>
                  <p className="text-white/50 text-xs truncate">
                    {inq.course?.name ?? (inq.level ? LEVEL_LABEL[inq.level] ?? inq.level : 'Course inquiry')}
                  </p>
                  <p className="text-white/30 text-xs mt-1">{formatDistanceToNow(new Date(inq.createdAt), { addSuffix: true })}</p>
                </button>
              ))
          )}
        </div>

        {/* Detail */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-y-auto">
          {!selectedMsg && !selectedInq ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/30">Select an item to read</p>
            </div>
          ) : selectedMsg ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-white font-outfit font-semibold text-lg">{selectedMsg.subject || '(No subject)'}</h2>
                  <p className="text-white/40 text-sm mt-0.5">
                    From <span className="text-white/60">{selectedMsg.name}</span> · {format(new Date(selectedMsg.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <StatusBadge status={selectedMsg.status} />
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-5 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <a href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || 'Your message')}`}
                  onClick={() => updateMsgStatus(selectedMsg.id, 'REPLIED')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg transition-colors">
                  ✉️ Reply via Email
                </a>
                {selectedMsg.status !== 'ARCHIVED' && (
                  <button onClick={() => updateMsgStatus(selectedMsg.id, 'ARCHIVED')}
                    className="px-4 py-2 text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 text-sm rounded-lg transition-colors">
                    Archive
                  </button>
                )}
              </div>
              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Email</p>
                  <a href={`mailto:${selectedMsg.email}`} className="text-[#1a9fd4] hover:underline">{selectedMsg.email}</a>
                </div>
                {selectedMsg.phone && (
                  <div>
                    <p className="text-white/30 text-xs mb-0.5">Phone</p>
                    <p className="text-white/70">{selectedMsg.phone}</p>
                  </div>
                )}
              </div>
            </div>
          ) : selectedInq ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <h2 className="text-white font-outfit font-semibold text-lg">
                    {selectedInq.course?.name ?? 'Course Booking Request'}
                  </h2>
                  <p className="text-white/40 text-sm mt-0.5">
                    From <span className="text-white/60">{selectedInq.name}</span> · {format(new Date(selectedInq.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <StatusBadge status={selectedInq.status} />
              </div>

              {/* Key details grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Email',    value: selectedInq.email },
                  { label: 'Phone',    value: selectedInq.phone },
                  { label: 'Level',    value: selectedInq.level ? (LEVEL_LABEL[selectedInq.level] ?? selectedInq.level) : null },
                  { label: 'Preferred dates', value: selectedInq.preferredDates },
                  { label: 'How heard', value: selectedInq.howHeard },
                ].filter(r => r.value).map(row => (
                  <div key={row.label} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/30 text-xs mb-0.5">{row.label}</p>
                    <p className="text-white/70 text-sm">{row.value}</p>
                  </div>
                ))}
              </div>

              {selectedInq.message && (
                <div className="bg-white/5 rounded-xl p-4 mb-5 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedInq.message}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-5">
                <a href={`mailto:${selectedInq.email}?subject=Your ${selectedInq.course?.name ?? 'course'} booking at Kite Side`}
                  onClick={() => updateInqStatus(selectedInq.id, 'REPLIED')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg transition-colors">
                  ✉️ Reply via Email
                </a>
                {selectedInq.phone && (
                  <a href={`https://wa.me/${selectedInq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedInq.name}! Thanks for your interest in the ${selectedInq.course?.name ?? 'course'} at Kite Side.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => updateInqStatus(selectedInq.id, 'REPLIED')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    📱 WhatsApp
                  </a>
                )}
                {selectedInq.status !== 'CLOSED' && (
                  <button onClick={() => updateInqStatus(selectedInq.id, 'CLOSED')}
                    className="px-4 py-2 text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 text-sm rounded-lg transition-colors">
                    Mark Closed
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
