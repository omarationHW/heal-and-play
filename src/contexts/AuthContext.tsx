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
  sessionReady: boolean
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
    console.error('[Auth] Unexpected error fetching profile:', err)
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
  // sessionReady = true only after we've confirmed the JWT works (profile fetched successfully)
  const [sessionReady, setSessionReady] = useState(false)

  const refreshProfile = useCallback(async () => {
    if (!state.user) return
    const profile = await fetchProfile(state.user)
    setState(prev => ({ ...prev, profile }))
  }, [state.user])

  useEffect(() => {
    let cancelled = false
    // Counter to deduplicate concurrent profile fetches — only the latest one wins
    let processId = 0

    // Async profile loading — runs OUTSIDE the onAuthStateChange callback
    // to avoid Supabase internal lock deadlocks.
    async function loadProfile(user: User) {
      const myId = ++processId

      // Yield to next microtask so Supabase releases its internal session lock
      await new Promise(r => setTimeout(r, 0))
      if (cancelled || myId !== processId) return

      let profile = await fetchProfile(user)
      if (cancelled || myId !== processId) return

      // If profile fetch failed, the JWT might be stale — refresh and retry
      if (!profile) {
        console.warn('[Auth] profile fetch failed, refreshing token...')
        try {
          const { data, error } = await supabase.auth.refreshSession()
          if (error) {
            console.error('[Auth] refreshSession error:', error.message)
          } else if (data.session) {
            if (cancelled || myId !== processId) return
            profile = await fetchProfile(data.session.user)
            if (cancelled || myId !== processId) return
            // Update session to the refreshed one
            setState(prev => ({ ...prev, user: data.session!.user, session: data.session! }))
          }
        } catch (e) {
          console.error('[Auth] refreshSession exception:', e)
        }
      }

      if (cancelled || myId !== processId) return

      if (profile) {
        profile = await validateFraseSecreta(user, profile)
        if (cancelled || myId !== processId) return
      }

      setState(prev => ({ ...prev, profile }))
      setSessionReady(true)
    }

    // ─── Subscribe to auth events ───────────────────────────────────────
    // CRITICAL: The callback must be SYNCHRONOUS (no async/await) to avoid
    // blocking Supabase's internal session lock. All async work (DB queries,
    // token refresh) is deferred to loadProfile() which runs outside the lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return

        if (!session?.user) {
          // No session — user is logged out
          processId++ // cancel any pending loadProfile
          setState({ user: null, session: null, profile: null, loading: false, initialized: true })
          setSessionReady(true)
          return
        }

        // Set user/session SYNCHRONOUSLY so ProtectedRoute unblocks immediately
        setState(prev => ({
          ...prev,
          user: session.user,
          session,
          loading: false,
          initialized: true,
        }))

        // TOKEN_REFRESHED = just a new access_token, no need to refetch profile
        if (event === 'TOKEN_REFRESHED') return

        // INITIAL_SESSION, SIGNED_IN, USER_UPDATED — load profile asynchronously
        loadProfile(session.user)
      }
    )

    // Safety timeout: if nothing resolves within 10s, force loaded state
    const safetyTimeout = setTimeout(() => {
      setState(prev => {
        if (!prev.initialized) {
          console.warn('[Auth] initialization timed out — forcing loaded state')
          return { ...prev, loading: false, initialized: true }
        }
        return prev
      })
      setSessionReady(true)
    }, 10000)

    return () => {
      cancelled = true
      processId++ // cancel any pending loadProfile
      clearTimeout(safetyTimeout)
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

    // Reset flags for next login
    fraseValidated = false
    setSessionReady(false)

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
    sessionReady,
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
