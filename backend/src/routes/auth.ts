import { Router } from 'express'
import { login, logout, me, changePassword } from '../controllers/authController'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post('/login',    login)
router.post('/logout',   requireAuth, logout)
router.get('/me',        requireAuth, me)
router.put('/password',  requireAuth, changePassword)

export default router
