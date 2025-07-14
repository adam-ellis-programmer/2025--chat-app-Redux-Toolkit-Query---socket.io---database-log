// how to handle room id on the server
// models/Room.js
import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
)

// Index for better query performance
roomSchema.index({ roomId: 1 })
roomSchema.index({ createdBy: 1 })
roomSchema.index({ participants: 1 })
roomSchema.index({ isActive: 1, lastActivity: -1 })

// Virtual to get message count
roomSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'roomId',
})

// Method to add participant
roomSchema.methods.addParticipant = function (userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId)
    return this.save()
  }
  return Promise.resolve(this)
}

// Method to remove participant
roomSchema.methods.removeParticipant = function (userId) {
  this.participants = this.participants.filter(
    (id) => id.toString() !== userId.toString()
  )
  return this.save()
}

// Static method to find active rooms
roomSchema.statics.findActiveRooms = function () {
  return this.find({ isActive: true })
    .populate('createdBy', 'username email')
    .populate('participants', 'username email')
    .sort({ lastActivity: -1 })
}

const Room = mongoose.model('Room', roomSchema)
export default Room
