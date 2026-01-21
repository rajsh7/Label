'use client'

import React, { useEffect, useState } from 'react'
import { OnboardingTour } from './OnboardingTour'
import { getLabelsBrowserOnboardingSteps } from '@/lib/onboarding/steps'
import { useOnboarding } from '@/hooks/useOnboarding'

/**
 * LabelsBrowserOnboarding component - Shows onboarding tour in labels browser
 */
export const LabelsBrowserOnboarding: React.FC = () => {
  const { shouldShowOnboarding, isLoading, markOnboardingComplete, markOnboardingSkipped } = useOnboarding()
  const [steps] = useState(getLabelsBrowserOnboardingSteps())

  useEffect(() => {
    // Only show labels browser onboarding if user hasn't completed general onboarding
    if (!isLoading && shouldShowOnboarding) {
      const hasSeenLabelsOnboarding = localStorage.getItem('labels_onboarding_seen')
      if (!hasSeenLabelsOnboarding) {
        // Show after a short delay to ensure DOM is ready
        setTimeout(() => {
          localStorage.setItem('labels_onboarding_seen', 'true')
        }, 500)
      }
    }
  }, [isLoading, shouldShowOnboarding])

  const handleComplete = () => {
    markOnboardingComplete()
  }

  const handleSkip = () => {
    markOnboardingSkipped()
  }

  if (isLoading || !shouldShowOnboarding || localStorage.getItem('labels_onboarding_seen')) {
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

export default LabelsBrowserOnboarding

