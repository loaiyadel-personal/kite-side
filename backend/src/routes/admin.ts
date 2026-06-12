import { Router } from 'express'
import { requireAuth, requireSuperAdmin } from '../middleware/auth'
import {
  getUsers, createUser, updateUser, resetUserPassword, deleteUser,
  getSettings, updateSettings,
} from '../controllers/adminController'

const router = Router()

// All admin routes require auth
router.use(requireAuth)

// Settings — read any admin, write SUPER_ADMIN only
router.get('/settings', getSettings)
router.put('/settings', requireSuperAdmin, updateSettings)

// User management — SUPER_ADMIN only
router.get('/users',                      requireSuperAdmin, getUsers)
router.post('/users',                     requireSuperAdmin, createUser)
router.put('/users/:id',                  requireSuperAdmin, updateUser)
router.put('/users/:id/reset-password',   requireSuperAdmin, resetUserPassword)
router.delete('/users/:id',               requireSuperAdmin, deleteUser)

export default router
