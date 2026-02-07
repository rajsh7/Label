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

export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()
    
    console.log('POST /api/labels - Session:', session?.user?.id ? 'Authenticated' : 'Not authenticated')
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Ensure profile exists (in case database was cleaned but auth session persists)
    const { data: profile, error: _profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
        console.log('Creating missing profile for user:', session.user.id)
        const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
                id: session.user.id,
                email: session.user.email || 'unknown@example.com',
                full_name: session.user.user_metadata?.full_name || 'User',
                subscription_tier: 'free',
                labels_used_this_month: 0
            })
        
        if (createProfileError) {
            console.error('Failed to create profile:', createProfileError)
            // Continue anyway, maybe it exists now or RLS will handle it
        }
    }

    const body = await request.json()
    console.log('POST /api/labels - Request body:', JSON.stringify(body, null, 2))
    
    const insertData = {
      user_id: session.user.id,
      name: body.name,
      label_base_id: body.label_base_id || 'custom',
      elements: body.elements || [],  // JSONB field, no need to stringify
      width_px: body.width_px || 812,
      height_px: body.height_px || 1218,
      dpi: body.dpi || 203,
      description: body.description || null
    }
    
    console.log('POST /api/labels - Insert data:', JSON.stringify(insertData, null, 2))
    
    const { data, error } = await supabase
      .from('label_designs')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Create label error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create label', details: error },
        { status: 500 }
      )
    }

    console.log('POST /api/labels - Success:', data)
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Create label error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create label' },
      { status: 500 }
    )
  }
}