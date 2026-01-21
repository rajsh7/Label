import { createUserClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrintHistoryList } from '@/components/features/Printers/PrintHistoryList'

export default async function PrintHistoryPage() {
  const { session } = await createUserClient()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Print History</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          View and manage your print history
        </p>
      </div>

      <PrintHistoryList />
    </div>
  )
}

