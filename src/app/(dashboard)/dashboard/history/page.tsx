import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { BatchHistoryList } from '@/components/features/BatchProcessor/BatchHistoryList'
import { DashboardHero } from '@/components/dashboard/hero'

export default async function HistoryPage() {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  const { data: batchJobs } = await supabase
    .from('batch_jobs')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <DashboardHero 
        title="Batch History" 
        description="View your past batch jobs, status, and download links. Keep track of all your bulk generation tasks."
        searchPlaceholder="Search history..."
        showPills={false}
        showBottomPills={false}
        showSearch={false}
      />
      
      <div className="max-w-[1920px] mx-auto px-6 -mt-8 relative z-10">
        <BatchHistoryList initialBatches={batchJobs || []} />
      </div>
    </div>
  )
}
