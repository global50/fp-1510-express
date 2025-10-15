import { useState, useEffect } from 'react'
import { Chat } from '../types/chat'

// Test data for development
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastMessage: 'Hey! How are you doing today?',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Thanks for the help with the project!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isOnline: false,
    lastSeen: '1h ago'
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastMessage: 'Can we schedule a meeting for tomorrow?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    isOnline: true
  },
  {
    id: '4',
    name: 'David Brown',
    lastMessage: 'The documents are ready for review',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isOnline: false,
    lastSeen: '2h ago'
  },
  {
    id: '5',
    name: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastMessage: 'Looking forward to our collaboration!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 3,
    isOnline: true
  },
  {
    id: '6',
    name: 'Frank Miller',
    lastMessage: 'Great work on the presentation',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isOnline: false,
    lastSeen: '6h ago'
  },
  {
    id: '7',
    name: 'Grace Wilson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    lastMessage: 'Let me know when you are available',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isOnline: false,
    lastSeen: '1d ago'
  },
  {
    id: '8',
    name: 'Henry Taylor',
    lastMessage: 'The meeting has been rescheduled',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    isOnline: false,
    lastSeen: '2d ago'
  }
]

export function useChatsData() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeChat, setActiveChat] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setChats(mockChats)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId)
    // Here you would typically navigate to the chat or open it in a chat view
    console.log('Opening chat:', chatId)
  }

  const getTotalUnreadCount = () => {
    return chats.reduce((total, chat) => total + chat.unreadCount, 0)
  }

  return {
    chats,
    loading,
    activeChat,
    handleChatClick,
    getTotalUnreadCount
  }
}