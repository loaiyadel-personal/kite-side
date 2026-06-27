'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import EmptyState from '@/components/admin/ui/EmptyState'
import ToggleSwitch from '@/components/admin/ui/ToggleSwitch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

type Category = 'RENTAL_KITE' | 'RENTAL_BOARD' | 'RENTAL_HARNESS' | 'RENTAL_WETSUIT' | 'RENTAL_FULL_GEAR' | 'BEACH_USE'

interface PriceItem {
  id:            string
  category:      Category
  name:          string
  description?:  string | null
  priceEGP:      string | number
  priceUSD?:     string | number | null
  unit:          string
  isActive:      boolean
  isHighlighted: boolean
  sortOrder:     number
}

const CATEGORIES: { value: Category; label: string; group: string }[] = [
  { value: 'RENTAL_KITE',      label: 'Kite Rental',        group: 'Rentals' },
  { value: 'RENTAL_BOARD',     label: 'Board Rental',       group: 'Rentals' },
  { value: 'RENTAL_HARNESS',   label: 'Harness Rental',     group: 'Rentals' },
  { value: 'RENTAL_WETSUIT',   label: 'Wetsuit Rental',     group: 'Rentals' },
  { value: 'RENTAL_FULL_GEAR', label: 'Full Gear Package',  group: 'Rentals' },
  { value: 'BEACH_USE',        label: 'Beach Use',          group: 'Beach' },
]

const schema = z.object({
  category:      z.enum(['RENTAL_KITE', 'RENTAL_BOARD', 'RENTAL_HARNESS', 'RENTAL_WETSUIT', 'RENTAL_FULL_GEAR', 'BEACH_USE']),
  name:          z.string().min(1, 'Name required'),
  description:   z.string().optional(),
  priceEGP:      z.coerce.number().positive('EGP price required'),
  priceUSD:      z.coerce.number().positive().optional().or(z.literal('')),
  unit:          z.string().min(1, 'Unit required'),
  isHighlighted: z.boolean().default(false),
})
type Form = z.infer<typeof schema>

const TAB_GROUPS = ['Rentals', 'Beach'] as const
type TabGroup = typeof TAB_GROUPS[number]

export default function PricingPage() {
  const { token } = useAdminAuth()
  const [items, setItems]           = useState<PriceItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState<TabGroup>('Rentals')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<PriceItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const form = useForm<Form>({ resolver: zodResolver(schema) })

  const fetchItems = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const grouped = await fetch(`${API}/pricing`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { rentals: [], beach: [] })
      .catch(() => ({ rentals: [], beach: [] }))
    setItems([...(grouped.rentals ?? []), ...(grouped.beach ?? [])])
    setLoading(false)
  }, [token])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openAdd() {
    const defaultCat = tab === 'Rentals' ? 'RENTAL_KITE' : 'BEACH_USE'
    form.reset({ category: defaultCat, unit: 'per session', isHighlighted: false })
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item: PriceItem) {
    form.reset({
      category:      item.category,
      name:          item.name,
      description:   item.description ?? '',
      priceEGP:      Number(item.priceEGP),
      priceUSD:      item.priceUSD ? Number(item.priceUSD) : '',
      unit:          item.unit,
      isHighlighted: item.isHighlighted,
    })
    setEditing(item)
    setModalOpen(true)
  }

  async function onSubmit(data: Form) {
    if (!token) return
    setSaving(true)
    const payload = { ...data, priceUSD: data.priceUSD === '' ? undefined : Number(data.priceUSD) }
    const url    = editing ? `${API}/pricing/${editing.id}` : `${API}/pricing`
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
      fetchItems()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to save')
    }
  }

  async function toggleActive(item: PriceItem) {
    if (!token) return
    const res = await fetch(`${API}/pricing/${item.id}/toggle`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i))
    } else {
      toast.error('Failed to update')
    }
  }

  async function deleteItem() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/pricing/${deleteTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setItems(prev => prev.filter(i => i.id !== deleteTarget))
      setDeleteTarget(null)
    } else toast.error('Delete failed')
  }

  const RENTAL_CATS: Category[] = ['RENTAL_KITE', 'RENTAL_BOARD', 'RENTAL_HARNESS', 'RENTAL_WETSUIT', 'RENTAL_FULL_GEAR']
  const visible = items.filter(i => tab === 'Rentals' ? RENTAL_CATS.includes(i.category) : i.category === 'BEACH_USE')

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-primary/60 transition-colors placeholder-white/20'

  return (
    <div>
      <PageHeader title="Pricing" subtitle="Manage rental and beach pricing"
        action={
          <button onClick={openAdd} className="px-4 py-2 text-sm bg-brand-primary hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add Item
          </button>
        }
      />

      <div className="flex gap-1 mb-5 bg-[#1e293b] border border-white/10 rounded-xl p-1 w-fit">
        {TAB_GROUPS.map(g => (
          <button key={g} onClick={() => setTab(g)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === g ? 'bg-brand-primary text-white' : 'text-white/40 hover:text-white/70'}`}>
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : visible.length === 0 ? (
        <EmptyState icon="💰" title="No pricing items" message="Add the first pricing item for this section" />
      ) : (
        <div className="grid gap-3">
          {visible.map(item => (
            <div key={item.id} className={`bg-[#1e293b] border rounded-xl p-4 flex items-center gap-4 ${item.isHighlighted ? 'border-brand-primary/40' : 'border-white/10'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-medium">{item.name}</p>
                  {item.isHighlighted && <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded font-medium">Featured</span>}
                  <span className="text-white/30 text-xs">{CATEGORIES.find(c => c.value === item.category)?.label}</span>
                </div>
                {item.description && <p className="text-white/40 text-xs truncate">{item.description}</p>}
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="text-brand-primary font-semibold">EGP {Number(item.priceEGP).toLocaleString()}</span>
                  {item.priceUSD && <span className="text-white/30">/ ${Number(item.priceUSD)}</span>}
                  <span className="text-white/30 text-xs">{item.unit}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <ToggleSwitch checked={item.isActive} onChange={() => toggleActive(item)} />
                <button onClick={() => openEdit(item)} className="text-white/30 hover:text-white/70 p-1 transition-colors">✏️</button>
                <button onClick={() => setDeleteTarget(item.id)} className="text-white/20 hover:text-red-400 p-1 transition-colors">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); form.reset(); setEditing(null) }}
        title={editing ? 'Edit Pricing Item' : 'Add Pricing Item'}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Category *</label>
              <select {...form.register('category')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-brand-primary/60 transition-colors">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Name *</label>
              <input {...form.register('name')} placeholder="e.g. Kite Rental" className={inputCls} />
              {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Description</label>
            <input {...form.register('description')} placeholder="e.g. Includes kite, bar and lines" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Price EGP *</label>
              <input {...form.register('priceEGP')} type="number" className={inputCls} />
              {form.formState.errors.priceEGP && <p className="text-red-400 text-xs mt-1">{form.formState.errors.priceEGP.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Price USD</label>
              <input {...form.register('priceUSD')} type="number" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Unit *</label>
              <input {...form.register('unit')} placeholder="per session" className={inputCls} />
              {form.formState.errors.unit && <p className="text-red-400 text-xs mt-1">{form.formState.errors.unit.message}</p>}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register('isHighlighted')} className="w-4 h-4 rounded accent-brand-primary" />
            <span className="text-white/60 text-sm">Feature / highlight this item</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-brand-primary hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteItem}
        title="Delete pricing item" message="Delete this pricing item permanently?" confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
