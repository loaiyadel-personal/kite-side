import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getGallery,
  getCategories,
  getAdminGallery,
  createPhoto,
  createVideo,
  updateGalleryItem,
  togglePublish,
  reorderGallery,
  deleteGalleryItem,
  uploadMiddleware,
} from '../controllers/galleryController'

const router = Router()

// Public
router.get('/categories', getCategories)
router.get('/', getGallery)

// Admin — /admin and /reorder declared before /:id to avoid param capture
router.get('/admin',       requireAuth, getAdminGallery)
router.post('/photo',      requireAuth, uploadMiddleware, createPhoto)
router.post('/video',      requireAuth, createVideo)
router.put('/reorder',     requireAuth, reorderGallery)
router.put('/:id/publish', requireAuth, togglePublish)
router.put('/:id',         requireAuth, updateGalleryItem)
router.delete('/:id',      requireAuth, deleteGalleryItem)

export default router
