// seed/messageData.js
export const getMessages = (users, rooms) => {
  // Helper to get user by username
  const getUserId = (username) => {
    const user = users.find(u => u.username === username)
    return user ? user._id : users[0]._id
  }

  // Helper to get room by roomId
  const getRoomId = (roomId) => {
    const room = rooms.find(r => r.roomId === roomId)
    return room ? room._id : rooms[0]._id
  }

  // Helper to create a timestamp
  const getTimestamp = (minutesAgo) => new Date(Date.now() - minutesAgo * 60 * 1000)

  const messages = []

  // Travel Room Messages
  const travelRoomId = getRoomId('travel-room')
  messages.push(
    {
      roomId: travelRoomId,
      userId: getUserId('lisa_brown'),
      content: 'Hey everyone! Just booked my tickets to Japan for next month! 🇯🇵',
      messageType: 'text',
      createdAt: getTimestamp(120)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('john_doe'),
      content: 'That\'s amazing Lisa! I was there last year. You HAVE to visit Kyoto!',
      messageType: 'text',
      createdAt: getTimestamp(115)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('sarah_smith'),
      content: 'I\'m so jealous! I\'ve always wanted to see the cherry blossoms 🌸',
      messageType: 'text',
      createdAt: getTimestamp(110)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('jessica_garcia'),
      content: 'Don\'t forget to try authentic ramen! The food there is incredible',
      messageType: 'text',
      createdAt: getTimestamp(105)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('lisa_brown'),
      content: 'Thanks for the tips! Any specific restaurant recommendations?',
      messageType: 'text',
      createdAt: getTimestamp(100)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('david_taylor'),
      content: 'I can share my Tokyo photography spots if you\'re interested!',
      messageType: 'text',
      createdAt: getTimestamp(95)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('lisa_brown'),
      content: 'That would be perfect David! I\'m bringing my new camera',
      messageType: 'text',
      createdAt: getTimestamp(90)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('john_doe'),
      content: 'Check out teamLab Borderless - it\'s an amazing digital art museum',
      messageType: 'text',
      createdAt: getTimestamp(85)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Speaking of travel, anyone been to Iceland? Planning a trip there',
      messageType: 'text',
      createdAt: getTimestamp(80)
    },
    {
      roomId: travelRoomId,
      userId: getUserId('jessica_garcia'),
      content: 'Iceland is on my bucket list! Northern lights season is coming up',
      messageType: 'text',
      createdAt: getTimestamp(75)
    }
  )

  // Tech Room Messages
  const techRoomId = getRoomId('tech-room')
  messages.push(
    {
      roomId: techRoomId,
      userId: getUserId('alex_chen'),
      content: 'Has anyone tried the new React 19 features yet?',
      messageType: 'text',
      createdAt: getTimestamp(60)
    },
    {
      roomId: techRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Yes! The new compiler optimizations are impressive',
      messageType: 'text',
      createdAt: getTimestamp(55)
    },
    {
      roomId: techRoomId,
      userId: getUserId('emma_wilson'),
      content: 'We\'re still on React 18. Is the migration worth it?',
      messageType: 'text',
      createdAt: getTimestamp(50)
    },
    {
      roomId: techRoomId,
      userId: getUserId('john_doe'),
      content: 'Depends on your use case. The performance gains are real though',
      messageType: 'text',
      createdAt: getTimestamp(45)
    },
    {
      roomId: techRoomId,
      userId: getUserId('alex_chen'),
      content: 'I can share our migration guide if that helps',
      messageType: 'text',
      createdAt: getTimestamp(40)
    },
    {
      roomId: techRoomId,
      userId: getUserId('david_taylor'),
      content: 'That would be great! Also, anyone using the new CSS container queries?',
      messageType: 'text',
      createdAt: getTimestamp(35)
    },
    {
      roomId: techRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Container queries are a game changer for responsive design!',
      messageType: 'text',
      createdAt: getTimestamp(30)
    },
    {
      roomId: techRoomId,
      userId: getUserId('emma_wilson'),
      content: 'BTW, there\'s a security patch for Node.js. Everyone should update',
      messageType: 'text',
      createdAt: getTimestamp(25)
    },
    {
      roomId: techRoomId,
      userId: getUserId('alex_chen'),
      content: 'Thanks for the heads up Emma! Will update our servers today',
      messageType: 'text',
      createdAt: getTimestamp(20)
    },
    {
      roomId: techRoomId,
      userId: getUserId('john_doe'),
      content: 'Anyone going to the tech conference next week?',
      messageType: 'text',
      createdAt: getTimestamp(15)
    }
  )

  // Sales Meeting Messages
  const salesRoomId = getRoomId('sales-meeting')
  messages.push(
    {
      roomId: salesRoomId,
      userId: getUserId('mike_jones'),
      content: 'Good morning team! Let\'s review Q4 targets',
      messageType: 'text',
      createdAt: getTimestamp(180)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('lisa_brown'),
      content: 'Marketing campaigns are ready to support the push',
      messageType: 'text',
      createdAt: getTimestamp(175)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('jessica_garcia'),
      content: 'Product team has the new features ready for demo',
      messageType: 'text',
      createdAt: getTimestamp(170)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('mike_jones'),
      content: 'Excellent! We\'re 15% ahead of last quarter already',
      messageType: 'text',
      createdAt: getTimestamp(165)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('sarah_smith'),
      content: 'The enterprise clients are showing strong interest',
      messageType: 'text',
      createdAt: getTimestamp(160)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('lisa_brown'),
      content: 'Should we increase ad spend for the holiday season?',
      messageType: 'text',
      createdAt: getTimestamp(155)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('mike_jones'),
      content: 'Let\'s discuss budget allocation in tomorrow\'s meeting',
      messageType: 'text',
      createdAt: getTimestamp(150)
    },
    {
      roomId: salesRoomId,
      userId: getUserId('jessica_garcia'),
      content: 'I\'ll prepare the ROI projections',
      messageType: 'text',
      createdAt: getTimestamp(145)
    }
  )

  // General Chat Messages
  const generalRoomId = getRoomId('general-chat')
  messages.push(
    {
      roomId: generalRoomId,
      userId: getUserId('emma_wilson'),
      content: 'Welcome to the general chat everyone! Feel free to discuss anything here',
      messageType: 'text',
      isSystemMessage: true,
      createdAt: getTimestamp(300)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('john_doe'),
      content: 'Thanks for setting this up Emma!',
      messageType: 'text',
      createdAt: getTimestamp(295)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('alex_chen'),
      content: 'Anyone up for virtual coffee break? ☕',
      messageType: 'text',
      createdAt: getTimestamp(10)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Count me in! Need a break from debugging',
      messageType: 'text',
      createdAt: getTimestamp(8)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('david_taylor'),
      content: 'Same here! Just finished a long design session',
      messageType: 'text',
      createdAt: getTimestamp(6)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('lisa_brown'),
      content: 'Perfect timing! I\'ll grab my coffee',
      messageType: 'text',
      createdAt: getTimestamp(4)
    },
    {
      roomId: generalRoomId,
      userId: getUserId('mike_jones'),
      content: 'Quick reminder: Team lunch tomorrow at 12:30!',
      messageType: 'text',
      createdAt: getTimestamp(2)
    }
  )

  // Project Alpha Messages
  const projectRoomId = getRoomId('project-alpha')
  messages.push(
    {
      roomId: projectRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Project Alpha kickoff meeting notes are in the shared drive',
      messageType: 'text',
      createdAt: getTimestamp(240)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('alex_chen'),
      content: 'Backend API endpoints are ready for testing',
      messageType: 'text',
      createdAt: getTimestamp(235)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('john_doe'),
      content: 'Great! I\'ll start integration with the frontend today',
      messageType: 'text',
      createdAt: getTimestamp(230)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('david_taylor'),
      content: 'UI mockups v2 are ready for review',
      messageType: 'text',
      createdAt: getTimestamp(225)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('emma_wilson'),
      content: 'Security review scheduled for next Tuesday',
      messageType: 'text',
      createdAt: getTimestamp(220)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('sarah_smith'),
      content: 'Perfect. We\'re on track for the milestone',
      messageType: 'text',
      createdAt: getTimestamp(215)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('alex_chen'),
      content: 'Database migrations completed successfully',
      messageType: 'text',
      createdAt: getTimestamp(210)
    },
    {
      roomId: projectRoomId,
      userId: getUserId('john_doe'),
      content: 'Awesome! No blockers from my side',
      messageType: 'text',
      createdAt: getTimestamp(205)
    }
  )

  return messages
}