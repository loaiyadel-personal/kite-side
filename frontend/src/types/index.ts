// ── API shared types ──────────────────────────────────────────────────────────

export type CourseLevel = 'DISCOVERY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'IKO_CERTIFICATION' | 'INSTRUCTOR'
export type InquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'
export type GalleryItemType = 'PHOTO' | 'VIDEO'
export type PriceCategory = 'RENTAL_KITE' | 'RENTAL_BOARD' | 'RENTAL_HARNESS' | 'RENTAL_WETSUIT' | 'RENTAL_FULL_GEAR' | 'BEACH_USE' | 'SHOP_ITEM'
export type AdminRole = 'SUPER_ADMIN' | 'EDITOR'

export interface GalleryItem {
  id: string
  type: GalleryItemType
  url: string
  thumbnailUrl?: string
  caption?: string
  altText?: string
  category?: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
}

export interface MenuCategory {
  id: string
  name: string
  nameAr?: string
  sortOrder: number
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  nameAr?: string
  description?: string
  price: number
  imageUrl?: string
  tags: string[]
  isAvailable: boolean
  sortOrder: number
}

export interface Course {
  id: string
  level: CourseLevel
  name: string
  description: string
  durationHours: number
  maxStudents: number
  priceEGP: number
  priceUSD?: number
  includes: string[]
  isPublished: boolean
}

export interface PriceItem {
  id: string
  category: PriceCategory
  name: string
  description?: string
  priceEGP: number
  priceUSD?: number
  unit: string
  isActive: boolean
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactSubmission extends ContactFormData {
  id: string
  status: InquiryStatus
  repliedAt?: string
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  isActive: boolean
  lastLoginAt?: string
}

export interface WindData {
  speed: number       // knots
  direction: number   // degrees
  gusts: number
  description: string
  updatedAt: string
}

export interface CourseInput {
  level: CourseLevel
  name: string
  description: string
  outcome?: string
  durationHours: number
  maxStudents: number
  priceEGP: number
  priceUSD?: number
  includes: string[]
  isPublished?: boolean
  sortOrder?: number
}

export interface PriceItemInput {
  category: Exclude<PriceCategory, 'SHOP_ITEM'>
  name: string
  description?: string
  priceEGP: number
  priceUSD?: number
  unit: string
  isHighlighted?: boolean
  sortOrder?: number
}

export interface CourseInquiryInput {
  name: string
  email: string
  phone?: string
  courseId?: string
  level?: string
  preferredDates?: string
  howHeard?: string
  message?: string
}

export interface AnalyticsDashboard {
  totalViews: number
  uniqueSessions: number
  topPages: Array<{ path: string; _count: { path: number } }>
  deviceBreakdown: Array<{ deviceType: string; _count: { deviceType: number } }>
  dailyViews: Array<{ date: string; views: number }>
  contactCount: number
  days: number
}
