import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ApiSettings } from '@/components/features/Settings/ApiSettings'

export default async function ApiSettingsPage() {
  const { session } = await createUserClient()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has Enterprise plan
  const { supabase } = await createUserClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', session.user.id)
    .single()

  if (profile?.subscription_tier !== 'enterprise') {
    redirect('/settings?tab=billing')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">API Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your API keys and access tokens
        </p>
      </div>

      <ApiSettings />
    </div>
  )
}

