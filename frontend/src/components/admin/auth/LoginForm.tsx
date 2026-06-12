'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminAuth } from '@/lib/auth/AdminAuthContext'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAdminAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      await login(data.username, data.password)
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm text-white/60 mb-1.5">Username</label>
        <input
          {...register('username')}
          autoComplete="username"
          className="w-full bg-white/5 border border-white/10 focus:border-[#1a9fd4]/60 rounded-lg px-4 py-2.5 text-white placeholder-white/20 text-sm outline-none transition-colors"
          placeholder="your_username"
        />
        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1.5">Password</label>
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          className="w-full bg-white/5 border border-white/10 focus:border-[#1a9fd4]/60 rounded-lg px-4 py-2.5 text-white placeholder-white/20 text-sm outline-none transition-colors"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}
        className="w-full bg-[#1a9fd4] hover:bg-[#158bbf] disabled:bg-[#1a9fd4]/50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
