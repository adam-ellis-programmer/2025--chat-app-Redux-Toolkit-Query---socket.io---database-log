// socketHandler.js
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

let io

// socket.on('event-name', (data) => {
//│      │    │             │
//│      │    │             └── Data sent from frontend
//│      │    └── Event name (custom or built-in)
//│      └── Listen for events
//└── THIS specific user's socket

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
      // console.log('HANDSHAKE-OBJ----->', socket.handshake)

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
  // Store active rooms and users
  // =======================================
  const activeRooms = new Map()
  const userRooms = new Map()

  // Helper function to create system messages
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
  // create the connection gateway wrapper
  // ====================================
  // It's the gateway where authenticated users enter your chat system and get their individual communication channels set up! 🚀
  // The socket parameter is YOUR direct line to communicate with that specific user
  // socket is the built in socket.IO Event
  // connection is the event NAME
  // io is the socket INSTANCE
  io.on('connection', (socket) => {
    console.log('I0.ON ---- SOCKET-LOG--->', socket)
    console.log('🔌 Authenticated socket connection established')
    console.log(
      `✅ User ${socket.userName} (${socket.userId}) connected with socket: ${socket.id}`
    )
    //  Set up event listeners for THIS specific socket
    // ====================================
    // Handle room creation
    // ====================================
    // create room EVENT LISTENER
    socket.on('create-room', ({ roomName, userId, userName }) => {
      // console.log('SOCKET-LOG--->', socket)
      console.log(`📝 Creating room: ${roomName} by ${userName}`)

      // 🔒 Verify the user is who they claim to be
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      if (activeRooms.has(roomName)) {
        socket.emit('room-exists', { message: 'Room already exists' })
        return
      }

      // sets up the room with exactly one user
      const room = {
        id: roomName,
        name: roomName,
        participants: [{ id: userId, name: userName, socketId: socket.id }],
        messages: [],
        createdAt: new Date(),
      }

      // Add system message for room creation
      const welcomeMessage = createSystemMessage(
        `${userName} created the room`,
        roomName
      )
      room.messages.push(welcomeMessage)

      activeRooms.set(roomName, room)
      userRooms.set(socket.id, roomName)

      socket.join(roomName)
      // socket.join
      // Now when server does this:
      // Getting a room key - user can now "enter" the room
      // io.to('MyRoom').emit('new-message', messageData)
      // ↑ This socket will receive the message!
      // Without socket.join(), the user would be "locked out" of room messages

      socket.emit('room-created', room)

      // Triggered by server when ANY user creates/joins/leaves room
      // Broadcast updated room list to all users
      // Don't request this - it just happens
      // Real-time synchronization
      // Used to update rooms avalable in createChat page
      io.emit('rooms-updated', Array.from(activeRooms.values()))

      console.log(`✅ Room ${roomName} created successfully`)
      console.log('user rooms--->.', userRooms)
    })

    // ====================================
    // Handle joining a room
    // ====================================
    socket.on('join-room', ({ roomName, userId, userName }) => {
      console.log(`🚪 ${userName} trying to join room: ${roomName}`)

      // 🔒 Verify the user is who they claim to be
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      const room = activeRooms.get(roomName)

      if (!room) {
        socket.emit('room-not-found', { message: 'Room not found' })
        return
      }

      // Check if user is already in the room
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

      userRooms.set(socket.id, roomName)
      socket.join(roomName)

      // Send room data to the joining user
      socket.emit('joined-room', room)

      // If it's a new user joining, send system message and notify others
      if (isNewUser) {
        const joinMessage = createSystemMessage(
          `${userName} joined the room`,
          roomName
        )

        room.messages.push(joinMessage)

        // Send join message to all users in the room (including the one who just joined)
        io.to(roomName).emit('new-message', joinMessage)

        // WHY USE SOCKET.TO AND IO.TO ABOVE
        // Notify other users in the room about the new participant
        socket
          .to(roomName)
          .emit('user-joined', { user: { id: userId, name: userName }, room })
      }

      // Broadcast updated room list to all users
      io.emit('rooms-updated', Array.from(activeRooms.values()))
      console.log(`✅ ${userName} joined room ${roomName}`)
    })
    // ====================================
    // Handle sending messages
    // ====================================
    socket.on('send-message', ({ roomName, message, userId, userName }) => {
      console.log(`💬 Message from ${userName} in ${roomName}: ${message}`)

      // 🔒 Verify the user is who they claim to be
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      const room = activeRooms.get(roomName)

      if (!room) {
        socket.emit('error', { message: 'Room not found' })
        return
      }

      const newMessage = {
        id: Date.now().toString(),
        text: message,
        userId,
        userName,
        timestamp: new Date(),
        isSystemMessage: false,
      }

      room.messages.push(newMessage)

      // Send message to all users in the room
      io.to(roomName).emit('new-message', newMessage)
      console.log(`✅ Message sent to room ${roomName}`)
    })
    // ====================================
    // Handle leaving room
    // ====================================
    socket.on('leave-room', ({ roomName, userId }) => {
      console.log(`🚪 User ${userId} leaving room ${roomName}`)

      // 🔒 Verify the user is who they claim to be
      if (socket.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized: User ID mismatch' })
        return
      }

      const room = activeRooms.get(roomName)

      if (room) {
        // Find the user who's leaving to get their name
        const leavingUser = room.participants.find((p) => p.id === userId)
        const userName = leavingUser ? leavingUser.name : 'Unknown User'

        // Remove user from participants
        room.participants = room.participants.filter((p) => p.id !== userId)

        // Add system message for user leaving
        const leaveMessage = createSystemMessage(
          `${userName} left the room`,
          roomName
        )
        room.messages.push(leaveMessage)

        // Send leave message to remaining users in the room
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
      }
    })
    // ====================================
    // Handle getting available rooms
    // ====================================
    // get-rooms is used in ONE main scenario:  When the CreateChatPage loads for the first time
    // get-rooms = "Hey server, what rooms exist right now?" (INITIAL LOAD)
    // rooms-updated = "Hey everyone, the room list just changed!" (REAL-TIME UPDATES)
    socket.on('get-rooms', () => {
      console.log('📋 Sending room list to client')
      socket.emit('rooms-list', Array.from(activeRooms.values()))
    })

    // ====================================
    // Handle disconnect
    // ====================================
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id)

      const roomName = userRooms.get(socket.id)
      if (roomName) {
        const room = activeRooms.get(roomName)
        if (room) {
          // Find the user who disconnected to get their name
          const disconnectedUser = room.participants.find(
            (p) => p.socketId === socket.id
          )
          const userName = disconnectedUser
            ? disconnectedUser.name
            : 'Unknown User'

          // Remove user from participants
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          )

          // Add system message for user disconnecting
          const disconnectMessage = createSystemMessage(
            `${userName} disconnected`,
            roomName
          )
          room.messages.push(disconnectMessage)

          // If room is empty, delete it
          if (room.participants.length === 0) {
            activeRooms.delete(roomName)
            console.log(`🗑️ Room ${roomName} deleted (empty after disconnect)`)
          } else {
            // Send disconnect message to remaining users in the room
            socket.to(roomName).emit('new-message', disconnectMessage)

            // Notify other users in the room
            socket
              .to(roomName)
              .emit('user-disconnected', { socketId: socket.id, room })
          }

          // Broadcast updated room list to all users
          io.emit('rooms-updated', Array.from(activeRooms.values()))
        }
      }

      userRooms.delete(socket.id)
    })

    // ====================================
    // Handle errors
    // ====================================
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  })

  console.log('✅ Socket.IO initialized successfully')
  return io
}

export { initializeSocket, io }
