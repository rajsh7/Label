import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { incrementLabelUsage } from '@/lib/usage/tracking'
import { generateDesignPDF } from '@/lib/pdf/designGenerator'
import { sendToNetworkPrinter } from '@/lib/services/printerService'

/**
 * POST /api/print
 * Print labels directly to printer
 * This endpoint coordinates printing for USB/Network printers
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { printer_id, design_id, quantity = 1 } = body

    if (!printer_id || !design_id) {
      return NextResponse.json(
        { error: 'Missing required fields: printer_id, design_id' },
        { status: 400 }
      )
    }

    // Get printer configuration
    const { data: printer, error: printerError } = await supabase
      .from('printers')
      .select('*')
      .eq('id', printer_id)
      .eq('user_id', session.user.id)
      .single()

    if (printerError || !printer) {
      return NextResponse.json({ error: 'Printer not found' }, { status: 404 })
    }

    // Check if printer is online (or try to verify)
    if (!printer.is_online) {
      return NextResponse.json(
        { error: 'Printer is offline. Please check the connection.' },
        { status: 400 }
      )
    }

    // Get design data
    const { data: design, error: designError } = await supabase
      .from('label_designs')
      .select('*, labels(*)')
      .eq('id', design_id)
      .eq('user_id', session.user.id)
      .single()

    if (designError || !design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 })
    }

    const labelBase = design.labels as any
    const dpi = printer.dpi || 203
    const width_px = dpi === 203 ? labelBase.width_px_203dpi : labelBase.width_px_300dpi
    const height_px = dpi === 203 ? labelBase.height_px_203dpi : labelBase.height_px_300dpi

    // Generate PDF for printing
    let printStatus: { success: boolean; error?: string } = { success: true }

    if (printer.connection_type === 'network' && printer.network_ip) {
      // For network printers, generate PDF and send directly
      try {
        const pdfBuffer = await generateDesignPDF({
          elements: design.elements as any,
          width_px: width_px || 812,
          height_px: height_px || 1218,
          dpi,
        })

        // Send to network printer
        printStatus = await sendToNetworkPrinter(
          pdfBuffer,
          printer.network_ip,
          printer.name
        )
      } catch (error) {
        printStatus = {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate or send PDF',
        }
      }
    } else if (printer.connection_type === 'usb') {
      // USB printers: For web apps, we typically rely on system print
      // In a native app, you could use printer SDKs (DYMO, Zebra, etc.)
      // For now, we'll indicate success and let the client handle it via system print
      printStatus = { success: true }
    } else {
      // System printers are handled client-side via browser print dialog
      printStatus = { success: true }
    }

    if (!printStatus.success) {
      return NextResponse.json(
        { error: printStatus.error || 'Failed to print labels' },
        { status: 500 }
      )
    }

    // Track usage for each print
    for (let i = 0; i < quantity; i++) {
      await incrementLabelUsage(session.user.id)
    }

    // Log print history
    await supabase.from('print_history').insert({
      user_id: session.user.id,
      design_id,
      printer_id,
      quantity,
      status: 'success',
    })

    // Update printer last status check
    await supabase
      .from('printers')
      .update({ last_status_check: new Date().toISOString() })
      .eq('id', printer_id)

    return NextResponse.json({
      success: true,
      message: `Print job sent successfully. ${quantity} label(s) queued.`,
    })
  } catch (error) {
    console.error('Print API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to print labels' },
      { status: 500 }
    )
  }
}
