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
  signUp: (email: string, password: string, nombreCompleto: string, extra?: { fecha_nacimiento?: string; direccion?: string; direccion_lat?: number; direccion_lng?: number }) => Promise<{ error: string | null }>
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

    const processSession = async (session: Session | null) => {
      if (!isSubscribed) return
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user)
          if (!isSubscribed) return
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            initialized: true,
          })
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      } catch (err) {
        console.error('Error processing session:', err)
        if (!isSubscribed) return
        setState({
          user: session?.user ?? null,
          session: session ?? null,
          profile: null,
          loading: false,
          initialized: true,
        })
      }
    }

    // 1. Get initial session explicitly (reliable on refresh)
    supabase.auth.getSession()
      .then(({ data: { session } }) => processSession(session))
      .catch((err) => {
        console.error('Error getting session:', err)
        if (isSubscribed) {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true,
          })
        }
      })

    // 2. Listen for subsequent auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return // Already handled by getSession
        await processSession(session)
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
    extra?: { fecha_nacimiento?: string; direccion?: string; direccion_lat?: number; direccion_lng?: number }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: nombreCompleto,
          ...extra,
        },
      },
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (err) {
      console.error('Error signing out:', err)
    }
    // Always clear state even if signOut fails
    setState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: true,
    })
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
