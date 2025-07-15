import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    access: {
      type: [String],
      enum: ['user', 'manager', 'admin'],
      default: ['user'],
      validate: {
        validator: function (arr) {
          return arr.length > 0 // Must have at least one role
        },
        message: 'User must have at least one access role',
      },
    },

    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Make password optional for Google-only users
    password: {
      type: String,
      required: function () {
        return !this.googleId // Password required only if no Google ID
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
        default: null,
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        default: null,
      },
      avatar: {
        type: String,
        default: null,
      },
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: null,
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password
        delete ret.verificationToken
        delete ret.resetPasswordToken
        return ret
      },
    },
  }
)

// ============================================
// MIDDLEWARE - Hash password before saving
// ============================================
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// ============================================
// METHODS - Instance methods
// ============================================

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

// Generate email verification token
userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(32).toString('hex')
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return this.verificationToken
}

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
  return this.resetPasswordToken
}

// Check if verification token is valid
userSchema.methods.isVerificationTokenValid = function () {
  return this.verificationToken && this.verificationTokenExpires > Date.now()
}

// Check if reset token is valid
userSchema.methods.isResetTokenValid = function () {
  return this.resetPasswordToken && this.resetPasswordExpires > Date.now()
}

// Get full name
userSchema.methods.getFullName = function () {
  const { firstName, lastName } = this.profile
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  return firstName || lastName || this.username
}

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save()
}

// ============================================
// STATIC METHODS - Model methods
// ============================================

// Find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Find user by username
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username })
}

// Find user by verification token
userSchema.statics.findByVerificationToken = function (token) {
  return this.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  })
}

// Find user by reset token
userSchema.statics.findByResetToken = function (token) {
  return this.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  })
}

// ============================================
// INDEXES for better performance
// ============================================
// The indexes are already created automatically because you have unique: true on email and username.
// userSchema.index({ email: 1 })
// userSchema.index({ username: 1 })
// userSchema.index({ verificationToken: 1 })
// userSchema.index({ resetPasswordToken: 1 })

export default mongoose.model('User', userSchema)
