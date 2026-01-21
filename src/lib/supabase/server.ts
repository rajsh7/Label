import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

/**
 * Supabase client for server-side admin operations (with service role key)
 * Use this for admin-only operations that require elevated privileges
 */
export async function createServerClient() {
  const key = supabaseServiceRoleKey || supabaseAnonKey
  
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'labelpro-server',
      },
    },
  })
}

/**
 * Supabase client for server-side user operations (with user session)
 * Use this when you need to access user-specific data
 */
export async function createUserClient() {
  const cookieStore = await cookies()
  
  const supabase = createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options)
      },
      remove(name: string, options: any) {
        cookieStore.set(name, '', options)
      },
    },
  })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  return { supabase, session }
}
