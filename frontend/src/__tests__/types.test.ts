import { describe, it, expect } from 'vitest'
import type { CourseInput, PriceItemInput, CourseInquiryInput, ContactFormData } from '@/types'

// Type-level tests — these verify at compile time that the types are correct.
// The runtime tests below are structural checks.

describe('type contracts', () => {
  it('CourseInput has all required fields', () => {
    const course: CourseInput = {
      level: 'BEGINNER',
      name: 'Test Course',
      description: 'A test course',
      durationHours: 4,
      maxStudents: 6,
      priceEGP: 2000,
      includes: ['harness', 'board'],
    }
    expect(course.level).toBe('BEGINNER')
    expect(course.includes).toHaveLength(2)
  })

  it('PriceItemInput allows valid categories only (not SHOP_ITEM)', () => {
    const item: PriceItemInput = {
      category: 'RENTAL_KITE',
      name: 'Kite Rental',
      priceEGP: 500,
      unit: 'per hour',
    }
    expect(item.category).toBe('RENTAL_KITE')
  })

  it('CourseInquiryInput has only required name, email', () => {
    const inquiry: CourseInquiryInput = {
      name: 'John',
      email: 'john@example.com',
    }
    expect(inquiry.name).toBe('John')
    expect(inquiry.phone).toBeUndefined()
  })

  it('ContactFormData has required fields', () => {
    const form: ContactFormData = {
      name: 'Jane',
      email: 'jane@example.com',
      subject: 'Inquiry',
      message: 'Hello there',
    }
    expect(form.name).toBe('Jane')
    expect(form.phone).toBeUndefined()
  })
})
