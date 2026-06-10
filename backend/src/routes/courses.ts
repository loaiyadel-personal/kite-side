import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
// TODO: import controllers
const router = Router()
// Public read routes
router.get('/', (_req, res) => res.json({ message: 'courses route — implement controllers' }))
// Protected write routes
router.post('/', requireAuth, (_req, res) => res.json({ message: 'create courses' }))
router.put('/:id', requireAuth, (_req, res) => res.json({ message: 'update courses' }))
router.delete('/:id', requireAuth, (_req, res) => res.json({ message: 'delete courses' }))
export default router
