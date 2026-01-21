'use server'

import { createUserClient } from '@/lib/supabase/server'
import { EditorElement } from '@/types/editor'

interface SaveDesignParams {
  name: string
  description?: string
  labelBaseId: string
  elements: EditorElement[]
  thumbnail?: string
  isTemplate?: boolean
}

interface LoadDesignResult {
  id: string
  name: string
  description?: string
  label_base_id: string
  elements: EditorElement[]
  is_template: boolean
  created_at: string
  updated_at: string
}

/**
 * Save a design to the database
 */
export async function saveDesign(params: SaveDesignParams) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('label_designs')
      .insert({
        user_id: session.user.id,
        name: params.name,
        description: params.description || null,
        elements: params.elements as any,
        is_template: params.isTemplate || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Save design error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Save design error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save design',
    }
  }
}

/**
 * Update an existing design
 */
export async function updateDesign(designId: string, params: Partial<SaveDesignParams>) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (params.name) updateData.name = params.name
    if (params.description !== undefined) updateData.description = params.description
    if (params.elements) updateData.elements = params.elements as any
    if (params.isTemplate !== undefined) updateData.is_template = params.isTemplate

    const { data, error } = await supabase
      .from('label_designs')
      .update(updateData)
      .eq('id', designId)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Update design error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Update design error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update design',
    }
  }
}

/**
 * Save a draft (auto-save)
 */
export async function saveDraft(designId: string | null, params: SaveDesignParams) {
  try {
    const { session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // If designId exists, update it; otherwise create new draft
    if (designId) {
      return await updateDesign(designId, params)
    }

    // Create new draft with special naming
    const draftName = `Draft ${new Date().toLocaleString()}`
    return await saveDesign({
      ...params,
      name: draftName,
    })
  } catch (error) {
    console.error('Save draft error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    }
  }
}

/**
 * Load a design by ID
 */
export async function loadDesign(designId: string): Promise<{
  success: boolean
  data?: LoadDesignResult
  error?: string
}> {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('label_designs')
      .select('*')
      .eq('id', designId)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      console.error('Load design error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as LoadDesignResult }
  } catch (error) {
    console.error('Load design error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load design',
    }
  }
}

/**
 * Get user's designs
 */
export async function getUserDesigns() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: [] }
    }

    const { data, error } = await supabase
      .from('label_designs')
      .select('*')
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Get designs error:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Get designs error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get designs',
      data: [],
    }
  }
}

/**
 * Delete a design
 */
export async function deleteDesign(designId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('label_designs')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', designId)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Delete design error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete design error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete design',
    }
  }
}

/**
 * Get the most recent draft
 */
export async function getLatestDraft() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: null }
    }

    const { data, error } = await supabase
      .from('label_designs')
      .select('*')
      .eq('user_id', session.user.id)
      .like('name', 'Draft%')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Get draft error:', error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data: data || null }
  } catch (error) {
    console.error('Get draft error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get draft',
      data: null,
    }
  }
}

