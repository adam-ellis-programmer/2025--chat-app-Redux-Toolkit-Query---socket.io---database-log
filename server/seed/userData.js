// seed/userData.js
import bcrypt from 'bcryptjs'

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)
const hash = bcrypt.hashSync('111111', salt)

export const users = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: hash,
    access: ['user'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Software developer and travel enthusiast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe',
    },
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    username: 'sarah_smith',
    email: 'sarah.smith@example.com',
    password: hash,
    access: ['user', 'manager'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Sarah',
      lastName: 'Smith',
      bio: 'Tech lead and mountain climber',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah_smith',
    },
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    username: 'mike_jones',
    email: 'mike.jones@example.com',
    password: hash,
    access: ['user'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Mike',
      lastName: 'Jones',
      bio: 'Sales manager | Coffee addict',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike_jones',
    },
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    username: 'emma_wilson',
    email: 'emma.wilson@example.com',
    password: hash,
    access: ['user', 'admin'],
    isAdmin: true,
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Emma',
      lastName: 'Wilson',
      bio: 'System administrator and cybersecurity expert',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma_wilson',
    },
    lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    username: 'alex_chen',
    email: 'alex.chen@example.com',
    password: hash,
    access: ['user'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Alex',
      lastName: 'Chen',
      bio: 'Full-stack developer | Open source contributor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_chen',
    },
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    username: 'lisa_brown',
    email: 'lisa.brown@example.com',
    password: hash,
    access: ['user', 'manager'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Lisa',
      lastName: 'Brown',
      bio: 'Marketing director | World traveler',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa_brown',
    },
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    username: 'david_taylor',
    email: 'david.taylor@example.com',
    password: hash,
    access: ['user'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'David',
      lastName: 'Taylor',
      bio: 'UX designer | Photography enthusiast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david_taylor',
    },
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    username: 'jessica_garcia',
    email: 'jessica.garcia@example.com',
    password: hash,
    access: ['user', 'admin'],
    isVerified: true,
    isActive: true,
    profile: {
      firstName: 'Jessica',
      lastName: 'Garcia',
      bio: 'Product manager | Foodie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica_garcia',
    },
    lastLogin: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
]
