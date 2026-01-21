/**
 * Referral system utilities
 * Helper functions for generating referral codes, calculating rewards, etc.
 */

/**
 * Generate a unique referral code
 * Format: Prefix + random alphanumeric (e.g., "REF-A1B2C3")
 */
export function generateReferralCode(prefix: string = 'REF'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars (0, O, I, 1)
  const length = 8
  let code = prefix.toUpperCase() + '-'
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Format: 3-10 chars prefix, hyphen, 6-20 chars alphanumeric
  const pattern = /^[A-Z0-9]{3,10}-[A-Z0-9]{6,20}$/i
  return pattern.test(code) && code.length >= 6 && code.length <= 50
}

/**
 * Calculate reward for referral
 */
export interface RewardConfig {
  rewardType: 'credit' | 'discount' | 'trial'
  rewardValue: number
  referrerReward?: number // Optional reward for referrer
}

export function calculateReward(config: RewardConfig): {
  referrerReward: number
  referredReward: number
} {
  const { rewardType, rewardValue, referrerReward } = config
  
  let referredReward = 0
  let referrerRewardAmount = referrerReward || 0
  
  switch (rewardType) {
    case 'credit':
      referredReward = rewardValue
      // Default referrer reward is 50% of referred reward
      if (!referrerReward) {
        referrerRewardAmount = Math.floor(rewardValue * 0.5)
      }
      break
    case 'discount':
      // Discount percentage (0-100)
      referredReward = Math.min(100, Math.max(0, rewardValue))
      referrerRewardAmount = referrerRewardAmount || 0
      break
    case 'trial':
      // Trial days
      referredReward = rewardValue
      referrerRewardAmount = referrerRewardAmount || 0
      break
  }
  
  return {
    referrerReward: referrerRewardAmount,
    referredReward,
  }
}

/**
 * Format referral code for display (e.g., "REF-ABC123" -> "REF-ABC-123")
 */
export function formatReferralCode(code: string): string {
  if (code.length <= 10) return code
  
  const parts = code.split('-')
  if (parts.length === 2 && parts[1].length > 6) {
    const suffix = parts[1]
    const formatted = suffix.match(/.{1,3}/g)?.join('-') || suffix
    return `${parts[0]}-${formatted}`
  }
  
  return code
}

/**
 * Check if referral code is expired
 */
export function isReferralExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

/**
 * Check if referral code has reached max uses
 */
export function isReferralMaxedOut(currentUses: number, maxUses: number | null): boolean {
  if (!maxUses) return false // Unlimited uses
  return currentUses >= maxUses
}

