import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import Room from '../models/Room.js'
import Message from '../models/Message.js'
import { users } from './userData.js'
import { getRooms } from './roomData.js'
import { getMessages } from './messageData.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Room.deleteMany({})
    await Message.deleteMany({})
    console.log('✅ Cleared existing data')

    // Create users
    console.log('👥 Creating users...')
    const createdUsers = await User.insertMany(users)
    console.log(`✅ Created ${createdUsers.length} users`)

    // Create rooms with actual user IDs
    console.log('🏠 Creating rooms...')
    const roomData = getRooms(createdUsers)
    const createdRooms = await Room.insertMany(roomData)
    console.log(`✅ Created ${createdRooms.length} rooms`)

    // Create messages with actual user and room IDs
    console.log('💬 Creating messages...')
    const messageData = getMessages(createdUsers, createdRooms)
    const createdMessages = await Message.insertMany(messageData)
    console.log(`✅ Created ${createdMessages.length} messages`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Users: ${createdUsers.length}`)
    console.log(`   - Rooms: ${createdRooms.length}`)
    console.log(`   - Messages: ${createdMessages.length}`)

    // Display sample login credentials
    console.log('\n🔐 Sample Login Credentials:')
    console.log('   Email: john.doe@example.com')
    console.log('   Password: Password123')
    console.log('\n   (All users have the same password: Password123)')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

const clearDatabase = async () => {
  try {
    await connectDB()
    console.log('🗑️  Starting database cleanup...')

    await User.deleteMany({})
    await Room.deleteMany({})
    await Message.deleteMany({})

    console.log('✅ Database cleared successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    process.exit(1)
  }
}

// Check command line arguments
const isDeleteMode =
  process.argv.includes('-d') || process.argv.includes('--delete')

if (isDeleteMode) {
  clearDatabase()
} else {
  seedDatabase()
}
