/**
 * OAuth helper functions
 * Wraps Supabase OAuth functionality for consistency
 */

import { supabase } from '@/lib/supabase/client'
import { Provider } from '@supabase/supabase-js'

export type OAuthProvider = 'google' | 'amazon' | 'github' | 'facebook' | 'twitter'

/**
 * Supported OAuth providers
 */
export const OAUTH_PROVIDERS: OAuthProvider[] = ['google', 'amazon']

/**
 * Initiate OAuth login
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  options?: {
    redirectTo?: string
    scopes?: string
    queryParams?: Record<string, string>
  }
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
        scopes: options?.scopes,
        queryParams: options?.queryParams,
      },
    })

    if (error) {
      return { error }
    }

    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('OAuth sign-in failed'),
    }
  }
}

/**
 * Get OAuth provider display name
 */
export function getProviderDisplayName(provider: OAuthProvider): string {
  const names: Record<OAuthProvider, string> = {
    google: 'Google',
    amazon: 'Amazon',
    github: 'GitHub',
    facebook: 'Facebook',
    twitter: 'Twitter',
  }

  return names[provider] || provider
}

/**
 * Get OAuth provider icon name (for lucide-react)
 */
export function getProviderIcon(provider: OAuthProvider): string {
  const icons: Record<OAuthProvider, string> = {
    google: 'Chrome',
    amazon: 'ShoppingBag',
    github: 'Github',
    facebook: 'Facebook',
    twitter: 'Twitter',
  }

  return icons[provider] || 'LogIn'
}

/**
 * Check if OAuth provider is available
 */
export function isProviderAvailable(provider: OAuthProvider): boolean {
  return OAUTH_PROVIDERS.includes(provider)
}

