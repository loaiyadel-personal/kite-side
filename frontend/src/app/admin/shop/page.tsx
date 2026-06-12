'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import EmptyState from '@/components/admin/ui/EmptyState'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import ToggleSwitch from '@/components/admin/ui/ToggleSwitch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface ShopItem {
  id:           string
  name:         string
  description?: string
  price:        number
  currency:     string
  imageUrl?:    string
  thumbnailUrl?: string
  tags:         string[]
  isActive:     boolean
  order:        number
}

const schema = z.object({
  name:        z.string().min(1, 'Name required'),
  description: z.string().optional(),
  price:       z.coerce.number().positive('Price must be positive'),
  currency:    z.string().default('USD'),
  tags:        z.string().optional(),
})
type Form = z.infer<typeof schema>

const CURRENCIES = ['USD', 'EGP', 'EUR']

export default function ShopPage() {
  const { token } = useAdminAuth()
  const [items, setItems]           = useState<ShopItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<ShopItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const form = useForm<Form>({ resolver: zodResolver(schema) })

  const fetchItems = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch(`${API}/shop`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.items ?? [])
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openAdd() {
    form.reset({ currency: 'USD' })
    setImageFile(null)
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item: ShopItem) {
    form.reset({
      name: item.name, description: item.description,
      price: item.price, currency: item.currency,
      tags: item.tags.join(', '),
    })
    setEditing(item)
    setImageFile(null)
    setModalOpen(true)
  }

  async function onSubmit(data: Form) {
    if (!token) return
    setSaving(true)
    const fd = new FormData()
    fd.append('name', data.name)
    fd.append('price', String(data.price))
    fd.append('currency', data.currency)
    if (data.description) fd.append('description', data.description)
    if (data.tags) fd.append('tags', JSON.stringify(data.tags.split(',').map(t => t.trim()).filter(Boolean)))
    if (imageFile) fd.append('image', imageFile)
    const url    = editing ? `${API}/shop/${editing.id}` : `${API}/shop`
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd })
    setSaving(false)
    if (res.ok) {
      toast.success(editing ? 'Updated' : 'Created')
      setModalOpen(false)
      form.reset()
      setEditing(null)
      setImageFile(null)
      fetchItems()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to save')
    }
  }

  async function toggleActive(item: ShopItem) {
    if (!token) return
    const res = await fetch(`${API}/shop/${item.id}/toggle`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i))
  }

  async function deleteItem() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/shop/${deleteTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setItems(prev => prev.filter(i => i.id !== deleteTarget))
      setDeleteTarget(null)
    } else toast.error('Delete failed')
  }

  return (
    <div>
      <PageHeader title="Shop" subtitle={`${items.length} products`}
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add Product
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="🏪" title="No products yet" message="Add your first shop item" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-[#1e293b] border rounded-xl overflow-hidden ${item.isActive ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
              <div className="aspect-square bg-white/5">
                {item.thumbnailUrl || item.imageUrl ? (
                  <img src={item.thumbnailUrl ?? item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🛍️</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white/80 text-sm font-medium truncate mb-0.5">{item.name}</p>
                <p className="text-[#1a9fd4] text-sm font-semibold">{item.currency} {item.price.toLocaleString()}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                    {item.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <ToggleSwitch checked={item.isActive} onChange={() => toggleActive(item)} />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="text-white/30 hover:text-white/70 p-1 text-sm transition-colors">✏️</button>
                    <button onClick={() => setDeleteTarget(item.id)} className="text-white/20 hover:text-red-400 p-1 text-sm transition-colors">🗑</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); form.reset(); setEditing(null); setImageFile(null) }}
        title={editing ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload label="Product Image" value={editing?.imageUrl} onChange={setImageFile} aspectRatio="1/1" />
          <div>
            <input {...form.register('name')} placeholder="Product name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
          </div>
          <textarea {...form.register('description')} placeholder="Description" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...form.register('price')} type="number" placeholder="Price *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {form.formState.errors.price && <p className="text-red-400 text-xs mt-1">{form.formState.errors.price.message}</p>}
            </div>
            <select {...form.register('currency')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input {...form.register('tags')} placeholder="Tags (comma-separated: kites, boards)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteItem}
        title="Delete product" message="Delete this product permanently?" confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
