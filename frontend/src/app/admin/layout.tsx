'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/lib/auth/AdminAuthContext'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopBar from '@/components/admin/layout/AdminTopBar'

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    if (!isLoading && !isAuthenticated) router.replace('/admin/login')
  }, [isLoading, isAuthenticated, router, isLoginPage])

  if (isLoginPage) return <>{children}</>

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0b1622] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-[#0b1622] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0b1622]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  )
}
