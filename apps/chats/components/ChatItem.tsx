import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isThisWeek, isThisYear } from "date-fns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatItemProps {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isActive?: boolean
  onClick: (chatId: string) => void
}

function formatChatTime(dateString: string): string {
  const date = new Date(dateString)
  
  if (isToday(date)) {
    return format(date, 'HH:mm')
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, 'EEE')
  } else if (isThisYear(date)) {
    return format(date, 'MMM d')
  } else {
    return format(date, 'MM/dd/yy')
  }
}

export function ChatItem({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount,
  isActive = false,
  onClick
}: ChatItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-auto p-3 justify-start hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0",
        isActive && "bg-accent"
      )}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center space-x-3 w-full">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-blue-500 text-white font-medium">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm truncate text-foreground">
              {name}
            </h3>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatChatTime(timestamp)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate flex-1 ml-0 text-left">
              {lastMessage}
            </p>
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 p-0">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Button>
  )
}