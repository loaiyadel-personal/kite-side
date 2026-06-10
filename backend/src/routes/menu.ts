import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
// TODO: import controllers
const router = Router()
// Public read routes
router.get('/', (_req, res) => res.json({ message: 'menu route — implement controllers' }))
// Protected write routes
router.post('/', requireAuth, (_req, res) => res.json({ message: 'create menu' }))
router.put('/:id', requireAuth, (_req, res) => res.json({ message: 'update menu' }))
router.delete('/:id', requireAuth, (_req, res) => res.json({ message: 'delete menu' }))
export default router
