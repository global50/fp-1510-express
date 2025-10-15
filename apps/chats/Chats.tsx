import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MessageSquare, Users, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ChatItem } from "./components/ChatItem"
import { useChatsData } from "./hooks/use-chats-data"
import { useState } from "react"

export function Chats() {
  const { chats, loading, activeChat, handleChatClick, getTotalUnreadCount } = useChatsData()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const LoadingSkeleton = () => (
    <div className="space-y-3 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center m-4">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No chats yet</h3>
      <p className="text-muted-foreground text-sm">
        Start a conversation to see your chats here
      </p>
    </div>
  )

  return (
    <Card className="h-full w-full flex flex-col lg:w-80 lg:flex-shrink-0 shadow-sm">
      
      <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
        {/* Search */}
        <div className="border-b border-border">
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredChats.length === 0 ? (
            searchQuery ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No chats found for "{searchQuery}"</p>
              </div>
            ) : (
              <EmptyState />
            )
          ) : (
            <ScrollArea className="h-full">
              <div className="py-2">
                {filteredChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    id={chat.id}
                    name={chat.name}
                    avatar={chat.avatar}
                    lastMessage={chat.lastMessage}
                    timestamp={chat.timestamp}
                    unreadCount={chat.unreadCount}
                    isActive={activeChat === chat.id}
                    onClick={handleChatClick}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}