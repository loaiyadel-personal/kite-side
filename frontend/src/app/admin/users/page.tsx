'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'
import PageHeader from '@/components/admin/ui/PageHeader'
import Modal from '@/components/admin/ui/Modal'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import EmptyState from '@/components/admin/ui/EmptyState'
import PasswordStrength from '@/components/admin/ui/PasswordStrength'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface AdminUserRecord {
  id:                  string
  username:            string
  name:                string
  email?:              string
  role:                'SUPER_ADMIN' | 'EDITOR'
  isActive:            boolean
  lastLoginAt?:        string
  failedLoginAttempts: number
  lockedUntil?:        string
}

const createSchema = z.object({
  username: z.string().min(3, 'Min 3 chars').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  name:     z.string().min(1, 'Name required'),
  email:    z.string().email('Invalid email').optional().or(z.literal('')),
  role:     z.enum(['SUPER_ADMIN', 'EDITOR']),
  password: z.string().min(8, 'Min 8 chars').regex(/^(?=.*[A-Z])(?=.*\d)/, 'Must have uppercase + number'),
})
const editSchema = z.object({
  name:     z.string().min(1, 'Name required'),
  email:    z.string().email('Invalid email').optional().or(z.literal('')),
  role:     z.enum(['SUPER_ADMIN', 'EDITOR']),
  isActive: z.boolean(),
})
type CreateForm = z.infer<typeof createSchema>
type EditForm   = z.infer<typeof editSchema>

export default function UsersPage() {
  const { token, isSuperAdmin, admin: self } = useAdminAuth()
  const [users, setUsers]           = useState<AdminUserRecord[]>([])
  const [loading, setLoading]       = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [watchPw, setWatchPw]       = useState('')

  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema) })
  const editForm   = useForm<EditForm>({ resolver: zodResolver(editSchema) })

  const fetchUsers = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }, [token])

  useEffect(() => { if (isSuperAdmin) fetchUsers() }, [isSuperAdmin, fetchUsers])

  async function onCreateSubmit(data: CreateForm) {
    if (!token) return
    setSaving(true)
    const res = await fetch(`${API}/admin/users`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...data, email: data.email || undefined }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('User created')
      setCreateOpen(false)
      createForm.reset()
      setWatchPw('')
      fetchUsers()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to create user')
    }
  }

  async function onEditSubmit(data: EditForm) {
    if (!token || !editTarget) return
    setSaving(true)
    const res = await fetch(`${API}/admin/users/${editTarget.id}`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...data, email: data.email || undefined }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Updated')
      setEditTarget(null)
      editForm.reset()
      fetchUsers()
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Update failed')
    }
  }

  async function resetPassword(userId: string) {
    if (!token) return
    const res = await fetch(`${API}/admin/users/${userId}/reset-password`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const { temporaryPassword } = await res.json()
      setTempPassword(temporaryPassword)
      toast.success('Password reset')
    } else toast.error('Reset failed')
  }

  async function deleteUser() {
    if (!token || !deleteTarget) return
    setDeleting(true)
    const res = await fetch(`${API}/admin/users/${deleteTarget}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    if (res.ok) {
      toast.success('Deleted')
      setUsers(prev => prev.filter(u => u.id !== deleteTarget))
      setDeleteTarget(null)
    } else {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Delete failed')
    }
  }

  if (!isSuperAdmin) {
    return <div className="flex items-center justify-center py-20"><p className="text-white/30">Super Admin access required</p></div>
  }

  return (
    <div>
      <PageHeader title="User Management" subtitle={`${users.length} admins`}
        action={
          <button onClick={() => { createForm.reset(); setWatchPw(''); setCreateOpen(true) }}
            className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg transition-colors">
            + Add User
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#1a9fd4] border-t-transparent rounded-full animate-spin" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users" message="Create the first admin user" />
      ) : (
        <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white/80 font-medium">{u.name}</p>
                    <p className="text-white/30 text-xs">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    {u.lockedUntil && new Date(u.lockedUntil) > new Date() && (
                      <p className="text-red-400 text-xs mt-0.5">Locked</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">
                    {u.lastLoginAt ? format(new Date(u.lastLoginAt), 'MMM d, HH:mm') : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        editForm.reset({ name: u.name, email: u.email ?? '', role: u.role, isActive: u.isActive })
                        setEditTarget(u)
                      }} className="text-white/30 hover:text-white/70 transition-colors text-xs px-2 py-1 border border-white/10 rounded">
                        Edit
                      </button>
                      {u.id !== self?.id && (
                        <>
                          <button onClick={() => resetPassword(u.id)} className="text-white/30 hover:text-yellow-400 transition-colors text-xs px-2 py-1 border border-white/10 rounded">
                            Reset PW
                          </button>
                          <button onClick={() => setDeleteTarget(u.id)} className="text-white/20 hover:text-red-400 transition-colors text-xs px-2 py-1 border border-white/10 rounded">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create user modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); createForm.reset(); setWatchPw('') }} title="Add Admin User">
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...createForm.register('username')} placeholder="Username *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {createForm.formState.errors.username && <p className="text-red-400 text-xs mt-1">{createForm.formState.errors.username.message}</p>}
            </div>
            <div>
              <input {...createForm.register('name')} placeholder="Display name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
              {createForm.formState.errors.name && <p className="text-red-400 text-xs mt-1">{createForm.formState.errors.name.message}</p>}
            </div>
          </div>
          <input {...createForm.register('email')} type="email" placeholder="Email (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
          <select {...createForm.register('role')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
            <option value="EDITOR">Editor</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <div>
            <input {...createForm.register('password')} type="password" placeholder="Password *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20"
              onChange={e => { createForm.setValue('password', e.target.value); setWatchPw(e.target.value) }} />
            {createForm.formState.errors.password && <p className="text-red-400 text-xs mt-1">{createForm.formState.errors.password.message}</p>}
            <PasswordStrength password={watchPw} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit user modal */}
      {editTarget && (
        <Modal open={!!editTarget} onClose={() => { setEditTarget(null); editForm.reset() }} title={`Edit ${editTarget.name}`}>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <input {...editForm.register('name')} placeholder="Display name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            {editForm.formState.errors.name && <p className="text-red-400 text-xs mt-1">{editForm.formState.errors.name.message}</p>}
            <input {...editForm.register('email')} type="email" placeholder="Email (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors placeholder-white/20" />
            <div className="grid grid-cols-2 gap-3">
              <select {...editForm.register('role')} className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#1a9fd4]/60 transition-colors">
                <option value="EDITOR">Editor</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg cursor-pointer">
                <input type="checkbox" {...editForm.register('isActive')} className="w-4 h-4 rounded accent-[#1a9fd4]" />
                <span className="text-white/60 text-sm">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-[#1a9fd4] hover:bg-[#158bbf] text-white rounded-lg disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Temp password modal */}
      <Modal open={!!tempPassword} onClose={() => setTempPassword(null)} title="Temporary Password" size="sm">
        <p className="text-white/60 text-sm mb-3">Share this password securely. It will only be shown once.</p>
        <div className="bg-[#0f172a] rounded-lg px-4 py-3 font-mono text-[#1a9fd4] text-lg tracking-widest text-center select-all mb-4">
          {tempPassword}
        </div>
        <button onClick={() => { navigator.clipboard.writeText(tempPassword ?? ''); toast.success('Copied') }}
          className="w-full py-2 bg-[#1a9fd4] hover:bg-[#158bbf] text-white text-sm rounded-lg transition-colors">
          Copy to Clipboard
        </button>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteUser}
        title="Delete user" message="Permanently delete this admin account? They will lose all access immediately."
        confirmLabel="Delete" danger loading={deleting}
      />
    </div>
  )
}
