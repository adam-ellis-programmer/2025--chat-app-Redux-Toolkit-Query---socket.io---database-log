import express from 'express'
import {
  getMessages,
  getMessagesByRoom,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js'
import { checkIsAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// /api/messages/...
router.get('/', getMessages)
router.get('/room/:roomId', getMessagesByRoom)
router.post('/create', createMessage)
router.put('/:id', updateMessage)
router.delete('/:id', deleteMessage)

export default router
