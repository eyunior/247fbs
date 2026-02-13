import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'
import type { UserProfile } from '../types/profile'
import { defaultProfile } from '../types/profile'

interface ProfileContextType {
  profile: UserProfile | null
  profileLoading: boolean
  profileCompleted: boolean
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
  createProfile: (data: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ error: Error | null }>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setProfileLoading(false)
      return
    }

    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        // No profile found — user needs onboarding
        setProfile(null)
      } else {
        setProfile(data as UserProfile)
      }
    } catch {
      // Table might not exist yet — treat as no profile
      setProfile(null)
    }
    setProfileLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const profileCompleted = profile?.profile_completed ?? false

  const createProfile = async (data: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: new Error('Not authenticated') }

    // Serialize arrays to JSON strings for Supabase text columns
    // Exclude is_admin so we never overwrite it from the client
    const { is_admin: _ignoreAdmin, ...safeDefaults } = defaultProfile
    const { is_admin: _ignoreAdminData, ...safeData } = data as Record<string, unknown>
    const row = {
      id: user.id,
      ...safeDefaults,
      ...safeData,
      equipment_types: JSON.stringify(data.equipment_types ?? defaultProfile.equipment_types),
      preferred_states: JSON.stringify(data.preferred_states ?? defaultProfile.preferred_states),
      profile_completed: true,
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(row)
      .select()
      .single()

    if (error) return { error: error as unknown as Error }

    await fetchProfile()
    return { error: null }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') }

    const payload: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() }
    // Serialize arrays if present
    if (updates.equipment_types) payload.equipment_types = JSON.stringify(updates.equipment_types)
    if (updates.preferred_states) payload.preferred_states = JSON.stringify(updates.preferred_states)

    const { error } = await supabase
      .from('user_profiles')
      .update(payload)
      .eq('id', user.id)

    if (error) return { error: error as unknown as Error }

    await fetchProfile()
    return { error: null }
  }

  return (
    <ProfileContext.Provider
      value={{ profile, profileLoading, profileCompleted, fetchProfile, updateProfile, createProfile }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

