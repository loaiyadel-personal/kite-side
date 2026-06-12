'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import PasswordStrength from '@/components/admin/ui/PasswordStrength'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const siteSchema = z.object({
  whatsapp:     z.string().min(1, 'Required'),
  phone:        z.string().min(1, 'Required'),
  email:        z.string().email('Invalid email'),
  address:      z.string().min(1, 'Required'),
  instagramUrl: z.string().url('Invalid URL').or(z.literal('')),
  facebookUrl:  z.string().url('Invalid URL').or(z.literal('')),
  googleMapsUrl: z.string().optional(),
})

const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'Min 8 chars').regex(/^(?=.*[A-Z])(?=.*\d)/, 'Must have uppercase + number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type SiteForm = z.infer<typeof siteSchema>
type PwForm   = z.infer<typeof pwSchema>

export default function SettingsPage() {
  const { token, isSuperAdmin } = useAdminAuth()
  const [savingSite, setSavingSite] = useState(false)
  const [savingPw, setSavingPw]     = useState(false)
  const [watchPw, setWatchPw]       = useState('')

  const siteForm = useForm<SiteForm>({ resolver: zodResolver(siteSchema) })
  const pwForm   = useForm<PwForm>({ resolver: zodResolver(pwSchema) })

  useEffect(() => {
    if (!token) return
    fetch(`${API}/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) siteForm.reset(data) })
      .catch(() => {})
  }, [token])

  async function onSiteSubmit(data: SiteForm) {
    if (!token) return
    setSavingSite(true)
    const res = await fetch(`${API}/admin/settings`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    setSavingSite(false)
    if (res.ok) toast.success('Settings saved')
    else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Save failed')
    }
  }

  async function onPwSubmit(data: PwForm) {
    if (!token) return
    setSavingPw(true)
    const res = await fetch(`${API}/auth/password`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    })
    setSavingPw(false)
    if (res.ok) {
      toast.success('Password changed — you will be signed out')
      pwForm.reset()
      setWatchPw('')
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Password change failed')
    }
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20'

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage site-wide configuration" />

      {isSuperAdmin && (
        <section className="bg-[#1e293b] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-white font-outfit font-semibold mb-5">Site Information</h2>
          <form onSubmit={siteForm.handleSubmit(onSiteSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">WhatsApp Number</label>
                <input {...siteForm.register('whatsapp')} className={inputCls} placeholder="+201116407080" />
                {siteForm.formState.errors.whatsapp && <p className="text-red-400 text-xs mt-1">{siteForm.formState.errors.whatsapp.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Phone</label>
                <input {...siteForm.register('phone')} className={inputCls} />
                {siteForm.formState.errors.phone && <p className="text-red-400 text-xs mt-1">{siteForm.formState.errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Contact Email</label>
              <input {...siteForm.register('email')} type="email" className={inputCls} />
              {siteForm.formState.errors.email && <p className="text-red-400 text-xs mt-1">{siteForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Address</label>
              <input {...siteForm.register('address')} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">Instagram URL</label>
                <input {...siteForm.register('instagramUrl')} className={inputCls} />
                {siteForm.formState.errors.instagramUrl && <p className="text-red-400 text-xs mt-1">{siteForm.formState.errors.instagramUrl.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Facebook URL</label>
                <input {...siteForm.register('facebookUrl')} className={inputCls} />
                {siteForm.formState.errors.facebookUrl && <p className="text-red-400 text-xs mt-1">{siteForm.formState.errors.facebookUrl.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Google Maps Embed URL (optional)</label>
              <input {...siteForm.register('googleMapsUrl')} className={inputCls} />
            </div>
            <div className="pt-2">
              <button type="submit" disabled={savingSite} className="px-5 py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg disabled:opacity-50 transition-colors">
                {savingSite ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="bg-[#1e293b] border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-outfit font-semibold mb-5">Change Password</h2>
        <form onSubmit={pwForm.handleSubmit(onPwSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Current Password</label>
            <input {...pwForm.register('currentPassword')} type="password" className={inputCls} />
            {pwForm.formState.errors.currentPassword && <p className="text-red-400 text-xs mt-1">{pwForm.formState.errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">New Password</label>
            <input {...pwForm.register('newPassword')} type="password" className={inputCls}
              onChange={e => { pwForm.setValue('newPassword', e.target.value); setWatchPw(e.target.value) }} />
            {pwForm.formState.errors.newPassword && <p className="text-red-400 text-xs mt-1">{pwForm.formState.errors.newPassword.message}</p>}
            <PasswordStrength password={watchPw} />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Confirm New Password</label>
            <input {...pwForm.register('confirmPassword')} type="password" className={inputCls} />
            {pwForm.formState.errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{pwForm.formState.errors.confirmPassword.message}</p>}
          </div>
          <div className="pt-2">
            <button type="submit" disabled={savingPw} className="px-5 py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg disabled:opacity-50 transition-colors">
              {savingPw ? 'Changing…' : 'Change Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
