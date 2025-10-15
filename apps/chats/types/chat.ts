export interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline?: boolean
  lastSeen?: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}