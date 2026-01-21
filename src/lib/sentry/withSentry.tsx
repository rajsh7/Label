/**
 * HOC to wrap components with Sentry error tracking
 */

'use client'

import { useEffect } from 'react'
import { initSentry, setUserContext, clearUserContext } from './config'
import { supabase } from '@/lib/supabase/client'

/**
 * Initialize Sentry on client-side mount
 */
export function useSentryInit() {
  useEffect(() => {
    initSentry().catch((error) => {
      console.error('Failed to initialize Sentry:', error)
    })
  }, [])
}

/**
 * Set up user context tracking
 */
export function useSentryUser() {
  useEffect(() => {
    const setupUserContext = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          await setUserContext(user.id, user.email || undefined, {
            email: user.email,
          })
        } else {
          await clearUserContext()
        }
      } catch (error) {
        console.error('Failed to set up Sentry user context:', error)
      }
    }

    setupUserContext()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await setUserContext(session.user.id, session.user.email || undefined, {
          email: session.user.email,
        })
      } else {
        await clearUserContext()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
