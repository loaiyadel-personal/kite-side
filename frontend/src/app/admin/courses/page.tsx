'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import EmptyState from '@/components/admin/ui/EmptyState'
import ToggleSwitch from '@/components/admin/ui/ToggleSwitch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

type CourseLevel = 'DISCOVERY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'IKO_CERTIFICATION' | 'INSTRUCTOR'

interface Course {
  id:           string
  level:        CourseLevel
  name:         string
  description:  string
  outcome?:     string
  durationHours: number
  maxStudents:  number
  priceEGP:     string | number
  priceUSD?:    string | number | null
  includes:     string[]
  isPublished:  boolean
  sortOrder:    number
}

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'DISCOVERY',        label: 'Discovery Session' },
  { value: 'BEGINNER',         label: 'Beginner' },
  { value: 'INTERMEDIATE',     label: 'Intermediate' },
  { value: 'ADVANCED',         label: 'Advanced' },
  { value: 'IKO_CERTIFICATION', label: 'IKO Certification' },
  { value: 'INSTRUCTOR',       label: 'Instructor' },
]

const schema = z.object({
  level:        z.enum(['DISCOVERY', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'IKO_CERTIFICATION', 'INSTRUCTOR']),
  name:         z.string().min(1, 'Name required'),
  description:  z.string().min(1, 'Description required'),
  outcome:      z.string().optional(),
  durationHours: z.coerce.number().int().positive('Must be positive'),
  maxStudents:  z.coerce.number().int().positive('Must be positive'),
  priceEGP:     z.coerce.number().positive('Price required'),
  priceUSD:     z.coerce.number().positive().optional().or(z.literal('')),
  includes:     z.string().optional(),
})
type Form = z.infer<typeof schema>

export default function CoursesPage() {
  const { token } = useAdminAuth()
  const [courses, setCourses]         = useState<Course[]>([])
  const [loading, setLoading]         = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState<Course | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)

  const form = useForm<Form>({ resolver: zodResolver(schema) })

  const fetchCourses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch(`${API}/courses`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  function openAdd() { form.reset({ level: 'BEGINNER', maxStudents: 2, durationHours: 3 }); setEditing(null); setModalOpen(true) }

  function openEdit(c: Course) {
    form.reset({
      level: c.level, name: c.name, description: c.description,
      outcome: c.outcome, durationHours: c.durationHours,
      maxStudents: c.maxStudents, priceEGP: Number(c.priceEGP),
      priceUSD: c.priceUSD ? Number(c.priceUSD) : '',
      includes: c.includes.join(', '),
    })
    setEditing(c)
    setModalOpen(true)
  }

  async function onSubmit(data: Form) {
    if (!token) return
    setSaving(true)
    const payload = {
      ...data,
      priceUSD: data.priceUSD === '' ? undefined : Number(data.priceUSD),
      includes: data.includes ? data.includes.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    const url    = editing ? `${API}/courses/${editing.id}` : `${API}/courses`
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) {
      toast.success(editing ? 'Updated' : 'Created')
      setModalOpen(false)
      form.reset()
      setEditing(null)
      fetchCourses()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to save')
    }
  }

  async function togglePublish(c: Course) {
    if (!token) return
    const res = await fetch(`${API}/courses/${c.id}/publish`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setCourses(prev => prev.map(i => i.id === c.id ? { ...i, isPublished: !i.isPublished } : i))
  }

  async function deleteCourse() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/courses/${deleteTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setCourses(prev => prev.filter(c => c.id !== deleteTarget))
      setDeleteTarget(null)
    } else toast.error('Delete failed')
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-primary/60 transition-colors placeholder-white/20'

  return (
    <div>
      <PageHeader title="Courses" subtitle={`${courses.length} courses`}
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-brand-primary hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add Course
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : courses.length === 0 ? (
        <EmptyState icon="🪁" title="No courses yet" message="Add your first kitesurfing course" />
      ) : (
        <div className="grid gap-3">
          {courses.map(c => (
            <div key={c.id} className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{c.name}</p>
                  <StatusBadge status={c.isPublished ? 'PUBLISHED' : 'DRAFT'} />
                  <span className="text-white/30 text-xs">{LEVELS.find(l => l.value === c.level)?.label ?? c.level}</span>
                </div>
                <p className="text-white/40 text-sm truncate">{c.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                  <span className="text-brand-primary font-semibold">EGP {Number(c.priceEGP).toLocaleString()}</span>
                  {c.priceUSD && <span className="text-white/30">/ ${Number(c.priceUSD)}</span>}
                  <span>⏱ {c.durationHours}h</span>
                  <span>👥 max {c.maxStudents}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <ToggleSwitch checked={c.isPublished} onChange={() => togglePublish(c)} />
                <button onClick={() => openEdit(c)} className="text-white/30 hover:text-white/70 p-1 transition-colors">✏️</button>
                <button onClick={() => setDeleteTarget(c.id)} className="text-white/20 hover:text-red-400 p-1 transition-colors">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); form.reset(); setEditing(null) }} title={editing ? 'Edit Course' : 'Add Course'} size="lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Level *</label>
              <select {...form.register('level')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-primary/60 transition-colors">
                {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Name *</label>
              <input {...form.register('name')} placeholder="e.g. Discovery Session" className={inputCls} />
              {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Description *</label>
            <textarea {...form.register('description')} rows={3} className={`${inputCls} resize-none`} />
            {form.formState.errors.description && <p className="text-red-400 text-xs mt-1">{form.formState.errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Learning Outcome</label>
            <input {...form.register('outcome')} placeholder="e.g. Ride upwind independently" className={inputCls} />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Duration (hours) *</label>
              <input {...form.register('durationHours')} type="number" className={inputCls} />
              {form.formState.errors.durationHours && <p className="text-red-400 text-xs mt-1">{form.formState.errors.durationHours.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Max students *</label>
              <input {...form.register('maxStudents')} type="number" className={inputCls} />
              {form.formState.errors.maxStudents && <p className="text-red-400 text-xs mt-1">{form.formState.errors.maxStudents.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Price EGP *</label>
              <input {...form.register('priceEGP')} type="number" className={inputCls} />
              {form.formState.errors.priceEGP && <p className="text-red-400 text-xs mt-1">{form.formState.errors.priceEGP.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Price USD</label>
              <input {...form.register('priceUSD')} type="number" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">What's included (comma-separated)</label>
            <input {...form.register('includes')} placeholder="Kite, Board, Harness, Instructor" className={inputCls} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-primary hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteCourse}
        title="Delete course" message="Delete this course permanently?" confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
