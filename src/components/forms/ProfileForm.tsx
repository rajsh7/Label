'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateEmail, validateFullName, validateCompanyName } from '@/lib/auth/validators'

export interface ProfileFormData {
  full_name: string
  email: string
  company_name?: string
}

export interface ProfileFormProps {
  initialData?: ProfileFormData
  onSubmit: (data: ProfileFormData) => Promise<void>
  loading?: boolean
}

/**
 * Profile form component
 * Handles user profile updates (name, email, company)
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    company_name: initialData?.company_name || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        company_name: initialData.company_name || '',
      })
    }
  }, [initialData])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
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

    const nameValidation = validateFullName(formData.full_name)
    if (!nameValidation.valid) {
      newErrors.full_name = nameValidation.error || 'Invalid name'
    }

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || 'Invalid email'
    }

    if (formData.company_name) {
      const companyValidation = validateCompanyName(formData.company_name)
      if (!companyValidation.valid) {
        newErrors.company_name = companyValidation.error || 'Invalid company name'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update profile',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        value={formData.full_name}
        onChange={(e) => handleInputChange('full_name', e.target.value)}
        error={errors.full_name}
        placeholder="John Doe"
        required
        disabled={loading}
      />

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

      {/* Company Name */}
      <Input
        label="Company Name (Optional)"
        type="text"
        value={formData.company_name || ''}
        onChange={(e) => handleInputChange('company_name', e.target.value)}
        error={errors.company_name}
        placeholder="Acme Inc."
        disabled={loading}
      />

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="primary" loading={loading}>
        Save Changes
      </Button>
    </form>
  )
}

export default ProfileForm
