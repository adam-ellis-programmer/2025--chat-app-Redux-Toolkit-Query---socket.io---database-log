import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are now default in Mongoose 6+
      serverSelectionTimeoutMS: 15000, // Optional: timeout for server selection
      socketTimeoutMS: 45000, // Optional: timeout for socket operations
    })

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`)
    console.log(`🗄️  Database: ${conn.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message) 
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📦 MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})

export default connectDB
