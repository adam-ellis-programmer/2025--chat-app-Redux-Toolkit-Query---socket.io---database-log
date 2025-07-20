import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to verify JWT token and add user to req object
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token
    // console.log(token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }
  
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log('decoded', decoded)

    // Get user from database (optional - for fresh user data)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.',
      })
    }

    // Add user to request object
    req.user = {
      id: decoded.id,
      ...user.toObject(),
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    })
  }
}

export const checkIsAdmin = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database (optional - for fresh user data)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.',
      })
    }

    // Check if user has manager access
    if (!user.access.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this data!!',
      })
    }

    next()
  } catch (error) {
    console.log('error log-->', error)

    // Handle different types of errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      })
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

// Optional: Middleware that doesn't require authentication but adds user if token exists
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')

      if (user) {
        req.user = {
          id: decoded.userId,
          ...user.toObject(),
        }
      }
    }

    next()
  } catch (error) {
    // Don't return error for optional auth - just continue without user
    console.log('Optional auth failed:', error.message)
    next()
  }
}
