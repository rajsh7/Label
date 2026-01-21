import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { PrinterForm } from '@/components/features/Printers/PrinterForm'

export default async function NewPrinterPage() {
  const { session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Add New Printer
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Configure your printer settings for direct label printing
        </p>
      </div>

      <PrinterForm />
    </div>
  )
}

