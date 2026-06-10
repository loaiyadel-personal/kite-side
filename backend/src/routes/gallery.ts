import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
// TODO: import controllers
const router = Router()
// Public read routes
router.get('/', (_req, res) => res.json({ message: 'gallery route — implement controllers' }))
// Protected write routes
router.post('/', requireAuth, (_req, res) => res.json({ message: 'create gallery' }))
router.put('/:id', requireAuth, (_req, res) => res.json({ message: 'update gallery' }))
router.delete('/:id', requireAuth, (_req, res) => res.json({ message: 'delete gallery' }))
export default router
