/**
 * API Authentication and Rate Limiting utilities
 */

import { createUserClient } from '@/lib/supabase/server'
import { checkApiRateLimit } from '@/lib/rateLimit/apiRateLimit'

export interface ApiAuthResult {
  success: boolean
  userId?: string
  keyId?: string
  error?: string
  subscription?: string
}

export async function authenticateApiKey(apiKey: string): Promise<ApiAuthResult> {
  try {
    const { supabase } = await createUserClient()

    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('*, profiles(id, subscription_tier)')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single()

    if (error || !apiKeyData) {
      return { success: false, error: 'Invalid API key' }
    }

    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return { success: false, error: 'API key expired' }
    }

    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id)

    const profile = apiKeyData.profiles as any
    return {
      success: true,
      userId: apiKeyData.user_id,
      keyId: apiKeyData.id,
      subscription: profile?.subscription_tier || 'free',
    }
  } catch (error) {
    return { success: false, error: 'Authentication failed' }
  }
}

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    const result = await checkApiRateLimit(userId)
    return { allowed: result.allowed, error: result.error }
  } catch (error) {
    return { allowed: false, error: 'Rate limit check failed' }
  }
}

export async function incrementApiUsage(userId: string): Promise<void> {
  try {
    const { supabase } = await createUserClient()
    await supabase.rpc('increment_api_usage', { user_id: userId })
  } catch (error) {
    console.error('Increment API usage error:', error)
  }
}
