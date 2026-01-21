import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * PUT /api/printers/[id]
 * Update a printer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      printer_type,
      connection_type,
      network_ip,
      dpi,
      darkness_level,
      label_gap,
      is_default,
    } = body

    // Verify ownership
    const { data: printer, error: fetchError } = await supabase
      .from('printers')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !printer || printer.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Printer not found' }, { status: 404 })
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('printers')
        .update({ is_default: false })
        .eq('user_id', session.user.id)
        .eq('is_default', true)
        .neq('id', id)
    }

    // Update printer
    const { data, error } = await supabase
      .from('printers')
      .update({
        name,
        printer_type,
        connection_type,
        network_ip: connection_type === 'network' ? network_ip : null,
        dpi,
        darkness_level,
        label_gap,
        is_default,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update printer error:', error)
      return NextResponse.json(
        { error: 'Failed to update printer' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, printer: data })
  } catch (error) {
    console.error('Update printer error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update printer' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/printers/[id]
 * Delete a printer (soft delete)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: printer, error: fetchError } = await supabase
      .from('printers')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !printer || printer.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Printer not found' }, { status: 404 })
    }

    // Soft delete
    const { error } = await supabase
      .from('printers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Delete printer error:', error)
      return NextResponse.json(
        { error: 'Failed to delete printer' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete printer error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete printer' },
      { status: 500 }
    )
  }
}
