import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { PrinterList } from '@/components/features/Printers/PrinterList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function PrintersPage() {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get user's printers
  const { data: printers } = await supabase
    .from('printers')
    .select('*')
    .eq('user_id', session.user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Printers
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Manage your connected printers
          </p>
        </div>
        <Link href="/printers/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add Printer
          </Button>
        </Link>
      </div>

      <PrinterList initialPrinters={printers || []} />
    </div>
  )
}

