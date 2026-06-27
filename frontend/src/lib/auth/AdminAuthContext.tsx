'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface AdminUser {
  id:          string
  username:    string
  name:        string
  role:        'SUPER_ADMIN' | 'EDITOR'
  lastLoginAt: string | null
}

interface AuthContextValue {
  admin:           AdminUser | null
  token:           string | null
  isLoading:       boolean
  isAuthenticated: boolean
  isSuperAdmin:    boolean
  login:           (username: string, password: string) => Promise<AdminUser>
  logout:          () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'ks_admin_token'
const API       = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

function setAuthCookie(token: string) {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`
}
function clearAuthCookie() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin,     setAdmin]     = useState<AdminUser | null>(null)
  const [token,     setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const clearSession = useCallback(() => {
    setAdmin(null)
    setToken(null)
    sessionStorage.removeItem(TOKEN_KEY)
    clearAuthCookie()
  }, [])

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY)
    if (!stored) { setIsLoading(false); return }

    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then(r => {
        if (!r.ok) throw new Error('invalid')
        return r.json()
      })
      .then((data: AdminUser) => {
        setAdmin(data)
        setToken(stored)
        setAuthCookie(stored)
      })
      .catch(() => {
        clearSession()
        router.replace('/admin/login')
      })
      .finally(() => setIsLoading(false))
  }, [clearSession, router])

  const login = useCallback(async (username: string, password: string): Promise<AdminUser> => {
    const res = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Server error. Please try again.')
    }
    const { token: t, admin: a } = await res.json()
    sessionStorage.setItem(TOKEN_KEY, t)
    setAuthCookie(t)
    setToken(t)
    setAdmin(a)
    return a
  }, [])

  const logout = useCallback(async () => {
    if (token) {
      await fetch(`${API}/auth/logout`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    clearSession()
    router.push('/admin/login')
  }, [token, clearSession, router])

  return (
    <AuthContext.Provider value={{
      admin, token, isLoading,
      isAuthenticated: !!admin,
      isSuperAdmin:    admin?.role === 'SUPER_ADMIN',
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
