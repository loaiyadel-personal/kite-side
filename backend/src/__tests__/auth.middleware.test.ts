import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Must set JWT_SECRET before importing the middleware
process.env.JWT_SECRET = 'test-secret-for-unit-tests'

import { requireAuth, requireSuperAdmin, tokenBlocklist, AuthRequest } from '../middleware/auth'

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json:   vi.fn().mockReturnThis(),
  }
  return res as unknown as Response
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction
}

describe('requireAuth middleware', () => {
  beforeEach(() => {
    tokenBlocklist.clear()
  })

  it('returns 401 when no Authorization header is present', () => {
    const req = { headers: {} } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is malformed', () => {
    const req = { headers: { authorization: 'Bearer not.a.real.token' } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is expired', () => {
    const expired = jwt.sign(
      { id: '1', username: 'admin', role: 'EDITOR' },
      'test-secret-for-unit-tests',
      { expiresIn: -1 }
    )
    const req = { headers: { authorization: `Bearer ${expired}` } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is in the blocklist', () => {
    const token = jwt.sign(
      { id: '1', username: 'admin', role: 'EDITOR' },
      'test-secret-for-unit-tests',
      { expiresIn: '1h' }
    )
    tokenBlocklist.add(token)

    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token has been revoked' })
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() and attaches admin to request for a valid token', () => {
    const payload = { id: 'abc123', username: 'testadmin', role: 'SUPER_ADMIN' }
    const token = jwt.sign(payload, 'test-secret-for-unit-tests', { expiresIn: '1h' })

    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireAuth(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.admin?.id).toBe('abc123')
    expect(req.admin?.username).toBe('testadmin')
    expect(req.admin?.role).toBe('SUPER_ADMIN')
  })
})

describe('requireSuperAdmin middleware', () => {
  it('returns 403 if admin role is EDITOR', () => {
    const req = { admin: { id: '1', username: 'ed', role: 'EDITOR' } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireSuperAdmin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() if admin role is SUPER_ADMIN', () => {
    const req = { admin: { id: '1', username: 'su', role: 'SUPER_ADMIN' } } as AuthRequest
    const res = mockRes()
    const next = mockNext()

    requireSuperAdmin(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
