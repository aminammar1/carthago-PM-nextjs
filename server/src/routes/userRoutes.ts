import express from 'express'
import {
  getAllUsers,
  getAuthenticatedUser,
  updateUser,
} from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.post('/authenticated', authMiddleware, getAuthenticatedUser)
router.get('/', authMiddleware, getAllUsers)
router.patch('/:userId', authMiddleware, updateUser)

export default router
