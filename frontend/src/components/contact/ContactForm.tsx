'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle, MessageCircle } from 'lucide-react'

// Matches backend Zod schema exactly
const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Enter a valid email address'),
  phone:   z.string().max(30).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().optional(), // honeypot
})

type FormValues = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [submittedName, setSubmittedName] = useState('')

  const {
    register, handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setStatus('loading')
    setSubmittedName(data.name)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 429) { setStatus('rate_limited'); return }
      if (!res.ok) { setStatus('error'); return }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6">
        <CheckCircle size={52} className="text-green-500 mb-4" />
        <h3 className="font-outfit font-bold text-2xl text-[#022b3d] mb-2">Message Sent!</h3>
        <p className="text-gray-600 max-w-sm mb-6">
          Thanks {submittedName}, we received your message and will reply within 24 hours.
        </p>
        <p className="text-gray-500 text-sm mb-3">In the meantime, WhatsApp us directly:</p>
        <a
          href="https://wa.me/201116407080"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25d366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1eb557] transition-colors"
        >
          <MessageCircle size={18} />
          WhatsApp Us
        </a>
      </div>
    )
  }

  if (status === 'rate_limited') {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="font-outfit font-bold text-xl text-[#022b3d] mb-2">Too many messages</h3>
        <p className="text-gray-500 mb-5">
          Please wait 15 minutes before sending another message, or reach us directly on WhatsApp.
        </p>
        <a
          href="https://wa.me/201116407080"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25d366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1eb557] transition-colors"
        >
          <MessageCircle size={18} />
          WhatsApp Instead
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
          Something went wrong. Please try WhatsApp instead: <a href="https://wa.me/201116407080" className="underline font-medium">+20 11 16407080</a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name *" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Your full name"
            className={inp(!!errors.name)}
          />
        </Field>
        <Field label="Email Address *" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className={inp(!!errors.email)}
          />
        </Field>
      </div>

      <Field label="Phone / WhatsApp" error={errors.phone?.message}>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+20 xxx xxx xxxx"
          className={inp(!!errors.phone)}
        />
      </Field>

      <Field label="Subject *" error={errors.subject?.message}>
        <input
          {...register('subject')}
          placeholder="What's this about?"
          className={inp(!!errors.subject)}
        />
      </Field>

      <Field label="Message *" error={errors.message?.message}>
        <textarea
          {...register('message')}
          placeholder="Tell us how we can help..."
          rows={5}
          className={inp(!!errors.message) + ' resize-none'}
        />
      </Field>

      {/* Honeypot — hidden via CSS, never visible to humans */}
      <input
        {...register('website')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 bg-[#1a9fd4] hover:bg-[#0a8cc0] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        {status === 'loading'
          ? <><Loader2 size={18} className="animate-spin" /> Sending…</>
          : <><Send size={16} /> Send Message</>
        }
      </button>
    </form>
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

function inp(hasError: boolean) {
  return [
    'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-[#1a9fd4] focus:ring-2 focus:ring-[#1a9fd4]/10',
  ].join(' ')
}
