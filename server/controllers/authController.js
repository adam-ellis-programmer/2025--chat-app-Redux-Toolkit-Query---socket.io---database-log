import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Generate JWT token
import { generateToken } from '../utils/jwt.js'

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('token', token, {
    httpOnly: true, // Prevents XSS attacks
    secure: isProduction, // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/', // Available for entire site
  })
}

// Clear JWT cookie
const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      })
    }

    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email.toLowerCase()
            ? 'Email already registered'
            : 'Username already taken',
      })
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
    })

    // Generate verification token
    const verificationToken = user.generateVerificationToken()
    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    // Set JWT in cookie
    setTokenCookie(res, token)

    // TODO: Send verification email here
    // await sendVerificationEmail(user.email, user.username, verificationToken);

    res.status(201).json({
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
      token, // Also send in response body for flexibility
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    })
  }
}

// @desc    Verify email address
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findByVerificationToken(token)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      })
    }

    user.isVerified = true
    user.verificationToken = null
    user.verificationTokenExpires = null
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully! You can now access all features.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if user is verified
    // if (!user.isVerified) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please verify your email before logging in',
    //   })
    // }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Update last login
    await user.updateLastLogin()

    // Generate JWT token
    const token = generateToken(user._id)

    // Set JWT in cookie
    setTokenCookie(res, token)

    res.json({
      success: true,
      message: 'Login successful',
      token, // Also send in response body
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        profile: user.profile,
        lastLogin: user.lastLogin,
        access: user.access || ['user'], // ← Include access array
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    clearTokenCookie(res)

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
    })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    // console.log('USER----->', user)

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const requestPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      })
    }

    const { email } = req.body
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email address',
      })
    }

    // Generate reset token
    const resetToken = user.generateResetToken()
    await user.save()

    // TODO: Send reset email here
    // await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      })
    }

    const { token } = req.params
    const { password } = req.body

    const user = await User.findByResetToken(token)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      })
    }

    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    // Generate new JWT token after password reset
    const newToken = generateToken(user._id)
    setTokenCookie(res, newToken)

    res.json({
      success: true,
      message: 'Password reset successfully',
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email address',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      })
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken()
    await user.save()

    // TODO: Send verification email here
    // await sendVerificationEmail(user.email, user.username, verificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// Add these functions to your existing server/controllers/authController.js

// @desc    Google OAuth callback - handle successful authentication
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  try {
    // req.user will be populated by Passport middleware
    if (!req.user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/email-sign-in?error=auth_failed`
      )
    }

    // Update last login
    await req.user.updateLastLogin()

    // Generate JWT token
    const token = generateToken(req.user._id)

    // Set JWT in cookie (using your existing function)
    setTokenCookie(res, token)

    // Redirect to frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/chat/user`)
  } catch (error) {
    console.error('Google callback error:', error)
    res.redirect(`${process.env.CLIENT_URL}/email-sign-in?error=server_error`)
  }
}
