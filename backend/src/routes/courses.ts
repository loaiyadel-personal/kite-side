import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getCourses, getCourse, submitInquiry,
  createCourse, updateCourse, togglePublish, deleteCourse,
  getInquiries, updateInquiryStatus,
} from '../controllers/coursesController'

const router = Router()

// Public
router.get('/', getCourses)
router.get('/inquiries', requireAuth, getInquiries)
router.get('/:id', getCourse)
router.post('/inquiry', submitInquiry)

// Admin
router.post('/', requireAuth, createCourse)
router.put('/:id', requireAuth, updateCourse)
router.put('/:id/publish', requireAuth, togglePublish)
router.put('/inquiries/:id/status', requireAuth, updateInquiryStatus)
router.delete('/:id', requireAuth, deleteCourse)

export default router
