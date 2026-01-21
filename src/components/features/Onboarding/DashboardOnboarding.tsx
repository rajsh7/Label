'use client'

import React, { useState } from 'react'
import { OnboardingTour } from './OnboardingTour'
import { getDashboardOnboardingSteps } from '@/lib/onboarding/steps'
import { useOnboarding } from '@/hooks/useOnboarding'

/**
 * DashboardOnboarding component - Shows onboarding tour on dashboard
 */
export const DashboardOnboarding: React.FC = () => {
  const { shouldShowOnboarding, isLoading, markOnboardingComplete, markOnboardingSkipped } = useOnboarding()
  const [steps] = useState(getDashboardOnboardingSteps())

  if (isLoading || !shouldShowOnboarding) {
    return null
  }

  return (
    <OnboardingTour
      steps={steps}
      onComplete={markOnboardingComplete}
      onSkip={markOnboardingSkipped}
    />
  )
}

export default DashboardOnboarding

