'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { OAuthButtons } from '@/components/features/Auth/OAuthButtons'
import { validateEmail } from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'

export interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
}

/**
 * Login form component
 * Handles email/password authentication
 */
export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/dashboard', onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || 'Invalid email'
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({
            submit: 'Please verify your email address before signing in. Check your inbox for the verification link.',
          })
        } else {
          setErrors({ submit: error.message })
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // Set session persistence based on remember me
        if (formData.rememberMe) {
          // Session will persist for 90 days (handled by Supabase config)
        }

        if (onSuccess) {
          onSuccess()
        } else {
          // Wait a moment for cookies to be set, then redirect
          await new Promise(resolve => setTimeout(resolve, 100))
          window.location.href = redirectTo
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Welcome back
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Sign in to your LabelPro account
      </p>

      {/* OAuth Buttons */}
      <div className="mb-6">
        <OAuthButtons redirectTo={redirectTo} />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-primary)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[var(--color-text-secondary)]">
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <div className="mt-2 text-right">
            <Link
              href="/reset-password"
              className="text-sm text-[var(--color-primary-600)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember Me */}
        <Checkbox
          label="Remember me for 90 days"
          checked={formData.rememberMe}
          onChange={(checked) => handleInputChange('rememberMe', checked)}
          disabled={loading}
        />

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Signup Link */}
      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--color-text-secondary)]">Don't have an account? </span>
        <Link href="/signup" className="text-[var(--color-primary-600)] font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
