import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getMenu, getCategories,
  createCategory, updateCategory, deleteCategory,
  createItem, updateItem, toggleAvailability, deleteItem, reorderItems,
  upload,
} from '../controllers/menuController'

const router = Router()

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', getMenu)
router.get('/categories', getCategories)

// ── Admin — categories ────────────────────────────────────────────────────────
router.post('/categories',      requireAuth, createCategory)
router.put('/categories/:id',   requireAuth, updateCategory)
router.delete('/categories/:id',requireAuth, deleteCategory)

// ── Admin — items ─────────────────────────────────────────────────────────────
router.post('/items',                requireAuth, upload.single('image'), createItem)
router.put('/items/:id',             requireAuth, upload.single('image'), updateItem)
router.put('/items/:id/availability',requireAuth, toggleAvailability)
router.delete('/items/:id',          requireAuth, deleteItem)
router.put('/reorder',               requireAuth, reorderItems)

export default router
