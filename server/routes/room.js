import express from 'express'
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js'

const router = express.Router()
// /api/rooms/...
router.get('/', getRooms)
router.get('/:id', getRoomById)
router.post('/', createRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router 
