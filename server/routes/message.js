import express from 'express'
import {
  getMessages,
  getMessagesByRoom,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js'

const router = express.Router()

// /api/messages/...
router.get('/', getMessages)
router.get('/room/:roomId', getMessagesByRoom)
router.post('/', createMessage)
router.put('/:id', updateMessage)
router.delete('/:id', deleteMessage)

export default router
