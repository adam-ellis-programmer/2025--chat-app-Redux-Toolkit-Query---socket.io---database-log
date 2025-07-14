// Get all rooms
import Room from '../models/Room.js'
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({})
    res.json(rooms)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params
    // Your logic here
    res.json({ message: `Get room ${id}` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create new room
export const createRoom = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Room created' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params
    // Your logic here
    res.json({ message: `Room ${id} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params
    // Your logic here
    res.json({ message: `Room ${id} deleted` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
