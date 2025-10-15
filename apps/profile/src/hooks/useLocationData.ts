import { useState, useEffect, useCallback } from 'react'
import { LocationItem, LocationData } from '../types/location'

interface UseLocationDataProps {
  profileId: string | null
  isOwnProfile: boolean
}

interface UseLocationDataReturn {
  cities: LocationItem[]
  countries: LocationItem[]
  isLoading: boolean
  error: string | null
  addLocation: (location: LocationItem) => boolean
  removeLocation: (location: LocationItem) => void
  clearAllLocations: () => void
  hasUnsavedChanges: boolean
  getAllLocations: () => LocationItem[]
  getFormattedLocationString: () => string
  refetchLocations: () => Promise<void>
}

export function useLocationData({ profileId, isOwnProfile }: UseLocationDataProps): UseLocationDataReturn {
  const [cities, setCities] = useState<LocationItem[]>([])
  const [countries, setCountries] = useState<LocationItem[]>([])
  const [initialCities, setInitialCities] = useState<LocationItem[]>([])
  const [initialCountries, setInitialCountries] = useState<LocationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLocationData = useCallback(async () => {
    if (!profileId) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing')
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/fetch-additional-profile-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ profile_id: profileId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch location data')
      }

      const data = await response.json()

      if (data.success && data.location_data) {
        setCities(data.location_data.cities || [])
        setCountries(data.location_data.countries || [])
        setInitialCities(data.location_data.cities || [])
        setInitialCountries(data.location_data.countries || [])
      }
    } catch (err) {
      console.error('Error fetching location data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load location data')
    } finally {
      setIsLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    fetchLocationData()
  }, [fetchLocationData])

  const getAllLocations = useCallback((): LocationItem[] => {
    return [...cities, ...countries]
  }, [cities, countries])

  const addLocation = useCallback((location: LocationItem): boolean => {
    const currentLocations = getAllLocations()

    if (currentLocations.length >= 3) {
      return false
    }

    const exists = currentLocations.some(
      loc => loc.type === location.type && loc.id === location.id
    )

    if (exists) {
      return false
    }

    if (location.type === 'city') {
      setCities(prev => [...prev, location])
    } else {
      setCountries(prev => [...prev, location])
    }

    return true
  }, [getAllLocations])

  const removeLocation = useCallback((location: LocationItem) => {
    if (location.type === 'city') {
      setCities(prev => prev.filter(c => c.id !== location.id))
    } else {
      setCountries(prev => prev.filter(c => c.id !== location.id))
    }
  }, [])

  const clearAllLocations = useCallback(() => {
    setCities([])
    setCountries([])
  }, [])

  const hasUnsavedChanges = useCallback((): boolean => {
    const currentCityIds = cities.map(c => c.id).sort()
    const initialCityIds = initialCities.map(c => c.id).sort()
    const currentCountryIds = countries.map(c => c.id).sort()
    const initialCountryIds = initialCountries.map(c => c.id).sort()

    return (
      JSON.stringify(currentCityIds) !== JSON.stringify(initialCityIds) ||
      JSON.stringify(currentCountryIds) !== JSON.stringify(initialCountryIds)
    )
  }, [cities, countries, initialCities, initialCountries])()

  const getFormattedLocationString = useCallback((): string => {
    const allLocations = [...cities, ...countries]

    if (allLocations.length === 0) {
      return ''
    }

    return allLocations.map(loc => loc.name).join(', ')
  }, [cities, countries])

  const refetchLocations = useCallback(async () => {
    await fetchLocationData()
  }, [fetchLocationData])

  return {
    cities,
    countries,
    isLoading,
    error,
    addLocation,
    removeLocation,
    clearAllLocations,
    hasUnsavedChanges,
    getAllLocations,
    getFormattedLocationString,
    refetchLocations
  }
}
