import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeamMemberList } from '@/components/features/Team/TeamMemberList'

export default async function TeamPage() {
  const { session } = await createUserClient()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has Pro or Enterprise plan
  const { supabase } = await createUserClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', session.user.id)
    .single()

  if (!profile || (profile.subscription_tier !== 'pro' && profile.subscription_tier !== 'enterprise')) {
    redirect('/settings?tab=billing')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Team Members</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage team members and collaborate on labels
        </p>
      </div>

      <TeamMemberList />
    </div>
  )
}

