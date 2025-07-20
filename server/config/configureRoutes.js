// routes/index.js
import authRoutes from '../routes/auth.js'
import roomRoutes from '../routes/room.js'
import messageRoutes from '../routes/message.js'

const configureRoutes = (app) => {
  // Mount all routes
  app.use('/api/auth', authRoutes)
  app.use('/api/rooms', roomRoutes)
  app.use('/api/messages', messageRoutes)

  // Basic health check route
  app.get('/api/health', (req, res) => {
    res.json({
      message: 'Server is running!',
      environment: process.env.NODE_ENV || null,
      appName: process.env.APP_NAME || null,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      googleConfigured: !!process.env.GOOGLE_CLIENT_ID,
      socketIO: 'enabled',
    })
  })
}

export default configureRoutes
