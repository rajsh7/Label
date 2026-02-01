import { DashboardHero } from '@/components/dashboard/hero'
import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardTemplatesGrid } from '@/components/dashboard/dashboard-templates-grid'

export default async function DashboardPage() {
  const { supabase, session } = await createUserClient()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch all public templates
  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <DashboardHero />

      {/* Main Content */}
      <DashboardTemplatesGrid initialTemplates={templates || []} />
    </div>
  )
}
