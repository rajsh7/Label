import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { generateDesignPDF } from '@/lib/pdf/designGenerator'
import { sendToNetworkPrinter } from '@/lib/services/printerService'

/**
 * POST /api/printers/[id]/test
 * Send a test print to the specified printer
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: printerId } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get printer configuration
    const { data: printer, error: printerError } = await supabase
      .from('printers')
      .select('*')
      .eq('id', printerId)
      .eq('user_id', session.user.id)
      .single()

    if (printerError || !printer) {
      return NextResponse.json({ error: 'Printer not found' }, { status: 404 })
    }

    // Check if printer is online
    if (!printer.is_online) {
      return NextResponse.json(
        { error: 'Printer is offline. Please check the connection.' },
        { status: 400 }
      )
    }

    // Generate a simple test label PDF
    const testElements = [
      {
        id: 'test-text-1',
        type: 'text' as const,
        x: 50,
        y: 50,
        width: 400,
        height: 50,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'LabelPro Test Print',
          fontSize: 24,
          font: 'Arial',
          fontWeight: 700,
          color: '#000000',
          align: 'center',
        },
      },
      {
        id: 'test-text-2',
        type: 'text' as const,
        x: 50,
        y: 120,
        width: 400,
        height: 30,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: `Printer: ${printer.name}`,
          fontSize: 16,
          font: 'Arial',
          fontWeight: 400,
          color: '#000000',
          align: 'center',
        },
      },
      {
        id: 'test-text-3',
        type: 'text' as const,
        x: 50,
        y: 160,
        width: 400,
        height: 30,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: `DPI: ${printer.dpi} | Type: ${printer.printer_type}`,
          fontSize: 14,
          font: 'Arial',
          fontWeight: 400,
          color: '#000000',
          align: 'center',
        },
      },
    ]

    const dpi = printer.dpi || 203
    const width_px = dpi === 203 ? 812 : 1200 // Approximate 4x6 label at 203/300 DPI
    const height_px = dpi === 203 ? 1218 : 1800

    try {
      const pdfBuffer = await generateDesignPDF({
        elements: testElements as any,
        width_px,
        height_px,
        dpi,
      })

      // Send to printer based on connection type
      if (printer.connection_type === 'network' && printer.network_ip) {
        const result = await sendToNetworkPrinter(
          pdfBuffer,
          printer.network_ip,
          printer.name
        )

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Failed to send test print to network printer' },
            { status: 500 }
          )
        }
      } else if (printer.connection_type === 'usb') {
        // USB printers: In a web environment, we can't directly print
        // This would require a native app or browser extension
        // For now, return success and note that system print should be used
        return NextResponse.json({
          success: true,
          message: 'Test print prepared. Please use system print dialog for USB printers.',
        })
      } else {
        // System printers are handled client-side
        return NextResponse.json({
          success: true,
          message: 'Test print prepared. System print dialog will open.',
        })
      }

      // Update printer last status check
      await supabase
        .from('printers')
        .update({ last_status_check: new Date().toISOString(), is_online: true })
        .eq('id', printerId)

      return NextResponse.json({
        success: true,
        message: 'Test print sent successfully.',
      })
    } catch (error) {
      console.error('Test print error:', error)
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Failed to generate or send test print',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test print API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test print' },
      { status: 500 }
    )
  }
}
