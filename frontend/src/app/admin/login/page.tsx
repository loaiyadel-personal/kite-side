import { Metadata } from 'next'
import Image from 'next/image'
import LoginForm from '@/components/admin/auth/LoginForm'

export const metadata: Metadata = { title: 'Admin Login — Kite Side' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.jpg" alt="Kite Side" width={72} height={72} className="rounded-2xl object-cover shadow-lg" />
          </div>
          <h1 className="font-outfit font-bold text-white text-2xl">Kite Side Admin</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your site</p>
        </div>
        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-7 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
