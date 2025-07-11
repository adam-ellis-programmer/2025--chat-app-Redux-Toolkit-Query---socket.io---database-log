// Dummy data for chat app development

// Current logged in user
export const currentUser = {
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

// Other users in the conversation
export const otherUsers = [
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    _id: "507f1f77bcf86cd799439013",
    name: "Mike Johnson",
    email: "mike@example.com", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }
];

// Dummy conversation
export const dummyConversation = {
  _id: "507f1f77bcf86cd799439021",
  participants: [currentUser, otherUsers[0]],
  lastMessage: "507f1f77bcf86cd799439031",
  lastMessageAt: "2024-01-20T18:35:00.000Z",
  createdAt: "2024-01-18T11:00:00.000Z"
};

// 15 dummy messages with mixed senders
export const dummyMessages = [
  {
    _id: "507f1f77bcf86cd799439031",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "Hey John! How are you doing?",
    messageType: "text",
    createdAt: "2024-01-20T09:00:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439032",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "Hi Jane! I'm doing great, thanks for asking! How about you?",
    messageType: "text",
    createdAt: "2024-01-20T09:02:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439033",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "I'm doing well! Just working on some exciting new projects 🚀",
    messageType: "text",
    createdAt: "2024-01-20T09:05:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439034",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "That sounds awesome! What kind of projects are you working on?",
    messageType: "text",
    createdAt: "2024-01-20T09:07:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439035",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "I'm building a new chat application with React and Node.js. It's been really fun to work on!",
    messageType: "text",
    createdAt: "2024-01-20T09:10:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439036",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "No way! I'm actually working on something similar. What tech stack are you using?",
    messageType: "text",
    createdAt: "2024-01-20T09:12:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439037",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "MERN stack with Socket.IO for real-time messaging. Also using Passport.js for authentication.",
    messageType: "text",
    createdAt: "2024-01-20T09:15:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439038",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "Perfect! We're using almost the exact same stack 😄",
    messageType: "text",
    createdAt: "2024-01-20T09:17:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439039",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "Are you storing JWT tokens in localStorage or using httpOnly cookies?",
    messageType: "text",
    createdAt: "2024-01-20T09:18:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439040",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "Great question! I switched to httpOnly cookies for better security. Much safer than localStorage.",
    messageType: "text",
    createdAt: "2024-01-20T09:20:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439041",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "Smart choice! XSS protection is definitely worth it.",
    messageType: "text",
    createdAt: "2024-01-20T09:22:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439042",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "Exactly! Security should always be a top priority in web development.",
    messageType: "text",
    createdAt: "2024-01-20T09:25:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439043",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "Absolutely! Would love to see your project when it's ready 👍",
    messageType: "text",
    createdAt: "2024-01-20T09:27:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439044",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: otherUsers[0]._id,
    sender: otherUsers[0],
    content: "For sure! I'll send you a link once I deploy it. Maybe we can collaborate on some features?",
    messageType: "text",
    createdAt: "2024-01-20T09:30:00.000Z",
    readBy: []
  },
  {
    _id: "507f1f77bcf86cd799439045",
    conversationId: "507f1f77bcf86cd799439021",
    senderId: currentUser._id,
    sender: currentUser,
    content: "That would be awesome! I'm always up for collaborating on cool projects 🤝",
    messageType: "text",
    createdAt: "2024-01-20T09:35:00.000Z",
    readBy: []
  }
];

// Helper function to check if message is from current user
export const isOwnMessage = (message) => {
  return message.senderId === currentUser._id;
};

// Helper function to format time
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

// Dummy conversations list for sidebar
export const dummyConversations = [
  {
    _id: "507f1f77bcf86cd799439021",
    participants: [
      {
        _id: "507f1f77bcf86cd799439012",
        name: "Jane Smith",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    ],
    lastMessage: {
      content: "That would be awesome! I'm always up for collaborating on cool projects 🤝",
      createdAt: "2024-01-20T09:35:00.000Z"
    },
    unreadCount: 0
  },
  {
    _id: "507f1f77bcf86cd799439022",
    participants: [
      {
        _id: "507f1f77bcf86cd799439013",
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    ],
    lastMessage: {
      content: "Sure! How about 12:30 PM at the usual place?",
      createdAt: "2024-01-20T08:30:00.000Z"
    },
    unreadCount: 2
  },
  {
    _id: "507f1f77bcf86cd799439023",
    participants: [
      {
        _id: "507f1f77bcf86cd799439014",
        name: "Sarah Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    ],
    lastMessage: {
      content: "Thanks for the help with the project!",
      createdAt: "2024-01-19T16:20:00.000Z"
    },
    unreadCount: 0
  }
];

// Usage in React component example:
/*
import { dummyMessages, currentUser, isOwnMessage, formatMessageTime } from './dummyData';

const ChatMessages = () => {
  return (
    <div className="messages-container">
      {dummyMessages.map((message) => (
        <div 
          key={message._id}
          className={`message ${isOwnMessage(message) ? 'own-message' : 'other-message'}`}
        >
          <div className="message-content">
            <p>{message.content}</p>
            <span className="message-time">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
*/