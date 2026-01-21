/**
 * Auth validation utilities
 * Email, password, and other auth-related validation
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address')

/**
 * Password validation schema
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Signup schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
})

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

/**
 * New password schema (for password reset)
 */
export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email)
    return { valid: true }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { valid: false, error: e.errors[0].message }
    }
    return { valid: false, error: 'An unknown validation error occurred' }
  }
}

/**
 * Validate password
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  try {
    passwordSchema.parse(password)
    return { valid: true }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { valid: false, error: e.errors[0].message }
    }
    return { valid: false, error: 'An unknown validation error occurred' }
  }
}

/**
 * Validate login credentials
 */
export function validateLogin(
  email: string,
  password: string
): { valid: boolean; errors?: Record<string, string> } {
  try {
    loginSchema.parse({ email, password })
    return { valid: true }
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      e.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as string] = error.message
        }
      })
      return { valid: false, errors }
    }
    return { valid: false, errors: { general: 'An unknown validation error occurred' } }
  }
}

/**
 * Validate full name
 */
export function validateFullName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters' }
  }
  return { valid: true }
}

/**
 * Validate company name
 */
export function validateCompanyName(name: string): { valid: boolean; error?: string } {
  // Company name is optional, so empty is valid
  if (!name || name.trim().length === 0) {
    return { valid: true }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Company name must be at least 2 characters' }
  }
  return { valid: true }
}
