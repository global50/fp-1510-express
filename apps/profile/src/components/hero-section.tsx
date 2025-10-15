import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, UserPlus, Loader as Loader2, MapPin } from "lucide-react"
import { useState } from "react"
import { LocationSelector } from "./LocationSelector"
import { LocationItem } from "../types/location"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  contact_info: any[] | null
}

interface HeroSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  isSaving?: boolean
  onEditToggle: () => void
  onSaveChanges: () => void
  onUpdateProfile: (updates: Partial<UserProfile>) => void
  cities: LocationItem[]
  countries: LocationItem[]
  locationString: string
  onAddLocation: (location: LocationItem) => boolean
  onRemoveLocation: (location: LocationItem) => void
  onClearAllLocations: () => void
}

export function HeroSection({
  user,
  isOwnProfile,
  isEditing,
  isSaving = false,
  onEditToggle,
  onSaveChanges,
  onUpdateProfile,
  cities,
  countries,
  locationString,
  onAddLocation,
  onRemoveLocation,
  onClearAllLocations
}: HeroSectionProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const displayName = user.name || user.username || 'User'
  const displayUsername = user.username || user.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleNameChange = (value: string) => {
    onUpdateProfile({ name: value })
  }

  const handleAboutChange = (value: string) => {
    onUpdateProfile({ about: value })
  }

  return (
    <div className="relative w-full mb-8">
      {/* Background Banner */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Profile section below cover */}
      <div className="relative px-6 pb-4">
        {/* Profile picture positioned at bottom left of cover */}
        <Avatar className="w-40 h-40 border-4 border-background shadow-xl -mt-20 relative z-10">
          <AvatarImage src={user.avatar_url || undefined} alt="Profile" />
          <AvatarFallback className="text-2xl text-gray-700">{avatarFallback}</AvatarFallback>
        </Avatar>
        
        {/* Profile info with Follow button */}
        <div className="mt-4 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isEditing && isOwnProfile ? (
                <Input
                  value={user.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="text-3xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Enter your name"
                />
              ) : (
                <h1 className="text-3xl font-bold">{displayName}</h1>
              )}
              {user.badge?.includes('verified') && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              )}
            </div>
            
            <p className="text-muted-foreground mb-2">@{displayUsername}</p>
            
            {isEditing && isOwnProfile ? (
              <Textarea
                value={user.about || ''}
                onChange={(e) => handleAboutChange(e.target.value)}
                className="mb-4 max-w-4xl resize-none"
                placeholder="Tell others about yourself..."
                rows={3}
              />
            ) : (
              <p className="text-foreground mb-4 max-w-2xl">
                {user.about || 'Welcome to my profile!'}
              </p>
            )}

            {isEditing && isOwnProfile ? (
              <div className="mb-4 max-w-2xl">
                <LocationSelector
                  cities={cities}
                  countries={countries}
                  onAddLocation={onAddLocation}
                  onRemoveLocation={onRemoveLocation}
                  onClearAll={onClearAllLocations}
                  maxLocations={3}
                />
              </div>
            ) : (
              locationString && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{locationString}</span>
                </div>
              )
            )}
            
            {/*<div className="flex flex-wrap gap-2">
              {user.profile_type && (
                <Badge variant="secondary">
                  {user.profile_type}
                </Badge>
              )}
              {user.badge?.filter(b => b !== 'verified').map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>*/}
          </div>
           
          {/* Follow button positioned on the right */}
          <div className="ml-6 mt-2 flex gap-3">
            {isOwnProfile ? (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="px-6 py-2 rounded-full font-medium transition-colors"
                      onClick={onEditToggle}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="px-6 py-2 rounded-full font-medium transition-colors"
                      onClick={onSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    className="px-6 py-2 rounded-full font-medium transition-colors"
                    onClick={onEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  className="px-4 py-2 rounded-full font-medium transition-colors"
                  onClick={() => {/* TODO: Implement messages navigation */}}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  variant="outline"
                  className="px-6 py-2 rounded-full font-medium transition-colors"
                >
                  {!isFollowing && <UserPlus className="w-4 h-4 mr-2" />}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}