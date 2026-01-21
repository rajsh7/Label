import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { BatchHistoryList } from '@/components/features/BatchProcessor/BatchHistoryList'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function BatchHistoryPage() {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get user's batch jobs
  const { data: batchJobs } = await supabase
    .from('batch_jobs')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                Batch History
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                View and re-download your previous batch jobs
              </p>
            </div>

            <BatchHistoryList initialBatches={batchJobs || []} />
          </div>
        </main>
      </div>
    </div>
  )
}

