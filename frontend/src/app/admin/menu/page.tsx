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

interface Category { id: string; name: string; nameAr?: string; sortOrder: number }
interface MenuItem {
  id:            string
  name:          string
  nameAr?:       string | null
  description?:  string | null
  price:         string | number
  categoryId:    string
  imageUrl?:     string | null
  isAvailable:   boolean
  sortOrder:     number
}

const itemSchema = z.object({
  name:        z.string().min(1, 'Name required'),
  nameAr:      z.string().optional(),
  description: z.string().optional(),
  price:       z.coerce.number().positive('Price must be positive'),
  categoryId:  z.string().min(1, 'Category required'),
})
type ItemForm = z.infer<typeof itemSchema>

const catSchema = z.object({
  name:    z.string().min(1, 'Name required'),
  nameAr:  z.string().optional(),
})
type CatForm = z.infer<typeof catSchema>

export default function MenuPage() {
  const { token } = useAdminAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems]           = useState<MenuItem[]>([])
  const [activeCategory, setActiveCat] = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)

  // Item modal
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [editItem, setEditItem]     = useState<MenuItem | null>(null)
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [savingItem, setSavingItem] = useState(false)

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editCat, setEditCat]       = useState<Category | null>(null)
  const [savingCat, setSavingCat]   = useState(false)

  // Confirm dialogs
  const [deleteItemTarget, setDeleteItemTarget] = useState<string | null>(null)
  const [deleteCatTarget, setDeleteCatTarget]   = useState<string | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)
  const [deletingCat, setDeletingCat]   = useState(false)

  const itemForm = useForm<ItemForm>({ resolver: zodResolver(itemSchema) })
  const catForm  = useForm<CatForm>({ resolver: zodResolver(catSchema) })

  const fetchAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const h = { Authorization: `Bearer ${token}` }

    const [catRes, menuRes] = await Promise.all([
      fetch(`${API}/menu/categories`, { headers: h }),
      fetch(`${API}/menu`, { headers: h }),
    ])

    if (catRes.ok) {
      const cats: Category[] = await catRes.json()
      setCategories(cats)
      if (cats.length > 0) setActiveCat(prev => prev ?? cats[0].id)
    }

    if (menuRes.ok) {
      const grouped: (Category & { items: MenuItem[] })[] = await menuRes.json()
      const flat = grouped.flatMap(cat =>
        (cat.items ?? []).map(item => ({ ...item, categoryId: cat.id }))
      )
      setItems(flat)
    }

    setLoading(false)
  }, [token])

  useEffect(() => { fetchAll() }, [token])

  // ── Items ────────────────────────────────────────────────────────────────────

  function openAddItem() {
    itemForm.reset({ categoryId: activeCategory ?? '' })
    setImageFile(null)
    setEditItem(null)
    setItemModalOpen(true)
  }

  function openEditItem(item: MenuItem) {
    itemForm.reset({
      name: item.name,
      nameAr: item.nameAr ?? '',
      description: item.description ?? '',
      price: Number(item.price),
      categoryId: item.categoryId,
    })
    setEditItem(item)
    setImageFile(null)
    setItemModalOpen(true)
  }

  async function onSubmitItem(data: ItemForm) {
    if (!token) return
    setSavingItem(true)
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v != null && v !== '') fd.append(k, String(v)) })
    if (imageFile) fd.append('image', imageFile)
    const url    = editItem ? `${API}/menu/items/${editItem.id}` : `${API}/menu/items`
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd })
    setSavingItem(false)
    if (res.ok) {
      toast.success(editItem ? 'Updated' : 'Created')
      setItemModalOpen(false)
      itemForm.reset()
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
    else toast.error('Failed to update')
  }

  async function deleteMenuItem() {
    if (!token || !deleteItemTarget) return
    setDeletingItem(true)
    const res = await fetch(`${API}/menu/items/${deleteItemTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeletingItem(false)
    if (res.ok) {
      toast.success('Deleted')
      setItems(prev => prev.filter(i => i.id !== deleteItemTarget))
      setDeleteItemTarget(null)
    } else toast.error('Delete failed')
  }

  // ── Categories ───────────────────────────────────────────────────────────────

  function openAddCat() {
    catForm.reset({ name: '', nameAr: '' })
    setEditCat(null)
    setCatModalOpen(true)
  }

  function openEditCat(cat: Category) {
    catForm.reset({ name: cat.name, nameAr: cat.nameAr ?? '' })
    setEditCat(cat)
    setCatModalOpen(true)
  }

  async function onSubmitCat(data: CatForm) {
    if (!token) return
    setSavingCat(true)
    const url    = editCat ? `${API}/menu/categories/${editCat.id}` : `${API}/menu/categories`
    const method = editCat ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSavingCat(false)
    if (res.ok) {
      toast.success(editCat ? 'Category updated' : 'Category created')
      setCatModalOpen(false)
      catForm.reset()
      setEditCat(null)
      fetchAll()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to save')
    }
  }

  async function deleteCategory() {
    if (!token || !deleteCatTarget) return
    setDeletingCat(true)
    const res = await fetch(`${API}/menu/categories/${deleteCatTarget}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setDeletingCat(false)
    if (res.ok) {
      toast.success('Category deleted')
      if (activeCategory === deleteCatTarget) setActiveCat(null)
      setDeleteCatTarget(null)
      fetchAll()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Delete failed — remove all items first')
    }
  }

  const visible = activeCategory ? items.filter(i => i.categoryId === activeCategory) : items
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20'

  return (
    <div>
      <PageHeader
        title="Menu"
        subtitle={`${items.length} items · ${categories.length} categories`}
        action={
          <div className="flex gap-2">
            <button onClick={openAddCat} className="px-4 py-2 text-sm border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-lg transition-colors">
              + Category
            </button>
            <button onClick={openAddItem} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
              + Add Item
            </button>
          </div>
        }
      />

      {/* Category tabs with edit/delete */}
      {categories.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-5">
          {categories.map(c => (
            <div key={c.id} className={`group flex items-center gap-1 rounded-lg text-sm transition-colors ${
              activeCategory === c.id
                ? 'bg-[#1a9fd4] text-white'
                : 'bg-[#1e293b] border border-white/10 text-white/50 hover:text-white/80'
            }`}>
              <button
                onClick={() => setActiveCat(c.id)}
                className="px-3 py-1.5"
              >
                {c.name}
              </button>
              <div className="hidden group-hover:flex items-center gap-0.5 pr-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditCat(c) }}
                  className={`p-0.5 rounded text-xs hover:opacity-100 ${activeCategory === c.id ? 'text-white/70 hover:text-white' : 'text-white/30 hover:text-white/60'}`}
                  title="Rename category"
                >✏️</button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteCatTarget(c.id) }}
                  className={`p-0.5 rounded text-xs ${activeCategory === c.id ? 'text-white/70 hover:text-white' : 'text-white/20 hover:text-red-400'}`}
                  title="Delete category"
                >🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" />
        </div>
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
                <p className="text-[#1a9fd4] font-semibold text-sm mt-1">
                  EGP {Number(item.price).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <ToggleSwitch checked={item.isAvailable} onChange={() => toggleAvailability(item)} />
                <button onClick={() => openEditItem(item)} className="text-white/30 hover:text-white/70 text-sm p-1 transition-colors">✏️</button>
                <button onClick={() => setDeleteItemTarget(item.id)} className="text-white/20 hover:text-red-400 text-sm p-1 transition-colors">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item modal */}
      <Modal
        open={itemModalOpen}
        onClose={() => { setItemModalOpen(false); itemForm.reset(); setEditItem(null); setImageFile(null) }}
        title={editItem ? 'Edit Item' : 'Add Menu Item'}
      >
        <form onSubmit={itemForm.handleSubmit(onSubmitItem)} className="space-y-4">
          <ImageUpload label="Photo (optional)" value={editItem?.imageUrl ?? undefined} onChange={setImageFile} aspectRatio="4/3" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...itemForm.register('name')} placeholder="Name *" className={inputCls} />
              {itemForm.formState.errors.name && <p className="text-red-400 text-xs mt-1">{itemForm.formState.errors.name.message}</p>}
            </div>
            <input {...itemForm.register('nameAr')} placeholder="Arabic name" className={inputCls} />
          </div>
          <textarea {...itemForm.register('description')} placeholder="Description" rows={2} className={`${inputCls} resize-none`} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...itemForm.register('price')} type="number" placeholder="Price (EGP) *" className={inputCls} />
              {itemForm.formState.errors.price && <p className="text-red-400 text-xs mt-1">{itemForm.formState.errors.price.message}</p>}
            </div>
            <div>
              <select {...itemForm.register('categoryId')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {itemForm.formState.errors.categoryId && <p className="text-red-400 text-xs mt-1">{itemForm.formState.errors.categoryId.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setItemModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={savingItem} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {savingItem ? 'Saving…' : editItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category modal */}
      <Modal
        open={catModalOpen}
        onClose={() => { setCatModalOpen(false); catForm.reset(); setEditCat(null) }}
        title={editCat ? 'Rename Category' : 'Add Category'}
        size="sm"
      >
        <form onSubmit={catForm.handleSubmit(onSubmitCat)} className="space-y-4">
          <div>
            <input {...catForm.register('name')} placeholder="Category name *" className={inputCls} autoFocus />
            {catForm.formState.errors.name && <p className="text-red-400 text-xs mt-1">{catForm.formState.errors.name.message}</p>}
          </div>
          <input {...catForm.register('nameAr')} placeholder="Arabic name (optional)" className={inputCls} />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCatModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={savingCat} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {savingCat ? 'Saving…' : editCat ? 'Rename' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm item delete */}
      <ConfirmDialog
        open={!!deleteItemTarget} onClose={() => setDeleteItemTarget(null)} onConfirm={deleteMenuItem}
        title="Delete item" message="Delete this menu item? This cannot be undone."
        confirmLabel="Delete" danger loading={deletingItem}
      />

      {/* Confirm category delete */}
      <ConfirmDialog
        open={!!deleteCatTarget} onClose={() => setDeleteCatTarget(null)} onConfirm={deleteCategory}
        title="Delete category"
        message="This will delete the category and ALL its items permanently. Move items to another category first if you want to keep them."
        confirmLabel="Delete Category" danger loading={deletingCat}
      />
    </div>
  )
}
