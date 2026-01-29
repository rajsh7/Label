import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * GET /api/labels
 * Fetch user's saved label designs for printing
 */
export async function GET() {
  try {
    const { supabase, session } = await createUserClient()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('label_designs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get labels error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch labels' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Get labels error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch labels' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/labels
 * Create a new label design for printing
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('label_designs')
      .insert({
        user_id: session.user.id,
        name: body.name,
        elements: JSON.stringify(body.elements),
        label_format: body.label_format,
        width: body.width,
        height: body.height
      })
      .select()
      .single()

    if (error) {
      console.error('Create label error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create label' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Create label error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create label' },
      { status: 500 }
    )
  }
}