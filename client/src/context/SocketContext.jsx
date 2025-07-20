// src/context/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [availableRooms, setAvailableRooms] = useState([])
  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  // Get user from Redux store
  const user = useSelector((state) => state.auth.userInfo)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isAuthLoading = useSelector((state) => state.auth.isAuthLoading)

  console.log('🔍 SocketContext - Auth State:', {
    user: !!user,
    isAuthenticated,
    isAuthLoading,
    userId: user?.id,
  })

  const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

  useEffect(() => {
    console.log('🔍 SocketContext useEffect triggered')

    // ✅ KEY FIX: Only connect if user is authenticated and auth check is complete
    if (!user || !isAuthenticated || isAuthLoading) {
      console.log(
        '❌ Not connecting socket - user not authenticated or auth loading'
      )

      // Clean up existing socket if user logs out
      if (socket) {
        console.log('🧹 Cleaning up existing socket connection')
        socket.close()
        setSocket(null)
        setIsConnected(false)
        setCurrentRoom(null)
        setMessages([])
        setParticipants([])
        setAvailableRooms([])
      }
      return
    }

    // ✅ Only reach here if user is fully authenticated
    console.log('✅ User authenticated, initializing socket connection')

    const serverUrl = isProduction
      ? import.meta.env.VITE_SERVER_URL
      : 'http://localhost:5001'

    console.log('🔗 Attempting to connect to:', serverUrl)

    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      // Send user info with connection for better tracking
      auth: {
        userId: user.id,
        userName: user.username || user.email,
      },
    })

    console.log('🔌 Socket instance created:', newSocket)
    setSocket(newSocket)

    // Connection status
    newSocket.on('connect', () => {
      console.log('✅ Connected to server with ID:', newSocket.id)
      setIsConnected(true)
      // Get available rooms when connected
      newSocket.emit('get-rooms')
    })

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server. Reason:', reason)
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
      setIsConnected(false)
    })

    // Room events
    newSocket.on('room-created', (room) => {
      console.log('✅ Room created:', room)
      setCurrentRoom(room)
      setMessages(room.messages || [])
      setParticipants(room.participants || [])
    })

    newSocket.on('joined-room', (room) => {
      console.log('✅ Joined room:', room)
      setCurrentRoom(room)
      setMessages(room.messages || [])
      setParticipants(room.participants || [])
    })

    newSocket.on('rooms-updated', (rooms) => {
      console.log('📋 Rooms updated:', rooms)
      setAvailableRooms(rooms)
    })

    newSocket.on('rooms-list', (rooms) => {
      console.log('📋 Rooms list received:', rooms)
      setAvailableRooms(rooms)
    })

    newSocket.on('new-message', (message) => {
      console.log('💬 New message:', message)
      setMessages((prev) => [...prev, message])
    })

    newSocket.on('user-joined', ({ user: joinedUser, room }) => {
      console.log('👤 User joined:', joinedUser)
      setParticipants(room.participants || [])
    })

    newSocket.on('user-left', ({ userId, room }) => {
      console.log('👋 User left:', userId)
      setParticipants(room.participants || [])
    })

    newSocket.on('user-disconnected', ({ socketId, room }) => {
      console.log('📴 User disconnected:', socketId)
      setParticipants(room.participants || [])
    })

    // Error handling
    newSocket.on('room-exists', ({ message }) => {
      console.error('⚠️ Room exists:', message)
      alert(`Error: ${message}`)
    })

    newSocket.on('room-not-found', ({ message }) => {
      console.error('❌ Room not found:', message)
      alert(`Error: ${message}`)
    })

    newSocket.on('error', ({ message }) => {
      console.error('❌ Socket error:', message)
      alert(`Error: ${message}`)
    })

    return () => {
      console.log('🧹 Cleaning up socket connection')
      newSocket.close()
    }
  }, [user, isAuthenticated, isAuthLoading]) // ✅ Added isAuthLoading to dependencies

  const createRoom = (roomName, userId, userName) => {
    console.log('🏗️ Attempting to create room:', {
      roomName,
      userId,
      userName,
      isConnected,
      socket: !!socket,
    })
    if (socket && isConnected) {
      console.log('📤 Emitting create-room event')
      socket.emit('create-room', { roomName, userId, userName })
    } else {
      console.error('❌ Cannot create room: socket not connected', {
        socket: !!socket,
        isConnected,
      })
    }
  }

  const joinRoom = (roomName, userId, userName) => {
    console.log('🚪 Attempting to join room:', {
      roomName,
      userId,
      userName,
      isConnected,
      socket: !!socket,
    })
    if (socket && isConnected) {
      console.log('📤 Emitting join-room event')
      socket.emit('join-room', { roomName, userId, userName })
    } else {
      console.error('❌ Cannot join room: socket not connected', {
        socket: !!socket,
        isConnected,
      })
    }
  }

  const sendMessage = (message, userId, userName) => {
    console.log('💬 Attempting to send message:', {
      message,
      userId,
      userName,
      currentRoom: currentRoom?.name,
      isConnected,
      socket: !!socket,
    })
    if (socket && currentRoom && isConnected) {
      console.log('📤 Emitting send-message event')
      socket.emit('send-message', {
        roomName: currentRoom.name,
        message,
        userId,
        userName,
      })
    } else {
      console.error('❌ Cannot send message:', {
        socket: !!socket,
        currentRoom: currentRoom?.name,
        isConnected,
      })
    }
  }

  const leaveRoom = (userId) => {
    console.log('🚪 Attempting to leave room:', {
      userId,
      currentRoom: currentRoom?.name,
      isConnected,
      socket: !!socket,
    })
    if (socket && currentRoom && isConnected) {
      console.log('📤 Emitting leave-room event')
      socket.emit('leave-room', { roomName: currentRoom.name, userId })
      setCurrentRoom(null)
      setMessages([])
      setParticipants([])
    } else {
      console.error('❌ Cannot leave room:', {
        socket: !!socket,
        currentRoom: currentRoom?.name,
        isConnected,
      })
    }
  }

  const getRooms = useCallback(() => {
    console.log('📋 Attempting to get rooms:', {
      isConnected,
      socket: !!socket,
    })
    if (socket && isConnected) {
      console.log('📤 Emitting get-rooms event')
      socket.emit('get-rooms')
    } else {
      console.error('❌ Cannot get rooms:', { socket: !!socket, isConnected })
    }
  }, [socket, isConnected])

  const value = {
    socket,
    currentRoom,
    availableRooms,
    messages,
    participants,
    isConnected,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    getRooms,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
