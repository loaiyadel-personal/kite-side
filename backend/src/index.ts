import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
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
import shopRoutes from './routes/shop'
import contactRoutes from './routes/contact'
import analyticsRoutes from './routes/analytics'
import adminRoutes from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 4000

const allowedOrigins = [
  'http://localhost:3000',
  process.env.PRODUCTION_URL,
].filter(Boolean) as string[]

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(mongoSanitize())
app.use(hpp())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// Global rate limit — all routes
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }))

// Tighter limits on sensitive endpoints
app.use('/api/contact', rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
app.use('/api/auth/login', rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many login attempts. Try again in an hour.' } }))
app.use('/api/courses/inquiry', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/shop', shopRoutes)
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
