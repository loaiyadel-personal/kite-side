import api from './client'
import type { ContactFormData } from '@/types'

// ── Gallery
export const galleryApi = {
  getAll: (params?: { type?: string; category?: string }) => api.get('/gallery', { params }),
}

// ── Menu
export const menuApi = {
  getAll: () => api.get('/menu'),
  getCategories: () => api.get('/menu/categories'),
}

// ── Courses
export const coursesApi = {
  getAll: () => api.get('/courses'),
  submitInquiry: (data: any) => api.post('/courses/inquiry', data),
}

// ── Pricing
export const pricingApi = {
  getAll: () => api.get('/pricing'),
  getByCategory: (category: string) => api.get(`/pricing?category=${category}`),
}

// ── Contact
export const contactApi = {
  submit: (data: ContactFormData) => api.post('/contact', data),
  // admin
  getAll: (params?: { status?: string; page?: number }) => api.get('/contact', { params }),
  updateStatus: (id: string, status: string) => api.put(`/contact/${id}/status`, { status }),
  reply: (id: string, replyText: string) => api.post(`/contact/${id}/reply`, { replyText }),
}

// ── Analytics
export const analyticsApi = {
  track: (path: string, sessionId: string, referrer?: string) =>
    api.post('/analytics/track', { path, sessionId, referrer }),
  getDashboard: (days: number = 30) => api.get(`/analytics/dashboard?days=${days}`),
}

// ── Admin auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
}
