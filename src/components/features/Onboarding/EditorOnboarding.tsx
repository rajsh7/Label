'use client'

import React, { useEffect, useState } from 'react'
import { OnboardingTour } from './OnboardingTour'
import { getEditorOnboardingSteps } from '@/lib/onboarding/steps'
import { useOnboarding } from '@/hooks/useOnboarding'

/**
 * EditorOnboarding component - Shows onboarding tour in editor
 */
export const EditorOnboarding: React.FC<{ showOnFirstVisit?: boolean }> = ({
  showOnFirstVisit = true,
}) => {
  const { shouldShowOnboarding, isLoading, markOnboardingComplete, markOnboardingSkipped } = useOnboarding()
  const [steps] = useState(getEditorOnboardingSteps())
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show editor onboarding if user hasn't completed general onboarding
    // or if explicitly requested
    if (!isLoading && (shouldShowOnboarding || showOnFirstVisit)) {
      // Check if user has seen editor onboarding before
      const hasSeenEditorOnboarding = localStorage.getItem('editor_onboarding_seen')
      if (!hasSeenEditorOnboarding) {
        setShow(true)
      }
    }
  }, [isLoading, shouldShowOnboarding, showOnFirstVisit])

  const handleComplete = () => {
    localStorage.setItem('editor_onboarding_seen', 'true')
    setShow(false)
    markOnboardingComplete()
  }

  const handleSkip = () => {
    localStorage.setItem('editor_onboarding_seen', 'true')
    setShow(false)
    markOnboardingSkipped()
  }

  if (!show || isLoading) {
    return null
  }

  return (
    <OnboardingTour
      steps={steps}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  )
}

export default EditorOnboarding

