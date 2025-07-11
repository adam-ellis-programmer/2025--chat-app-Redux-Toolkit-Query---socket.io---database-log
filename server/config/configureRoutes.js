// routes/index.js
import authRoutes from '../routes/auth.js'
// Import other route files as you create them
// import productRoutes from './products.js'
// import userRoutes from './users.js'
// import orderRoutes from './orders.js'
// import uploadRoutes from './upload.js'

const configureRoutes = (app) => {
  // Mount all routes
  app.use('/api/auth', authRoutes)

  // how to handle room id on the server

  // Add other routes as you create them
  // app.use('/api/products', productRoutes)
  // app.use('/api/users', userRoutes)
  // app.use('/api/orders', orderRoutes)
  // app.use('/api/upload', uploadRoutes)

  // Basic health check route
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
}

export default configureRoutes
