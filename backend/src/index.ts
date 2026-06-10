import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

import authRoutes from './routes/auth'
import galleryRoutes from './routes/gallery'
import menuRoutes from './routes/menu'
import coursesRoutes from './routes/courses'
import pricingRoutes from './routes/pricing'
import contactRoutes from './routes/contact'
import analyticsRoutes from './routes/analytics'
import adminRoutes from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 4000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// Rate limiting
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🪁 Kite Side API running on http://localhost:${PORT}`)
})

export default app
