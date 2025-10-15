import { useState, useEffect, useCallback } from 'react'
import { useAuthContext } from '@/components/auth-provider'

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
  created_at?: string
}

interface ProfileState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  isOwnProfile: boolean
  requestedUsername: string | null
  redirectPath: string | null
}

export function useProfileData() {
  const [profileState, setProfileState] = useState<ProfileState>({
    user: null,
    isLoading: true,
    error: null,
    isOwnProfile: false,
    requestedUsername: null,
    redirectPath: null
  })

  // Get authenticated user data
  const { user: authUser, profile: authProfile, isAuthenticated } = useAuthContext()

  // Extract username from URL
  const extractUsernameFromUrl = useCallback((): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('username')
    
    if (username) {
      console.log('Extracted username from query params:', username)
      return username
    }

    // Fallback: try to extract from path if no query param
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      // Simple validation for username format
      if (/^[a-zA-Z0-9_-]{3,30}$/.test(lastSegment)) {
        console.log('Extracted username from path:', lastSegment)
        return lastSegment
      }
    }

    console.log('No username found in URL')
    return null
  }, [])

  // Direct fetch from Express Backend API
  const fetchProfileByUsername = async (username: string): Promise<UserProfile | null> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    if (!apiUrl) {
      throw new Error('API URL configuration missing. Please check your environment variables.')
    }

    const apiEndpoint = `${apiUrl}/api/profile/fetch-by-username`

    console.log('Fetching profile for username:', username)
    console.log('API Endpoint:', apiEndpoint)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('API response data:', data)

      return data.profile || null
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  useEffect(() => {
    const initializeProfileData = async () => {
      try {
        const requestedUsername = extractUsernameFromUrl()
        
        setProfileState(prev => ({
          ...prev,
          requestedUsername,
          isLoading: true,
          error: null,
          redirectPath: null
        }))

        if (!requestedUsername) {
          // User navigated to /profile - redirect to their own profile if authenticated
          if (isAuthenticated && authProfile?.username) {
            setProfileState(prev => ({
              ...prev,
              isLoading: false,
              redirectPath: `/${authProfile.username}`
            }))
          } else {
            setProfileState(prev => ({
              ...prev,
              isLoading: false,
              error: isAuthenticated ? 'Profile username not found' : 'Please sign in to view your profile'
            }))
          }
        } else {
          // User navigated to /:username - fetch that profile
          console.log('Fetching public profile for username:', requestedUsername)
          
          try {
            const profileData = await fetchProfileByUsername(requestedUsername)
            
            if (profileData) {
              const isOwnProfile = isAuthenticated && authProfile?.username === requestedUsername
              
              setProfileState(prev => ({
                ...prev,
                user: profileData,
                isLoading: false,
                error: null,
                isOwnProfile
              }))
            } else {
              // Profile not found
              setProfileState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Profile not found',
                user: null
              }))

            }
          } catch (error) {
            console.error('Failed to fetch profile:', error)
            setProfileState(prev => ({
              ...prev,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to load profile'
            }))
          }
        }
      } catch (error) {
        console.error('Failed to initialize profile data:', error)
        setProfileState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize profile system'
        }))
      }
    }

    initializeProfileData()
  }, [extractUsernameFromUrl, isAuthenticated, authProfile?.username])

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (profileState.user && profileState.isOwnProfile) {
      const newProfile = { ...profileState.user, ...updatedProfile }
      
      // Update local state
      setProfileState(prev => ({
        ...prev,
        user: newProfile
      }))
    }
  }

  const refetchProfile = async () => {
    const currentUsername = profileState.requestedUsername
    if (!currentUsername) {
      console.warn('[Profile Refetch] No username available to refetch')
      return
    }

    console.log('[Profile Refetch] Starting profile refetch for username:', currentUsername)

    try {
      setProfileState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }))

      const profileData = await fetchProfileByUsername(currentUsername)

      if (profileData) {
        const isOwnProfile = isAuthenticated && authProfile?.username === currentUsername

        console.log('[Profile Refetch] Successfully refetched profile:', {
          username: profileData.username,
          isOwnProfile
        })

        setProfileState(prev => ({
          ...prev,
          user: profileData,
          isLoading: false,
          error: null,
          isOwnProfile
        }))
      } else {
        console.warn('[Profile Refetch] Profile not found after refetch')
        setProfileState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Profile not found'
        }))
      }
    } catch (error) {
      console.error('[Profile Refetch] Failed to refetch profile:', error)
      setProfileState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reload profile'
      }))
    }
  }

  const logout = () => {
    setProfileState(prev => ({
      ...prev,
      user: null,
      isOwnProfile: false
    }))
  }

  return {
    ...profileState,
    updateProfile,
    refetchProfile,
    logout,
  }
}