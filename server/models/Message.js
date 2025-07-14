// models/Message.js
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    isSystemMessage: {
      type: Boolean,
      default: false,
    },
    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Edit tracking
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    originalContent: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

// Indexes for better performance
messageSchema.index({ roomId: 1, createdAt: -1 })
messageSchema.index({ userId: 1 })
messageSchema.index({ isDeleted: 1 })
messageSchema.index({ messageType: 1 })

// Query helper to exclude deleted messages
messageSchema.query.active = function () {
  return this.where({ isDeleted: false })
}

// Instance method for soft delete
messageSchema.methods.softDelete = function (deletedByUserId) {
  this.isDeleted = true
  this.deletedAt = new Date()
  this.deletedBy = deletedByUserId
  return this.save()
}

// Instance method for editing message
messageSchema.methods.editContent = function (newContent) {
  if (!this.edited) {
    this.originalContent = this.content
  }
  this.content = newContent
  this.edited = true
  this.editedAt = new Date()
  return this.save()
}

// Static method to get room messages with pagination
messageSchema.statics.getRoomMessages = function (
  roomId,
  page = 1,
  limit = 50
) {
  return this.find({ roomId, isDeleted: false })
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
}

// Pre-save middleware to update room's lastActivity and messageCount
messageSchema.pre('save', async function (next) {
  if (this.isNew && !this.isDeleted) {
    try {
      await mongoose.model('Room').findByIdAndUpdate(this.roomId, {
        lastActivity: new Date(),
        $inc: { messageCount: 1 },
      })
    } catch (error) {
      console.error('Error updating room stats:', error)
    }
  }
  next()
})

const Message = mongoose.model('Message', messageSchema)
export default Message
