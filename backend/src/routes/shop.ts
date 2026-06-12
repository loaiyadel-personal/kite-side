import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getShopItems,
  createShopItem,
  updateShopItem,
  toggleShopItem,
  reorderShopItems,
  deleteShopItem,
  uploadMiddleware,
} from '../controllers/shopController'

const router = Router()

// Public
router.get('/', getShopItems)

// Admin — /reorder before /:id to avoid param capture
router.put('/reorder',    requireAuth, reorderShopItems)
router.post('/',          requireAuth, uploadMiddleware, createShopItem)
router.put('/:id/toggle', requireAuth, toggleShopItem)
router.put('/:id',        requireAuth, uploadMiddleware, updateShopItem)
router.delete('/:id',     requireAuth, deleteShopItem)

export default router
