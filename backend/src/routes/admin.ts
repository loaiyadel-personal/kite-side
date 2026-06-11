import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
// TODO: import controllers
const router = Router()
// All admin routes are protected
router.get('/', requireAuth, (_req, res) => res.json({ message: 'admin route — implement controllers' }))
// Protected write routes
router.post('/', requireAuth, (_req, res) => res.json({ message: 'create admin' }))
router.put('/:id', requireAuth, (_req, res) => res.json({ message: 'update admin' }))
router.delete('/:id', requireAuth, (_req, res) => res.json({ message: 'delete admin' }))
export default router
