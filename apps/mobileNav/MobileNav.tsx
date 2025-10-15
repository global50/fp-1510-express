import { Home, User, MessageSquare, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, profile } = useAuthContext()

  // Determine profile path based on authentication status
  const getProfilePath = () => {
    if (isAuthenticated && profile?.username) {
      return `/${profile.username}`
    }
    return '/auth'
  }

  // Generate navigation items dynamically to ensure fresh profile path
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: getProfilePath() },
    { icon: MessageSquare, label: "Messages", path: "/chats" },
  ]

  const allNavigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: getProfilePath() },
    { icon: MessageSquare, label: "Messages", path: "/chats" },
  ]

  const handleChatsToggle = () => {
    // This will be handled by the parent component
    // For now, we'll just show a placeholder action
    console.log("Toggle Chats")
  }

  return (
    <>
      {/* Bottom Fixed Navigation Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Navigation Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center h-12 w-12 p-1"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {allNavigationItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start h-12 px-4 ${
                      location.pathname === item.path
                        ? "bg-blue-500 hover:bg-blue-600 text-white" 
                        : "hover:bg-accent/50 transition-colors"
                    }`}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center justify-center h-12 w-12 p-1 ${
              location.pathname === "/" ? "text-blue-500" : ""
            }`}
            asChild
          >
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
          </Button>

          {/* Profile Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center justify-center h-12 w-12 p-1 ${
              location.pathname === getProfilePath() ? "text-blue-500" : ""
            }`}
            asChild
          >
            <Link to={getProfilePath()}>
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </Button>

          {/* Chats Toggle Button */}
          <Button
  variant="ghost"
  size="sm"
  className={`flex flex-col items-center justify-center h-12 w-12 p-1 ${
    location.pathname === "/chats" ? "text-blue-500" : ""
  }`}
  asChild
  onClick={() => setIsOpen(false)}
>
  <Link to="/chats">
    <MessageSquare className="h-5 w-5" />
    <span className="text-xs mt-1">Messages</span>
  </Link>
</Button>
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind the fixed nav */}
      <div className="md:hidden h-16"></div>
    </>
  )
}