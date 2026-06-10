import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
// TODO: import controllers
const router = Router()
// Public read routes
router.get('/', (_req, res) => res.json({ message: 'pricing route — implement controllers' }))
// Protected write routes
router.post('/', requireAuth, (_req, res) => res.json({ message: 'create pricing' }))
router.put('/:id', requireAuth, (_req, res) => res.json({ message: 'update pricing' }))
router.delete('/:id', requireAuth, (_req, res) => res.json({ message: 'delete pricing' }))
export default router
