import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getPricing, createPriceItem, updatePriceItem,
  togglePriceItem, deletePriceItem,
} from '../controllers/pricingController'

const router = Router()

// Public
router.get('/', getPricing)

// Admin
router.post('/', requireAuth, createPriceItem)
router.put('/:id', requireAuth, updatePriceItem)
router.put('/:id/toggle', requireAuth, togglePriceItem)
router.delete('/:id', requireAuth, deletePriceItem)

export default router
