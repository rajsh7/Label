'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: {
    label: string
    onClick: () => void
  }
}

interface OnboardingTourProps {
  steps: OnboardingStep[]
  onComplete?: () => void
  onSkip?: () => void
}

/**
 * OnboardingTour component - Interactive tour guide for new users
 */
export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setIsOpen(true)
      highlightTargetElement(steps[currentStep])
    } else {
      setIsOpen(false)
    }
  }, [currentStep, steps])

  const highlightTargetElement = (step: OnboardingStep) => {
    if (!step.target) {
      setHighlightedElement(null)
      setOverlayStyle({})
      return
    }

    const element = document.querySelector(step.target) as HTMLElement
    if (element) {
      setHighlightedElement(element)
      const rect = element.getBoundingClientRect()
      
      // Create overlay that highlights the element
      setOverlayStyle({
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 9998,
        pointerEvents: 'none',
        border: '3px solid var(--color-primary-500)',
        borderRadius: '8px',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
      })
    } else {
      setHighlightedElement(null)
      setOverlayStyle({})
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsOpen(false)
    
    // Mark onboarding as complete in database
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id)
      }
    } catch (error) {
      console.error('Failed to mark onboarding as complete:', error)
    }

    onComplete?.()
  }

  const handleSkip = async () => {
    setIsOpen(false)
    
    // Mark onboarding as skipped
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true, onboarding_skipped: true })
          .eq('id', user.id)
      }
    } catch (error) {
      console.error('Failed to mark onboarding as skipped:', error)
    }

    onSkip?.()
  }

  if (!isOpen || steps.length === 0 || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  // Calculate dialog position based on step configuration
  const getDialogPosition = () => {
    if (!step.target || !highlightedElement) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const rect = highlightedElement.getBoundingClientRect()
    const position = step.position || 'bottom'
    const gap = 20

    switch (position) {
      case 'top':
        return {
          position: 'fixed' as const,
          bottom: window.innerHeight - rect.top + gap,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          position: 'fixed' as const,
          top: rect.bottom + gap,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          position: 'fixed' as const,
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + gap,
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          position: 'fixed' as const,
          top: rect.top + rect.height / 2,
          left: rect.right + gap,
          transform: 'translateY(-50%)',
        }
      default:
        return {
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  return (
    <>
      {/* Overlay with highlight */}
      {step.target && (
        <div
          style={overlayStyle}
          className="onboarding-overlay"
        />
      )}

      {/* Dark backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9997,
          pointerEvents: 'none',
        }}
      />

      {/* Dialog */}
      <div
        style={{
          ...getDialogPosition(),
          zIndex: 9999,
          maxWidth: '400px',
          width: '90%',
        }}
        className="bg-white rounded-lg shadow-xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--color-primary-600)]">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {step.description}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="ml-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-[var(--color-primary-500)]'
                    : index < currentStep
                    ? 'w-2 bg-[var(--color-primary-300)]'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={step.action ? step.action.onClick : handleNext}
            >
              {step.action ? step.action.label : isLastStep ? 'Complete' : 'Next'}
              {!isLastStep && !step.action && (
                <ChevronRight size={16} className="ml-1" />
              )}
              {isLastStep && !step.action && (
                <Check size={16} className="ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingTour

