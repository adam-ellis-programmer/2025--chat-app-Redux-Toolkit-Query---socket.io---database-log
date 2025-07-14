// socketHandler.js
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import Room from './models/Room.js'
import Message from './models/Message.js'
import User from './models/User.js'

let io

const initializeSocket = (server) => {
  console.log('🔧 Initializing Socket.IO...')

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  })

  // ====================================
  // 🔒 AUTHENTICATION MIDDLEWARE
  // ====================================
  io.use((socket, next) => {
    try {
      console.log('🔍 Checking socket authentication...')

      // Method 1: Check JWT token from cookies
      const cookies = socket.handshake.headers.cookie
      console.log('cookies---->', cookies)
      let token = null

      if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        token = parsedCookies.token
      }

      if (!token) {
        console.log('❌ No JWT token found in cookies')
        return next(new Error('No authentication token'))
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('✅ JWT verified for user:', decoded.id)

      // Get auth data from handshake
      const { userId, userName } = socket.handshake.auth

      // Verify the auth userId matches the JWT user
      if (decoded.id !== userId) {
        console.log('❌ User ID mismatch:', decoded.id, 'vs', userId)
        return next(new Error('User ID mismatch'))
      }

      // Attach verified user info to socket
      socket.userId = decoded.id
      socket.userName = userName
      socket.isAuthenticated = true

      console.log(
        `✅ Socket authenticated for user: ${userName} (${decoded.id})`
      )
      next() // Allow connection
    } catch (error) {
      console.error('❌ Socket authentication failed:', error.message)
      next(new Error('Authentication failed'))
    }
  })

  // =======================================
  // Store active rooms and users (KEEP ORIGINAL LOGIC)
  // =======================================
  const activeRooms = new Map()
  const userRooms = new Map()

  // Helper function to create system messages (KEEP ORIGINAL)
  const createSystemMessage = (text, roomName) => {
    return {
      id: Date.now().toString() + Math.random(),
      text,
      userId: 'system',
      userName: 'System',
      timestamp: new Date(),
      isSystemMessage: true,
    }
  }

  // ====================================
  // 🆕 DATABASE LOGGING HELPERS
  // ====================================

  // Log room creation to database
  const logRoomCreation = async (roomName, userId, userName) => {
    try {
      console.log('📊 Logging room creation to database...')

      const newRoom = new Room({
        name: roomName,
        roomId: roomName, // Using roomName as roomId for now
        createdBy: userId,
        participants: [userId],
        isPrivate: false,
        isActive: true,
        lastActivity: new Date(),
        messageCount: 0,
      })

      await newRoom.save()
      console.log(`✅ Room ${roomName} logged to database`)
      return newRoom
    } catch (error) {
      console.error('❌ Error logging room creation:', error)
      // Don't throw - just log the error so chat continues working
      return null
    }
  }

  // Log message to database
  const logMessageToDatabase = async (
    roomName,
    messageData,
    isSystemMessage = false,
    systemMessageUserId = null
  ) => {
    try {
      console.log('📊 Logging message to database...')
      console.log('📊 Debug - messageData:', messageData)
      console.log('📊 Debug - isSystemMessage:', isSystemMessage)
      console.log('📊 Debug - systemMessageUserId:', systemMessageUserId)

      // Find the room in database
      const room = await Room.findOne({ name: roomName })
      if (!room) {
        console.log('⚠️ Room not found in database for logging message')
        return null
      }

      // For system messages, use the provided userId or the room creator
      let messageUserId
      if (isSystemMessage) {
        messageUserId = systemMessageUserId || room.createdBy
      } else {
        messageUserId = messageData.userId
      }

      console.log('📊 Debug - final messageUserId:', messageUserId)
      console.log('📊 Debug - room.createdBy:', room.createdBy)

      // Validate that we have a userId
      if (!messageUserId) {
        console.error('❌ No valid userId found for message')
        return null
      }

      // Create message record
      const newMessage = new Message({
        roomId: room._id,
        userId: messageUserId, // ✅ Always use a valid userId
        content: messageData.text,
        messageType: isSystemMessage ? 'system' : 'text',
        isSystemMessage: isSystemMessage,
      })

      await newMessage.save()
      console.log(`✅ Message logged to database for room ${roomName}`)
      return newMessage
    } catch (error) {
      console.error('❌ Error logging message:', error)
      // Don't throw - just log the error so chat continues working
      return null
    }
  }

  // Update room participants in database
  const updateRoomParticipants = async (roomName, userId, action = 'add') => {
    try {
      console.log(
        `📊 ${
          action === 'add' ? 'Adding' : 'Removing'
        } participant ${userId} from room ${roomName} in database...`
      )

      const room = await Room.findOne({ name: roomName })
      if (!room) {
        console.log('⚠️ Room not found in database for participant update')
        return null
      }

      if (action === 'add') {
        // Only add if not already in participants (for historical record)
        if (!room.participants.includes(userId)) {
          await room.addParticipant(userId)
          console.log(
            `✅ Participant ${userId} added to room ${roomName} database record`
          )
        } else {
          console.log(
            `ℹ️ Participant ${userId} already in room ${roomName} database record`
          )
        }
      } else {
        // For 'remove' action, DON'T actually remove from database
        // Keep the historical record intact for admin audit purposes
        console.log(
          `ℹ️ Participant ${userId} left room ${roomName} but keeping in database for audit trail`
        )

        // Just update the room's lastActivity to show recent activity
        room.lastActivity = new Date()
        await room.save()
      }

      return room
    } catch (error) {
      console.error('❌ Error updating room participants:', error)
      return null
    }
  }

  // ====================================
  // CONNECTION GATEWAY (KEEP ORIGINAL)
  // ====================================
  io.on('connection', (socket) => {
    console.log('I0.ON ---- SOCKET-LOG--->', socket)
    console.log('🔌 Authenticated socket connection established')
    console.log(
      `✅ User ${socket.userName} (${socket.userId}) connected with socket: ${socket.id}`
    )

    // ====================================
    // Handle room creation (ORIGINAL + LOGGING)
    // ====================================
    socket.on('create-room', async ({ roomName, userId, userName }) => {
      console.log(`📝 Creating room: ${roomName} by ${userName}`)

      // 🔒 Verify the user is who they claim to be (KEEP ORIGINAL)
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      if (activeRooms.has(roomName)) {
        socket.emit('room-exists', { message: 'Room already exists' })
        return
      }

      // KEEP ORIGINAL: sets up the room with exactly one user
      const room = {
        id: roomName,
        name: roomName,
        participants: [{ id: userId, name: userName, socketId: socket.id }],
        messages: [],
        createdAt: new Date(),
      }

      // KEEP ORIGINAL: Add system message for room creation
      const welcomeMessage = createSystemMessage(
        `${userName} created the room`,
        roomName
      )
      room.messages.push(welcomeMessage)

      // KEEP ORIGINAL: In-memory storage
      activeRooms.set(roomName, room)
      userRooms.set(socket.id, roomName)
      socket.join(roomName)

      // KEEP ORIGINAL: Send responses
      socket.emit('room-created', room)
      io.emit('rooms-updated', Array.from(activeRooms.values()))

      console.log(`✅ Room ${roomName} created successfully`)
      console.log('user rooms--->.', userRooms)
      console.log('📊 Debug - userId for room creation:', userId)

      // 🆕 DATABASE LOGGING: Log room creation and welcome message
      const dbRoom = await logRoomCreation(roomName, userId, userName)
      if (dbRoom) {
        console.log('📊 Debug - dbRoom.createdBy:', dbRoom.createdBy)
        await logMessageToDatabase(roomName, welcomeMessage, true, userId)
      }
    })

    // ====================================
    // Handle joining a room (ORIGINAL + LOGGING)
    // ====================================
    socket.on('join-room', async ({ roomName, userId, userName }) => {
      console.log(`🚪 ${userName} trying to join room: ${roomName}`)

      // 🔒 Verify the user is who they claim to be (KEEP ORIGINAL)
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      const room = activeRooms.get(roomName)

      if (!room) {
        socket.emit('room-not-found', { message: 'Room not found' })
        return
      }

      // KEEP ORIGINAL: Check if user is already in the room
      const existingUser = room.participants.find((p) => p.id === userId)
      let isNewUser = false

      if (existingUser) {
        // Update socket ID if user reconnected
        existingUser.socketId = socket.id
      } else {
        // Add new participant
        room.participants.push({
          id: userId,
          name: userName,
          socketId: socket.id,
        })
        isNewUser = true
      }

      // KEEP ORIGINAL: In-memory updates
      userRooms.set(socket.id, roomName)
      socket.join(roomName)

      // Send room data to the joining user
      socket.emit('joined-room', room)

      // KEEP ORIGINAL: If it's a new user joining, send system message and notify others
      if (isNewUser) {
        const joinMessage = createSystemMessage(
          `${userName} joined the room`,
          roomName
        )

        room.messages.push(joinMessage)

        // Send join message to all users in the room (including the one who just joined)
        io.to(roomName).emit('new-message', joinMessage)

        // Notify other users in the room about the new participant
        socket
          .to(roomName)
          .emit('user-joined', { user: { id: userId, name: userName }, room })

        // 🆕 DATABASE LOGGING: Log join message and update participants
        await updateRoomParticipants(roomName, userId, 'add')
        await logMessageToDatabase(roomName, joinMessage, true, userId)
      }

      // KEEP ORIGINAL: Broadcast updated room list to all users
      io.emit('rooms-updated', Array.from(activeRooms.values()))
      console.log(`✅ ${userName} joined room ${roomName}`)
    })

    // ====================================
    // Handle sending messages (ORIGINAL + LOGGING)
    // ====================================
    socket.on(
      'send-message',
      async ({ roomName, message, userId, userName }) => {
        console.log(`💬 Message from ${userName} in ${roomName}: ${message}`)

        // 🔒 Verify the user is who they claim to be (KEEP ORIGINAL)
        if (socket.userId !== userId) {
          socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
          return
        }

        const room = activeRooms.get(roomName)

        if (!room) {
          socket.emit('error', { message: 'Room not found' })
          return
        }

        // KEEP ORIGINAL: Create message object
        const newMessage = {
          id: Date.now().toString(),
          text: message,
          userId,
          userName,
          timestamp: new Date(),
          isSystemMessage: false,
        }

        // KEEP ORIGINAL: Add to in-memory room and broadcast
        room.messages.push(newMessage)
        io.to(roomName).emit('new-message', newMessage)
        console.log(`✅ Message sent to room ${roomName}`)

        // 🆕 DATABASE LOGGING: Log user message
        await logMessageToDatabase(roomName, newMessage, false)
      }
    )

    // ====================================
    // Handle leaving room (ORIGINAL + LOGGING)
    // ====================================
    socket.on('leave-room', async ({ roomName, userId }) => {
      console.log(`🚪 User ${userId} leaving room ${roomName}`)

      // 🔒 Verify the user is who they claim to be (KEEP ORIGINAL)
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      const room = activeRooms.get(roomName)

      if (room) {
        // KEEP ORIGINAL: Find the user who's leaving to get their name
        const leavingUser = room.participants.find((p) => p.id === userId)
        const userName = leavingUser ? leavingUser.name : 'Unknown User'

        // KEEP ORIGINAL: Remove user from participants
        room.participants = room.participants.filter((p) => p.id !== userId)

        // KEEP ORIGINAL: Add system message for user leaving
        const leaveMessage = createSystemMessage(
          `${userName} left the room`,
          roomName
        )
        room.messages.push(leaveMessage)

        // KEEP ORIGINAL: Send leave message and handle cleanup
        io.to(roomName).emit('new-message', leaveMessage)

        // If room is empty, delete it
        if (room.participants.length === 0) {
          activeRooms.delete(roomName)
          console.log(`🗑️ Room ${roomName} deleted (empty)`)
        }

        socket.leave(roomName)
        userRooms.delete(socket.id)

        // Notify other users in the room
        socket.to(roomName).emit('user-left', { userId, room })

        // Broadcast updated room list to all users
        io.emit('rooms-updated', Array.from(activeRooms.values()))

        // 🆕 DATABASE LOGGING: Log leave message and update participants
        await logMessageToDatabase(roomName, leaveMessage, true, userId)
        await updateRoomParticipants(roomName, userId, 'remove')
      }
    })

    // ====================================
    // Handle getting available rooms (KEEP ORIGINAL)
    // ====================================
    socket.on('get-rooms', () => {
      console.log('📋 Sending room list to client')
      socket.emit('rooms-list', Array.from(activeRooms.values()))
    })

    // ====================================
    // Handle disconnect (ORIGINAL + LOGGING)
    // ====================================
    socket.on('disconnect', async () => {
      console.log('❌ User disconnected:', socket.id)

      const roomName = userRooms.get(socket.id)
      if (roomName) {
        const room = activeRooms.get(roomName)
        if (room) {
          // KEEP ORIGINAL: Find the user who disconnected to get their name
          const disconnectedUser = room.participants.find(
            (p) => p.socketId === socket.id
          )
          const userName = disconnectedUser
            ? disconnectedUser.name
            : 'Unknown User'

          // KEEP ORIGINAL: Remove user from participants
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          )

          // KEEP ORIGINAL: Add system message for user disconnecting
          const disconnectMessage = createSystemMessage(
            `${userName} disconnected`,
            roomName
          )
          room.messages.push(disconnectMessage)

          // KEEP ORIGINAL: Handle room cleanup and notifications
          if (room.participants.length === 0) {
            activeRooms.delete(roomName)
            console.log(`🗑️ Room ${roomName} deleted (empty after disconnect)`)
          } else {
            socket.to(roomName).emit('new-message', disconnectMessage)
            socket
              .to(roomName)
              .emit('user-disconnected', { socketId: socket.id, room })
          }

          io.emit('rooms-updated', Array.from(activeRooms.values()))

          // 🆕 DATABASE LOGGING: Log disconnect message
          await logMessageToDatabase(
            roomName,
            disconnectMessage,
            true,
            disconnectedUser?.id
          )
          if (disconnectedUser) {
            await updateRoomParticipants(
              roomName,
              disconnectedUser.id,
              'remove'
            )
          }
        }
      }

      userRooms.delete(socket.id)
    })

    // ====================================
    // Handle errors (KEEP ORIGINAL)
    // ====================================
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  })

  console.log('✅ Socket.IO initialized successfully')
  return io
}

export { initializeSocket, io }
