import { ContactsSection } from "./contacts-section"
import { ExperienceSection } from "./experience-section"
import { AwardsSection } from "./awards-section"
import { AdditionalInfoSection } from "./additional-info-section"

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

interface InformationSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export function InformationSection({ user, isOwnProfile, isEditing, onUpdateProfile }: InformationSectionProps) {
  return (
    <div className="space-y-6">
      <ContactsSection user={user} isOwnProfile={isOwnProfile} isEditing={isEditing} onUpdateProfile={onUpdateProfile} />
      <ExperienceSection isEditing={isEditing} />
      <AwardsSection isEditing={isEditing} />
      <AdditionalInfoSection user={user} isOwnProfile={isOwnProfile} isEditing={isEditing} onUpdateProfile={onUpdateProfile} />
    </div>
  )
}