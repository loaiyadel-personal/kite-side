import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useAdminAuth, AdminAuthProvider } from '@/lib/auth/AdminAuthContext'

// Stub sessionStorage for tests
const sessionStorageStore: Record<string, string> = {}
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem:    (k: string) => sessionStorageStore[k] ?? null,
    setItem:    (k: string, v: string) => { sessionStorageStore[k] = v },
    removeItem: (k: string) => { delete sessionStorageStore[k] },
    clear:      () => { Object.keys(sessionStorageStore).forEach(k => delete sessionStorageStore[k]) },
  },
  writable: true,
})


// Stub next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))

// Stub global fetch — returns 401 (no stored token → no /me call)
global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })

function TestConsumer() {
  const auth = useAdminAuth()
  return (
    <div>
      <span data-testid="loading">{String(auth.isLoading)}</span>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
    </div>
  )
}

describe('AdminAuthProvider', () => {
  beforeEach(() => {
    sessionStorageStore['ks_admin_token'] && delete sessionStorageStore['ks_admin_token']
  })

  it('renders children and exposes auth context', async () => {
    render(
      <AdminAuthProvider>
        <TestConsumer />
      </AdminAuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('throws when useAdminAuth is used outside provider', () => {
    // Suppress React error boundary noise
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow()
    errSpy.mockRestore()
  })
})
