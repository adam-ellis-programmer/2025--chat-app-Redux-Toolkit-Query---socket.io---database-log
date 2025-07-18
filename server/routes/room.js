import express from 'express'
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js'
import {
  authenticateToken,
  checkIsAdmin,
} from '../middleware/authMiddleware.js'
import { check } from 'express-validator'

const router = express.Router()
// /api/rooms/...
router.get('/', authenticateToken, checkIsAdmin, getRooms) // --- add checkIsAdmin here
router.get('/:id', getRoomById)
router.post('/', createRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router
