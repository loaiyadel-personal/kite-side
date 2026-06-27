'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Course } from './CourseCard'

const LEVEL_OPTIONS = [
  { value: 'DISCOVERY',         label: 'Discovery Session' },
  { value: 'BEGINNER',          label: 'Beginner — IKO Level 1 & 2' },
  { value: 'INTERMEDIATE',      label: 'Intermediate — IKO Level 3' },
  { value: 'ADVANCED',          label: 'Advanced Progression' },
  { value: 'IKO_CERTIFICATION', label: 'IKO Assistant Instructor' },
]

const HOW_HEARD = ['Google', 'Instagram', 'Facebook', 'Friend / Word of mouth', 'Windfinder', 'Other']

interface Props {
  course: Course | null
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited'

export default function BookingModal({ course, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    level: course?.level ?? 'BEGINNER',
    preferredDates: '', howHeard: '', message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (course) setForm(f => ({ ...f, level: course.level }))
  }, [course])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!course) return null

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone/WhatsApp is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!course || !validate()) return
    setStatus('loading')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseId: course.id }),
      })
      if (res.status === 429) { setStatus('rate_limited'); return }
      if (!res.ok) { setStatus('error'); return }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-outfit font-bold text-xl text-brand-dark">Book a Course</h2>
            <p className="text-sm text-gray-500 mt-0.5">{course.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Success */}
        {status === 'success' && (
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">🤙</div>
            <h3 className="font-outfit font-bold text-xl text-brand-dark mb-2">Request received!</h3>
            <p className="text-gray-500 mb-6">We'll contact you within 24 hours to confirm your booking.</p>
            <button onClick={onClose} className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0a8cc0] transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Rate limited */}
        {status === 'rate_limited' && (
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="font-outfit font-bold text-xl text-brand-dark mb-2">Too many requests</h3>
            <p className="text-gray-500 mb-6">Please wait a while before submitting again, or reach us directly on WhatsApp.</p>
            <a href="https://wa.me/201116407080" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#25d366] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1eb557] transition-colors">
              WhatsApp us
            </a>
          </div>
        )}

        {/* Form */}
        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
            {status === 'error' && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                Something went wrong. Please try again or contact us on WhatsApp.
              </p>
            )}

            <Field label="Full Name *" error={errors.name}>
              <input
                type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your full name"
                className={input(!!errors.name)}
              />
            </Field>

            <Field label="Email *" error={errors.email}>
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
                className={input(!!errors.email)}
              />
            </Field>

            <Field label="Phone / WhatsApp *" error={errors.phone}>
              <input
                type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+20 xxx xxx xxxx"
                className={input(!!errors.phone)}
              />
            </Field>

            <Field label="Course Level">
              <select value={form.level} onChange={e => set('level', e.target.value)} className={input(false)}>
                {LEVEL_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Preferred dates or month">
              <input
                type="text" value={form.preferredDates} onChange={e => set('preferredDates', e.target.value)}
                placeholder="e.g. July 2025, first week of August"
                className={input(false)}
              />
            </Field>

            <Field label="How did you hear about us?">
              <select value={form.howHeard} onChange={e => set('howHeard', e.target.value)} className={input(false)}>
                <option value="">Select an option</option>
                {HOW_HEARD.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Message (optional)">
              <textarea
                value={form.message} onChange={e => set('message', e.target.value)}
                placeholder="Any questions or special requests?"
                rows={3}
                className={input(false) + ' resize-none'}
              />
            </Field>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 bg-brand-primary hover:bg-[#0a8cc0] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
              {status === 'loading' ? 'Sending…' : 'Send Booking Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function input(hasError: boolean) {
  return [
    'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10',
  ].join(' ')
}
