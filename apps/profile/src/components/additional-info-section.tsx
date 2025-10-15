import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  email?: string
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
}

interface AdditionalInfoSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export function AdditionalInfoSection({ user, isOwnProfile, isEditing, onUpdateProfile }: AdditionalInfoSectionProps) {
  const handleAboutChange = (value: string) => {
    onUpdateProfile({ about: value })
  }

  return (
    <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing && isOwnProfile ? (
          <Textarea
            value={user.about || ''}
            onChange={(e) => handleAboutChange(e.target.value)}
            className="resize-none"
            placeholder="Tell others about yourself..."
            rows={4}
          />
        ) : (
          <>
            {user.about ? (
              <p className="text-muted-foreground leading-relaxed">
                {user.about}
              </p>
            ) : (
              <p className="text-muted-foreground leading-relaxed italic">
                {isOwnProfile ? 'Add a bio to tell others about yourself.' : 'No bio available.'}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}