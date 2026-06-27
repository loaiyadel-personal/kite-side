import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  admin?: { id: string; username: string; role: string }
}

// In-memory token blocklist — clears on server restart (acceptable per spec)
export const tokenBlocklist = new Set<string>()

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  if (tokenBlocklist.has(token)) return res.status(401).json({ error: 'Token has been revoked' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest['admin']
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.admin?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Super admin access required' })
  }
  next()
}
