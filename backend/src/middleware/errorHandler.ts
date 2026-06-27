import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err }, err.message)
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(500).json({
    error: isDev ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
}
