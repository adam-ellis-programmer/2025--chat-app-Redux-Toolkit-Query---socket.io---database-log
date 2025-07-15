// controllers/roomController.js - REPLACE your current getRooms function
import Room from '../models/Room.js'

// Enhanced getRooms - replaces your current simple version
export const getRooms = async (req, res) => {
  try {
    const { search, includeStats } = req.query
    let query = { isActive: true }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { roomId: { $regex: search, $options: 'i' } },
      ]
    }

    // After population - IDs replaced with full user objects
    let roomsQuery = Room.find(query)
      .populate(
        'createdBy',
        'username email profile.firstName profile.lastName'
      )
      .populate(
        'participants',
        'username email profile.firstName profile.lastName'
      )
      .sort({ lastActivity: -1 })

    const rooms = await roomsQuery

    // Transform data to include additional info for admin
    const transformedRooms = rooms.map((room) => ({
      _id: room._id,
      name: room.name,
      roomId: room.roomId,

      // Keep original populated data with new names
      creator: room.createdBy,
      members: room.participants,

      // Add calculated fields
      participantCount: room.participants.length,
      memberCount: room.participants.length, // Alternative name

      // Add simplified fields for easy access
      creatorId: room.createdBy?._id,
      creatorName: room.createdBy?.username || 'Unknown',
      creatorEmail: room.createdBy?.email || '',

      isPrivate: room.isPrivate,
      isActive: room.isActive,
      lastActivity: room.lastActivity,
      messageCount: room.messageCount,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }))

    res.json(transformedRooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    res.status(500).json({ error: error.message })
  }
}

// =============================================
// below not in use yet
// =============================================

// Keep all your other existing functions unchanged
export const getRoomById = async (req, res) => {
  // ... your existing code
}

export const createRoom = async (req, res) => {
  // ... your existing code
}

export const updateRoom = async (req, res) => {
  // ... your existing code
}

export const deleteRoom = async (req, res) => {
  // ... your existing code
}
