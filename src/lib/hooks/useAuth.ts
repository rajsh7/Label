'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
}

/**
 * Custom hook to get current user authentication state
 * Returns user, session, loading state, and logout function
 */
export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: error ? new Error(error.message) : null,
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      })

      // Redirect to login if user signs out
      if (_event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Logout failed'),
      }))
    }
  }

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    logout,
    isAuthenticated: !!authState.user,
  }
}

