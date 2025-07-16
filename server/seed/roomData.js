// seed/roomData.js
export const getRooms = (users) => {
  // Helper to get user by username
  const getUserId = (username) => {
    const user = users.find((u) => u.username === username)
    return user ? user._id : users[0]._id
  }

  return [
    {
      name: 'Travel Adventures',
      roomId: 'travel-room',
      createdBy: getUserId('lisa_brown'),
      participants: [
        getUserId('lisa_brown'),
        getUserId('john_doe'),
        getUserId('sarah_smith'),
        getUserId('jessica_garcia'),
        getUserId('david_taylor'),
      ],
      isPrivate: false,
      isActive: true,
      lastActivity: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      messageCount: 0, // Will be updated when messages are created
    },
    {
      name: 'Tech Talk',
      roomId: 'tech-room',
      createdBy: getUserId('alex_chen'),
      participants: [
        getUserId('alex_chen'),
        getUserId('sarah_smith'),
        getUserId('emma_wilson'),
        getUserId('john_doe'),
        getUserId('david_taylor'),
      ],
      isPrivate: false,
      isActive: true,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      messageCount: 0,
    },
    {
      name: 'Sales Team Meeting',
      roomId: 'sales-meeting',
      createdBy: getUserId('mike_jones'),
      participants: [
        getUserId('mike_jones'),
        getUserId('lisa_brown'),
        getUserId('jessica_garcia'),
        getUserId('sarah_smith'),
      ],
      isPrivate: true,
      isActive: true,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      messageCount: 0,
    },
    {
      name: 'General Discussion',
      roomId: 'general-chat',
      createdBy: getUserId('emma_wilson'),
      participants: users.map((u) => u._id), // All users
      isPrivate: false,
      isActive: true,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      messageCount: 0,
    },
    {
      name: 'Project Alpha',
      roomId: 'project-alpha',
      createdBy: getUserId('sarah_smith'),
      participants: [
        getUserId('sarah_smith'),
        getUserId('alex_chen'),
        getUserId('john_doe'),
        getUserId('emma_wilson'),
        getUserId('david_taylor'),
      ],
      isPrivate: true,
      isActive: true,
      lastActivity: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      messageCount: 0,
    },
  ]
}
