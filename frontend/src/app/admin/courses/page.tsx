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

interface Course {
  id:          string
  title:       string
  description: string
  price:       number
  duration?:   string
  level?:      string
  isPublished: boolean
  order:       number
}

const schema = z.object({
  title:       z.string().min(1, 'Title required'),
  description: z.string().min(1, 'Description required'),
  price:       z.coerce.number().positive('Price must be positive'),
  duration:    z.string().optional(),
  level:       z.string().optional(),
})
type Form = z.infer<typeof schema>

export default function CoursesPage() {
  const { token } = useAdminAuth()
  const [courses, setCourses]       = useState<Course[]>([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Course | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)

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

  function openAdd() { form.reset(); setEditing(null); setModalOpen(true) }
  function openEdit(c: Course) {
    form.reset({ title: c.title, description: c.description, price: c.price, duration: c.duration, level: c.level })
    setEditing(c)
    setModalOpen(true)
  }

  async function onSubmit(data: Form) {
    if (!token) return
    setSaving(true)
    const url    = editing ? `${API}/courses/${editing.id}` : `${API}/courses`
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

  const LEVEL_OPTS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']

  return (
    <div>
      <PageHeader title="Courses" subtitle={`${courses.length} courses`}
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add Course
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" /></div>
      ) : courses.length === 0 ? (
        <EmptyState icon="🪁" title="No courses yet" message="Add your first kitesurfing course" />
      ) : (
        <div className="grid gap-3">
          {courses.map(c => (
            <div key={c.id} className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{c.title}</p>
                  <StatusBadge status={c.isPublished ? 'PUBLISHED' : 'DRAFT'} />
                  {c.level && <span className="text-white/30 text-xs">{c.level}</span>}
                </div>
                <p className="text-white/40 text-sm truncate">{c.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                  <span className="text-[#1a9fd4] font-semibold">EGP {c.price.toLocaleString()}</span>
                  {c.duration && <span>⏱ {c.duration}</span>}
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

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); form.reset(); setEditing(null) }} title={editing ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...form.register('title')} placeholder="Course title *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            {form.formState.errors.title && <p className="text-red-400 text-xs mt-1">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <textarea {...form.register('description')} placeholder="Description *" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20 resize-none" />
            {form.formState.errors.description && <p className="text-red-400 text-xs mt-1">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <input {...form.register('price')} type="number" placeholder="Price (EGP) *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {form.formState.errors.price && <p className="text-red-400 text-xs mt-1">{form.formState.errors.price.message}</p>}
            </div>
            <input {...form.register('duration')} placeholder="Duration (e.g. 2h)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            <select {...form.register('level')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
              <option value="">Level</option>
              {LEVEL_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
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
