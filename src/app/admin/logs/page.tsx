import { createUserClient } from '@/lib/supabase/server'
import { AdminAuditLogs } from '@/components/features/Admin/AdminAuditLogs'

export default async function AdminLogsPage() {
  const { supabase, session } = await createUserClient()

  if (!session?.user) {
    return null
  }

  // Verify admin access
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">User Login Logs</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          View user authentication and login activity
        </p>
      </div>

      <AdminAuditLogs />
    </div>
  )
}

