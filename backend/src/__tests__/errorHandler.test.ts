import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../middleware/errorHandler'

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json:   vi.fn().mockReturnThis(),
  } as unknown as Response
}

describe('errorHandler middleware', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    delete process.env.NODE_ENV
  })

  it('responds with 500 and INTERNAL_ERROR code', () => {
    const err = new Error('Something exploded')
    const res = mockRes()

    errorHandler(err, {} as Request, res, vi.fn() as unknown as NextFunction)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'INTERNAL_ERROR' })
    )
  })

  it('hides error message in production', () => {
    process.env.NODE_ENV = 'production'
    const err = new Error('DB password exposed')
    const res = mockRes()

    errorHandler(err, {} as Request, res, vi.fn() as unknown as NextFunction)

    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(body.error).toBe('Internal server error')
    expect(body.error).not.toContain('DB password')
  })

  it('shows error message in non-production', () => {
    process.env.NODE_ENV = 'development'
    const err = new Error('Detailed debug info')
    const res = mockRes()

    errorHandler(err, {} as Request, res, vi.fn() as unknown as NextFunction)

    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(body.error).toBe('Detailed debug info')
  })
})
