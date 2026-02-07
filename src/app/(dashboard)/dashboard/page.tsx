import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default async function DashboardPage() {
  const { session } = await createUserClient()
  
  if (!session) {
    redirect('/login')
  }

  return <DashboardOverview />
}
