import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
}

interface AuthContextValue extends AuthState {
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, nombreCompleto: string, extra?: { fecha_nacimiento?: string; direccion?: string; direccion_lat?: number; direccion_lng?: number; frase_secreta?: string }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

async function fetchProfile(user: User): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      console.error('Error fetching profile:', error)
      return null
    }

    const profile = data as Profile

    // Sync nombre from user_metadata if profile has it empty
    const metaNombre = user.user_metadata?.nombre_completo as string | undefined
    if (metaNombre && !profile.nombre_completo) {
      await supabase
        .from('profiles')
        .update({ nombre_completo: metaNombre })
        .eq('id', user.id)
      profile.nombre_completo = metaNombre
    }

    return profile
  } catch (err) {
    console.error('Unexpected error fetching profile:', err)
    return null
  }
}

// Validate secret phrase outside of fetchProfile to avoid triggering auth loops
let fraseValidated = false
async function validateFraseSecreta(user: User, profile: Profile): Promise<Profile> {
  if (fraseValidated) return profile
  const metaFrase = user.user_metadata?.frase_secreta as string | undefined
  if (!metaFrase || profile.tiene_acceso_secreto) {
    fraseValidated = true
    return profile
  }
  fraseValidated = true
  try {
    const { data: esValida } = await supabase.rpc('validar_frase_secreta', {
      frase_input: metaFrase,
    })
    if (esValida) {
      profile.tiene_acceso_secreto = true
    }
    // Clear frase_secreta from user_metadata (this triggers onAuthStateChange but fraseValidated flag prevents loop)
    await supabase.auth.updateUser({
      data: { frase_secreta: null },
    })
  } catch (err) {
    console.error('Error validating secret phrase:', err)
  }
  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,
  })

  // Safety timeout: if auth never finishes initializing, force it after 10s
  useEffect(() => {
    if (!state.initialized) {
      const timeout = setTimeout(() => {
        setState(prev => {
          if (!prev.initialized) {
            console.warn('Auth initialization timed out — forcing loaded state')
            return { ...prev, loading: false, initialized: true }
          }
          return prev
        })
      }, 10000)
      return () => clearTimeout(timeout)
    }
  }, [state.initialized])

  const refreshProfile = useCallback(async () => {
    if (!state.user) return
    const profile = await fetchProfile(state.user)
    setState(prev => ({ ...prev, profile }))
  }, [state.user])

  useEffect(() => {
    let isSubscribed = true

    // Use onAuthStateChange as the single source of truth.
    // INITIAL_SESSION fires immediately from localStorage (no network needed),
    // then TOKEN_REFRESHED / SIGNED_OUT fire as the session is validated.
    // This avoids the previous race-condition where a slow getSession would
    // time out and incorrectly log the user out.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isSubscribed) return

        if (session?.user) {
          // Set user immediately so ProtectedRoute unblocks right away
          setState(prev => ({
            ...prev,
            user: session.user,
            session,
            loading: false,
            initialized: true,
          }))
          // Load profile in background
          let profile = await fetchProfile(session.user)
          if (!isSubscribed) return
          if (profile) profile = await validateFraseSecreta(session.user, profile)
          if (!isSubscribed) return
          setState(prev => ({ ...prev, profile }))
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      }
    )

    return () => {
      isSubscribed = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    nombreCompleto: string,
    extra?: { fecha_nacimiento?: string; direccion?: string; direccion_lat?: number; direccion_lng?: number; frase_secreta?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: nombreCompleto,
          ...extra,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    // Clear Supabase localStorage keys immediately
    const keysToRemove = Object.keys(localStorage).filter(
      (key) => key.startsWith('sb-') || key.includes('supabase')
    )
    keysToRemove.forEach((key) => localStorage.removeItem(key))

    // Clear state FIRST, don't wait for Supabase
    setState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: true,
    })

    // Reset frase validation flag for next login
    fraseValidated = false

    // Then try to sign out from Supabase (fire and forget)
    supabase.auth.signOut({ scope: 'local' }).catch(() => {})
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-password`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const value: AuthContextValue = {
    ...state,
    isAdmin: state.profile?.role === 'admin',
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
