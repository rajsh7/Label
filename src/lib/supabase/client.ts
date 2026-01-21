import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Supabase client for client-side operations
 * Use this in React components and client-side code
 * Uses @supabase/ssr for proper cookie handling in Next.js
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

