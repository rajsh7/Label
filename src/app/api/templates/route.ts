import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * GET /api/templates
 * Fetch all templates (user's + public templates)
 * Supports query params: ?user_id=xxx, ?public=true
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const isPublic = searchParams.get('public') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('templates')
      .select('*, labels(name, category), profiles(full_name)')
      .is('deleted_at', null)

    // Filter by user if provided
    if (userId) {
      query = query.eq('user_id', userId)
    } else if (isPublic) {
      // Only public templates
      query = query.eq('is_public', true)
    } else if (session?.user) {
      // User's templates + public templates
      query = query.or(`user_id.eq.${session.user.id},is_public.eq.true`)
    } else {
      // No session, only public templates
      query = query.eq('is_public', true)
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Get templates error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch templates' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}