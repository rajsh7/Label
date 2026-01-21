import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { ALL_LABELS } from '@/lib/constants/labels'
import { saveDesign } from '@/server/actions/designs'

/**
 * GET /api/labels
 * Fetch all available label types
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const allLabels = ALL_LABELS

    // Filter by category if provided
    let filteredLabels = allLabels
    if (category) {
      filteredLabels = filteredLabels.filter((label) => label.category === category)
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase()
      filteredLabels = filteredLabels.filter(
        (label) =>
          label.name.toLowerCase().includes(searchLower) ||
          label.category.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredLabels,
      count: filteredLabels.length,
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
 * Create a new label design
 */
export async function POST(request: NextRequest) {
  try {
    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, labelBaseId, elements, thumbnail, isTemplate } = body

    if (!name || !labelBaseId || !elements) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, labelBaseId, elements' },
        { status: 400 }
      )
    }

    const result = await saveDesign({
      name,
      description,
      labelBaseId,
      elements,
      thumbnail,
      isTemplate: isTemplate || false,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save design' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Create label design error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create label design' },
      { status: 500 }
    )
  }
}