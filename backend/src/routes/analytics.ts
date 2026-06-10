import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { trackPageView, getDashboardStats } from '../controllers/analyticsController'

const router = Router()
router.post('/track', trackPageView)             // public — called by frontend
router.get('/dashboard', requireAuth, getDashboardStats)  // admin only
export default router
