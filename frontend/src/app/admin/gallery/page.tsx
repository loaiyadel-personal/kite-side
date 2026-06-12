'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import EmptyState from '@/components/admin/ui/EmptyState'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import ToggleSwitch from '@/components/admin/ui/ToggleSwitch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface GalleryItem {
  id:          string
  type:        'PHOTO' | 'VIDEO'
  title?:      string
  caption?:    string
  url:         string
  thumbnailUrl?: string
  category?:   string
  isPublished: boolean
  order:       number
}

const photoSchema = z.object({
  title:    z.string().optional(),
  caption:  z.string().optional(),
  category: z.string().optional(),
})
const videoSchema = z.object({
  title:      z.string().min(1, 'Title required'),
  url:        z.string().url('Enter a valid video URL'),
  caption:    z.string().optional(),
  category:   z.string().optional(),
})
type PhotoForm = z.infer<typeof photoSchema>
type VideoForm = z.infer<typeof videoSchema>

export default function GalleryPage() {
  const { token } = useAdminAuth()
  const [items, setItems]           = useState<GalleryItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [addPhotoOpen, setAddPhotoOpen] = useState(false)
  const [addVideoOpen, setAddVideoOpen] = useState(false)
  const [editItem, setEditItem]     = useState<GalleryItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [deleting, setDeleting]     = useState(false)
  const [saving, setSaving]         = useState(false)

  const photoForm = useForm<PhotoForm>({ resolver: zodResolver(photoSchema) })
  const videoForm = useForm<VideoForm>({ resolver: zodResolver(videoSchema) })

  const fetchItems = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch(`${API}/gallery/admin`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function submitPhoto(data: PhotoForm) {
    if (!token || !imageFile) { toast.error('Please select an image'); return }
    setSaving(true)
    const form = new FormData()
    form.append('image', imageFile)
    if (data.title) form.append('title', data.title)
    if (data.caption) form.append('caption', data.caption)
    if (data.category) form.append('category', data.category)
    const res = await fetch(`${API}/gallery/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Photo uploaded')
      setAddPhotoOpen(false)
      setImageFile(null)
      photoForm.reset()
      fetchItems()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Upload failed')
    }
  }

  async function submitVideo(data: VideoForm) {
    if (!token) return
    setSaving(true)
    const res = await fetch(`${API}/gallery/video`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Video added')
      setAddVideoOpen(false)
      videoForm.reset()
      fetchItems()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to add video')
    }
  }

  async function togglePublish(item: GalleryItem) {
    if (!token) return
    const res = await fetch(`${API}/gallery/${item.id}/publish`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isPublished: !i.isPublished } : i))
    }
  }

  async function deleteItem() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/gallery/${deleteTarget}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setItems(prev => prev.filter(i => i.id !== deleteTarget))
      setDeleteTarget(null)
    } else {
      toast.error('Delete failed')
    }
  }

  const actions = (
    <div className="flex gap-2">
      <button onClick={() => setAddVideoOpen(true)}
        className="px-4 py-2 text-sm border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-lg transition-colors">
        + Video
      </button>
      <button onClick={() => setAddPhotoOpen(true)}
        className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
        + Upload Photo
      </button>
    </div>
  )

  return (
    <div>
      <PageHeader title="Gallery" subtitle={`${items.length} items`} action={actions} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon="🖼️" title="No gallery items" message="Upload your first photo or video" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-white/5 relative">
                {item.thumbnailUrl || item.url ? (
                  <img src={item.thumbnailUrl ?? item.url} alt={item.title ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">
                    {item.type === 'VIDEO' ? '🎬' : '🖼️'}
                  </div>
                )}
                <div className="absolute top-2 left-2"><StatusBadge status={item.isPublished ? 'PUBLISHED' : 'DRAFT'} /></div>
              </div>
              <div className="p-3">
                <p className="text-white/70 text-xs truncate mb-2">{item.title || item.category || item.type}</p>
                <div className="flex items-center justify-between">
                  <ToggleSwitch checked={item.isPublished} onChange={() => togglePublish(item)} />
                  <button onClick={() => setDeleteTarget(item.id)}
                    className="text-white/20 hover:text-red-400 text-sm transition-colors">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add photo modal */}
      <Modal open={addPhotoOpen} onClose={() => { setAddPhotoOpen(false); setImageFile(null); photoForm.reset() }} title="Upload Photo">
        <form onSubmit={photoForm.handleSubmit(submitPhoto)} className="space-y-4">
          <ImageUpload label="Photo *" onChange={setImageFile} aspectRatio="16/9" />
          <input {...photoForm.register('title')} placeholder="Title (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          <input {...photoForm.register('category')} placeholder="Category (e.g. kitesurfing)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          <textarea {...photoForm.register('caption')} placeholder="Caption (optional)" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20 resize-none" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddPhotoOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add video modal */}
      <Modal open={addVideoOpen} onClose={() => { setAddVideoOpen(false); videoForm.reset() }} title="Add Video">
        <form onSubmit={videoForm.handleSubmit(submitVideo)} className="space-y-4">
          <div>
            <input {...videoForm.register('title')} placeholder="Title *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            {videoForm.formState.errors.title && <p className="text-red-400 text-xs mt-1">{videoForm.formState.errors.title.message}</p>}
          </div>
          <div>
            <input {...videoForm.register('url')} placeholder="Video URL (YouTube/Vimeo) *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            {videoForm.formState.errors.url && <p className="text-red-400 text-xs mt-1">{videoForm.formState.errors.url.message}</p>}
          </div>
          <input {...videoForm.register('category')} placeholder="Category" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          <textarea {...videoForm.register('caption')} placeholder="Caption" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20 resize-none" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddVideoOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Adding…' : 'Add Video'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteItem}
        title="Delete item" message="This will permanently delete the item and its files. Continue?"
        confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
