import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * GET /api/templates/[id]
 * Get a specific template by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase, session } = await createUserClient()

    // Fetch template (allow public templates to be viewed by anyone)
    const { data: template, error } = await supabase
      .from('templates')
      .select('*, labels(name, category), profiles(full_name)')
      .eq('id', id)
      .single()

    if (error || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if user can access (owner or public)
    const isOwner = session?.user?.id === template.user_id
    const isPublic = template.is_public

    if (!isOwner && !isPublic) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: template,
    })
  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch template',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/templates/[id]
 * Update a template
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

    // Verify ownership
    const { data: template, error: fetchError } = await supabase
      .from('templates')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !template || template.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, elements, thumbnail_url, is_public } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (elements !== undefined) updateData.elements = elements
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
    if (is_public !== undefined) updateData.is_public = is_public

    const { data: updatedTemplate, error: updateError } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select('*, labels(name, category), profiles(full_name)')
      .single()

    if (updateError) {
      console.error('Update template error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    })
  } catch (error) {
    console.error('Update template error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update template',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a template
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
    const { data: template, error: fetchError } = await supabase
      .from('templates')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !template || template.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete template
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete template error:', error)
      return NextResponse.json(
        { error: 'Failed to delete template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete template' },
      { status: 500 }
    )
  }
}
