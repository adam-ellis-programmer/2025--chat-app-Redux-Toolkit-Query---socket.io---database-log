import passport from 'passport'
import { getAllUsers, googleCallback } from '../controllers/authController.js'
import express from 'express'
import {
  register,
  verifyEmail,
  login,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  resendVerificationEmail,
  logout,
} from '../controllers/authController.js'
import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateEmail,
} from '../middleware/validation.js'

import {
  authenticateToken,
  checkIsAdmin,
} from '../middleware/authMiddleware.js'

const router = express.Router()
// /api/auth/...

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, register)

// @route   GET /api/auth/verify/:token
// @desc    Verify email address
// @access  Public
router.get('/verify/:token', verifyEmail)

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private (will add auth middleware later)
router.get('/me', authenticateToken, getCurrentUser)

// @route   GET /api/auth/all-users
// @desc    Get all users
// @access  Private (will add auth middleware later)
router.get('/all-users', checkIsAdmin, getAllUsers)

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  '/forgot-password',
  validatePasswordResetRequest,
  requestPasswordReset
)

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', validatePasswordReset, resetPassword)

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', validateEmail, resendVerificationEmail)

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', logout)

// google auth routes

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
)

export default router
