import Message from "../models/Message"

// Similar structure for message controller
export const getMessages = async (req, res) => {
  try {
    res.json({ message: 'Get all messages' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params
    const messages = await Message.find({ roomId }).populate('userId', 'username')
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createMessage = async (req, res) => {
  try {
    res.json({ message: 'Message created' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params
    res.json({ message: `Message ${id} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params
    res.json({ message: `Message ${id} deleted` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
