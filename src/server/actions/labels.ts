'use server'

import { createUserClient } from '@/lib/supabase/server'

/**
 * Get all labels
 */
export async function getAllLabels() {
  try {
    const { supabase } = await createUserClient()
    
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get labels',
      data: [],
    }
  }
}

/**
 * Get label by ID
 */
export async function getLabelById(id: string) {
  try {
    const { supabase } = await createUserClient()
    
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get label',
      data: null,
    }
  }
}

/**
 * Get labels by category
 */
export async function getLabelsByCategory(category: string) {
  try {
    const { supabase } = await createUserClient()
    
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get labels',
      data: [],
    }
  }
}

/**
 * Search labels
 */
export async function searchLabels(query: string) {
  try {
    const { supabase } = await createUserClient()
    
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,marketplace.ilike.%${query}%`)
      .order('name', { ascending: true })
      .limit(100)

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search labels',
      data: [],
    }
  }
}

