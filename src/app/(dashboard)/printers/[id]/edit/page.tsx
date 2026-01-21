import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { PrinterForm } from '@/components/features/Printers/PrinterForm'

export default async function EditPrinterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get printer
  const { data: printer, error } = await supabase
    .from('printers')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !printer) {
    redirect('/printers')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Edit Printer
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Update your printer settings
        </p>
      </div>

      <PrinterForm
        printerId={id}
        initialData={{
          name: printer.name,
          printer_type: printer.printer_type,
          connection_type: printer.connection_type,
          network_ip: printer.network_ip || undefined,
          dpi: printer.dpi,
          darkness_level: printer.darkness_level,
          label_gap: printer.label_gap,
          is_default: printer.is_default,
        }}
      />
    </div>
  )
}

