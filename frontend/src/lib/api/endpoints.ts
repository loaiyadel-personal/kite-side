import api from './client'
import type { ContactFormData } from '@/types'

// ── Shop
export const shopApi = {
  getAll:      (params?: { category?: string }) => api.get('/shop', { params }),
  getAdminAll: () => api.get('/shop'),
  create:      (formData: FormData) =>
    api.post('/shop', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id: string, formData: FormData) =>
    api.put(`/shop/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:      (id: string) => api.put(`/shop/${id}/toggle`),
  reorder:     (items: { id: string; sortOrder: number }[]) => api.put('/shop/reorder', { items }),
  delete:      (id: string) => api.delete(`/shop/${id}`),
}

// ── Gallery — public
export const galleryApi = {
  getAll:      (params?: { type?: string; category?: string }) => api.get('/gallery', { params }),
  getCategories: () => api.get('/gallery/categories'),

  // Admin
  getAdminAll:   () => api.get('/gallery/admin'),
  upload:        (formData: FormData) =>
    api.post('/gallery/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadVideo:   (data: { url: string; thumbnailUrl?: string; caption?: string; altText?: string; category?: string; sortOrder?: number }) =>
    api.post('/gallery/video', data),
  update:        (id: string, data: { caption?: string; altText?: string; category?: string; sortOrder?: number; isPublished?: boolean; url?: string }) =>
    api.put(`/gallery/${id}`, data),
  togglePublish: (id: string) => api.put(`/gallery/${id}/publish`),
  reorder:       (items: { id: string; sortOrder: number }[]) => api.put('/gallery/reorder', { items }),
  delete:        (id: string) => api.delete(`/gallery/${id}`),
}

// ── Menu — public
export const menuApi = {
  getAll: () => api.get('/menu'),
  getCategories: () => api.get('/menu/categories'),

  // ── Admin menu management (used in Epic 6 admin panel)
  createCategory: (data: { name: string; nameAr?: string; sortOrder?: number }) =>
    api.post('/menu/categories', data),
  updateCategory: (id: string, data: { name?: string; nameAr?: string; sortOrder?: number }) =>
    api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id: string) =>
    api.delete(`/menu/categories/${id}`),
  createItem: (formData: FormData) =>
    api.post('/menu/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateItem: (id: string, formData: FormData) =>
    api.put(`/menu/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleAvailability: (id: string) =>
    api.put(`/menu/items/${id}/availability`),
  deleteItem: (id: string) =>
    api.delete(`/menu/items/${id}`),
  reorder: (items: { id: string; sortOrder: number }[]) =>
    api.put('/menu/reorder', { items }),
}

// ── Courses
export const coursesApi = {
  getAll: () => api.get('/courses'),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  togglePublish: (id: string) => api.put(`/courses/${id}/publish`),
  delete: (id: string) => api.delete(`/courses/${id}`),
  submitInquiry: (data: any) => api.post('/courses/inquiry', data),
  getInquiries: (params?: { status?: string }) => api.get('/courses/inquiries', { params }),
  updateInquiryStatus: (id: string, status: string) =>
    api.put(`/courses/inquiries/${id}/status`, { status }),
}

// ── Pricing
export const pricingApi = {
  getAll:  (category?: string) =>
    api.get('/pricing', { params: category ? { category } : undefined }),
  create:  (data: any) => api.post('/pricing', data),
  update:  (id: string, data: any) => api.put(`/pricing/${id}`, data),
  toggle:  (id: string) => api.put(`/pricing/${id}/toggle`),
  delete:  (id: string) => api.delete(`/pricing/${id}`),
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
