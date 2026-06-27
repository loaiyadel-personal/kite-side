import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const isDev = process.env.NODE_ENV !== 'production'
  console.error(err)
  res.status(500).json({
    error: isDev ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
}
