// server/config/passport.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

import mongoose from 'mongoose'


// Export a function that configures passport when called
export const configurePassport = () => {
  console.log('🔧 Configuring Passport...')
  console.log('GOOGLE_CLIENT_ID available:', !!process.env.GOOGLE_CLIENT_ID)

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is required for Passport configuration')
  }

  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, emails, name, photos } = profile
          const email = emails[0].value.toLowerCase()

          // Check if user already exists with this email
          let user = await User.findOne({ email })

          if (user) {
            // User exists - link Google account if not already linked
            if (!user.googleId) {
              user.googleId = id
              user.profile = {
                ...user.profile,
                firstName: user.profile?.firstName || name.givenName,
                lastName: user.profile?.lastName || name.familyName,
                avatar: user.profile?.avatar || photos[0]?.value,
              }
              await user.save()
            }
          } else {
            // Create new user
            user = new User({
              googleId: id,
              email: email,
              username: `${name.givenName.toLowerCase()}_${Date.now()}`,
              isVerified: true, // Google emails are verified
              profile: {
                firstName: name.givenName,
                lastName: name.familyName,
                avatar: photos[0]?.value,
              },
              // No password required for Google-only users
            })
            await user.save()
          }

          return done(null, user)
        } catch (error) {
          console.error('Google OAuth error:', error)
          return done(error, null)
        }
      }
    )
  )

  // Serialize user for session (required by Passport)

  
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  // Deserialize user from session (required by Passport)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password')
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })

  console.log('✅ Passport configured successfully')
}

export default passport
