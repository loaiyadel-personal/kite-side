import { Router } from 'express'
import { submitContact, getSubmissions, replyToSubmission, updateStatus } from '../controllers/contactController'
import { requireAuth } from '../middleware/auth'

const router = Router()
router.post('/', submitContact)                              // public
router.get('/', requireAuth, getSubmissions)                 // admin
router.put('/:id/status', requireAuth, updateStatus)        // admin
router.post('/:id/reply', requireAuth, replyToSubmission)   // admin
export default router
