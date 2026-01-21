/**
 * Email validation utilities
 * Additional email validation functions beyond Zod schemas
 */

/**
 * Check if email domain is valid
 */
export function isValidEmailDomain(email: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/
  const domain = email.split('@')[1]
  return domain ? domainRegex.test(domain) : false
}

/**
 * Check if email is from a disposable email service
 * Basic list - can be expanded
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    // Add more as needed
  ]

  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? disposableDomains.includes(domain) : false
}

/**
 * Normalize email address (lowercase, trim)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Validate email format with additional checks
 */
export function validateEmailAdvanced(email: string): {
  valid: boolean
  error?: string
} {
  const normalized = normalizeEmail(email)

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalized)) {
    return { valid: false, error: 'Invalid email format' }
  }

  // Length check
  if (normalized.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' }
  }

  // Domain validation
  if (!isValidEmailDomain(normalized)) {
    return { valid: false, error: 'Invalid email domain' }
  }

  // Disposable email check (optional - might want to allow in some cases)
  // if (isDisposableEmail(normalized)) {
  //   return { valid: false, error: 'Disposable email addresses are not allowed' }
  // }

  return { valid: true }
}

