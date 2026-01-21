'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface OnboardingState {
  shouldShowOnboarding: boolean
  onboardingCompleted: boolean
  onboardingSkipped: boolean
  isLoading: boolean
}

/**
 * Hook to manage onboarding state
 */
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    shouldShowOnboarding: false,
    onboardingCompleted: false,
    onboardingSkipped: false,
    isLoading: true,
  })
  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState({
          shouldShowOnboarding: false,
          onboardingCompleted: false,
          onboardingSkipped: false,
          isLoading: false,
        })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, onboarding_skipped')
        .eq('id', user.id)
        .single()

      const completed = profile?.onboarding_completed || false
      const skipped = profile?.onboarding_skipped || false

      setState({
        shouldShowOnboarding: !completed && !skipped,
        onboardingCompleted: completed,
        onboardingSkipped: skipped,
        isLoading: false,
      })
    } catch (error) {
      console.error('Check onboarding status error:', error)
      setState({
        shouldShowOnboarding: false,
        onboardingCompleted: false,
        onboardingSkipped: false,
        isLoading: false,
      })
    }
  }

  const markOnboardingComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      setState((prev) => ({
        ...prev,
        shouldShowOnboarding: false,
        onboardingCompleted: true,
      }))
    } catch (error) {
      console.error('Mark onboarding complete error:', error)
    }
  }

  const markOnboardingSkipped = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ onboarding_completed: true, onboarding_skipped: true })
        .eq('id', user.id)

      setState((prev) => ({
        ...prev,
        shouldShowOnboarding: false,
        onboardingSkipped: true,
      }))
    } catch (error) {
      console.error('Mark onboarding skipped error:', error)
    }
  }

  const restartOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ onboarding_completed: false, onboarding_skipped: false })
        .eq('id', user.id)

      setState((prev) => ({
        ...prev,
        shouldShowOnboarding: true,
        onboardingCompleted: false,
        onboardingSkipped: false,
      }))
    } catch (error) {
      console.error('Restart onboarding error:', error)
    }
  }

  return {
    ...state,
    markOnboardingComplete,
    markOnboardingSkipped,
    restartOnboarding,
    checkOnboardingStatus,
  }
}

