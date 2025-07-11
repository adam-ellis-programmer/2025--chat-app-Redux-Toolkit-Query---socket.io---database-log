// server.js
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import authRoutes from './routes/auth.js'
import { initializeSocket } from './socketHandler.js'

import passport from 'passport'
import { configurePassport } from './config/passport.js'

// Connect to database
connectDB()

console.log('🔍 Environment variables check:')
console.log(
  'GOOGLE_CLIENT_ID:',
  process.env.GOOGLE_CLIENT_ID ? 'EXISTS' : 'MISSING'
)
console.log(
  'GOOGLE_CLIENT_SECRET:',
  process.env.GOOGLE_CLIENT_SECRET ? 'EXISTS' : 'MISSING'
)
console.log('---')

// Configure Passport after environment is loaded
configurePassport()

const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = initializeSocket(server)

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(passport.initialize())

// make app routes in a new file

app.use('/api/auth', authRoutes)

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    environment: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'ChatApp',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    googleConfigured: !!process.env.GOOGLE_CLIENT_ID,
    socketIO: 'enabled',
  })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔌 Socket.IO initialized`)
})
