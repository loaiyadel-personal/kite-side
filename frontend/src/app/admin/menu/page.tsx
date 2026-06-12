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

interface Category { id: string; name: string; nameAr?: string; order: number }
interface MenuItem {
  id:           string
  name:         string
  nameAr?:      string
  description?: string
  price:        number
  categoryId:   string
  imageUrl?:    string
  isAvailable:  boolean
  order:        number
}

const itemSchema = z.object({
  name:        z.string().min(1, 'Name required'),
  nameAr:      z.string().optional(),
  description: z.string().optional(),
  price:       z.coerce.number().positive('Price must be positive'),
  categoryId:  z.string().min(1, 'Category required'),
})
type ItemForm = z.infer<typeof itemSchema>

export default function MenuPage() {
  const { token } = useAdminAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems]           = useState<MenuItem[]>([])
  const [activeCategory, setActiveCat] = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)
  const [addOpen, setAddOpen]       = useState(false)
  const [editItem, setEditItem]     = useState<MenuItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const form = useForm<ItemForm>({ resolver: zodResolver(itemSchema) })

  const fetchAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const h = { Authorization: `Bearer ${token}` }
    const [catRes, itemRes] = await Promise.all([
      fetch(`${API}/menu/categories`, { headers: h }),
      fetch(`${API}/menu`, { headers: h }),
    ])
    if (catRes.ok) {
      const cats: Category[] = await catRes.json()
      setCategories(cats)
      if (!activeCategory && cats.length > 0) setActiveCat(cats[0].id)
    }
    if (itemRes.ok) {
      const data = await itemRes.json()
      setItems(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token, activeCategory])

  useEffect(() => { fetchAll() }, [token])

  function openAdd() {
    form.reset({ categoryId: activeCategory ?? '' })
    setImageFile(null)
    setEditItem(null)
    setAddOpen(true)
  }

  function openEdit(item: MenuItem) {
    form.reset({
      name: item.name, nameAr: item.nameAr, description: item.description,
      price: item.price, categoryId: item.categoryId,
    })
    setEditItem(item)
    setImageFile(null)
    setAddOpen(true)
  }

  async function onSubmit(data: ItemForm) {
    if (!token) return
    setSaving(true)
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)) })
    if (imageFile) fd.append('image', imageFile)
    const url   = editItem ? `${API}/menu/items/${editItem.id}` : `${API}/menu/items`
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd })
    setSaving(false)
    if (res.ok) {
      toast.success(editItem ? 'Updated' : 'Created')
      setAddOpen(false)
      form.reset()
      setEditItem(null)
      setImageFile(null)
      fetchAll()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to save')
    }
  }

  async function toggleAvailability(item: MenuItem) {
    if (!token) return
    const res = await fetch(`${API}/menu/items/${item.id}/availability`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
  }

  async function deleteMenuItem() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/menu/items/${deleteTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setItems(prev => prev.filter(i => i.id !== deleteTarget))
      setDeleteTarget(null)
    } else toast.error('Delete failed')
  }

  const visible = items.filter(i => !activeCategory || i.categoryId === activeCategory)

  return (
    <div>
      <PageHeader title="Menu" subtitle={`${items.length} items across ${categories.length} categories`}
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add Item
          </button>
        }
      />

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-5">
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeCategory === c.id ? 'bg-[#1a9fd4] text-white' : 'bg-[#1e293b] border border-white/10 text-white/50 hover:text-white/80'
              }`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" /></div>
      ) : visible.length === 0 ? (
        <EmptyState icon="🍽️" title="No items" message="Add items to this category" />
      ) : (
        <div className="grid gap-3">
          {visible.map(item => (
            <div key={item.id} className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-none" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{item.name}</p>
                  {item.nameAr && <p className="text-white/40 text-sm truncate">{item.nameAr}</p>}
                </div>
                {item.description && <p className="text-white/40 text-xs truncate mt-0.5">{item.description}</p>}
                <p className="text-[#1a9fd4] font-semibold text-sm mt-1">EGP {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <ToggleSwitch checked={item.isAvailable} onChange={() => toggleAvailability(item)} />
                <button onClick={() => openEdit(item)} className="text-white/30 hover:text-white/70 text-sm p-1 transition-colors">✏️</button>
                <button onClick={() => setDeleteTarget(item.id)} className="text-white/20 hover:text-red-400 text-sm p-1 transition-colors">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => { setAddOpen(false); form.reset(); setEditItem(null); setImageFile(null) }}
        title={editItem ? 'Edit Item' : 'Add Menu Item'}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload label="Photo (optional)" value={editItem?.imageUrl} onChange={setImageFile} aspectRatio="4/3" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...form.register('name')} placeholder="Name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <input {...form.register('nameAr')} placeholder="Arabic name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          </div>
          <textarea {...form.register('description')} placeholder="Description" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...form.register('price')} type="number" placeholder="Price (EGP) *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {form.formState.errors.price && <p className="text-red-400 text-xs mt-1">{form.formState.errors.price.message}</p>}
            </div>
            <div>
              <select {...form.register('categoryId')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {form.formState.errors.categoryId && <p className="text-red-400 text-xs mt-1">{form.formState.errors.categoryId.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteMenuItem}
        title="Delete item" message="Delete this menu item? This cannot be undone."
        confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
