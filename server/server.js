// server.js
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { initializeSocket } from './socketHandler.js'

import passport from 'passport'
import { configurePassport } from './config/passport.js'
import configureRoutes from './config/configureRoutes.js'

// ============================
// CONNECT TO DATABASE
// ============================
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
console.log('--server running--')

// Configure Passport after environment is loaded
// ============================
// CONFIGURE PASSPORT SETUP
// ============================
configurePassport()

const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = initializeSocket(server)

// ============================
// APP MIDDLEWARE
// ============================
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Development frontend
      'https://socket-io-app-mern-deployed.vercel.app', // Production frontend
      process.env.CLIENT_URL, // Additional client URL from env
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
)

// ============================
// INITIALIZE PASSPORT FOR AUTH
// ============================
app.use(passport.initialize())

// ============================
// SET UP ROUTES
// ============================
configureRoutes(app)

// ============================
// ERROR / NOT FOUND MIDDLEWARE
// ============================
app.use(notFound)
app.use(errorHandler)

// ============================
// PORT AND SERVER LISTEN
// ============================
const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔌 Socket.IO initialized`)
})
