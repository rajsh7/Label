import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * POST /api/printers
 * Create a new printer
 */
export async function POST(request: NextRequest) {
  try {
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

    // Validation
    if (!name || !printer_type || !connection_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await supabase
        .from('printers')
        .update({ is_default: false })
        .eq('user_id', session.user.id)
        .eq('is_default', true)
    }

    // Create printer
    const { data, error } = await supabase
      .from('printers')
      .insert({
        user_id: session.user.id,
        name,
        printer_type,
        connection_type,
        network_ip: connection_type === 'network' ? network_ip : null,
        dpi: dpi || 203,
        darkness_level: darkness_level || 15,
        label_gap: label_gap || 3,
        is_default: is_default || false,
        is_online: false, // Will be checked later
      })
      .select()
      .single()

    if (error) {
      console.error('Create printer error:', error)
      return NextResponse.json(
        { error: 'Failed to create printer' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, printer: data })
  } catch (error) {
    console.error('Create printer error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create printer' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/printers
 * Get user's printers
 */
export async function GET(_request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('printers')
      .select('*')
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get printers error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch printers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, printers: data || [] })
  } catch (error) {
    console.error('Get printers error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch printers' },
      { status: 500 }
    )
  }
}

