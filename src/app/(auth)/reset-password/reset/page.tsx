'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { validatePassword } from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'
import { Lock } from 'lucide-react'

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  useEffect(() => {
    // Check if user has a valid session (required for password reset)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/reset-password?error=expired')
      }
    }
    checkSession()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Validate password strength in real-time
    if (field === 'password') {
      const validation = validatePassword(value)
      if (validation.valid) {
        // Calculate password strength
        let strength = 0
        if (value.length >= 8) strength++
        if (/[A-Z]/.test(value)) strength++
        if (/[a-z]/.test(value)) strength++
        if (/[0-9]/.test(value)) strength++
        if (/[^A-Za-z0-9]/.test(value)) strength++
        
        const strengthLevels = ['weak', 'fair', 'good', 'strong', 'very-strong']
        setPasswordStrength(strengthLevels[Math.min(strength - 1, 4)] as any)
      } else {
        setPasswordStrength(null)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || 'Invalid password'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('expired')) {
          setErrors({ submit: 'The reset link has expired. Please request a new one.' })
        } else {
          setErrors({ submit: error.message })
        }
        setLoading(false)
        return
      }

      // Success - redirect to login
      router.push('/login?password=reset')
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return ''
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
      default:
        return ''
    }
  }

  const handleBackToLogin = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-muted border-border"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all`}
                        style={{
                          width:
                            passwordStrength === 'weak'
                              ? '33%'
                              : passwordStrength === 'medium'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {passwordStrength}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-muted border-border"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button onClick={handleBackToLogin} className="text-accent hover:underline">
              Back to Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

