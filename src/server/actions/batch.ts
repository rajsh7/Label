'use server'

import { createUserClient } from '@/lib/supabase/server'

/**
 * Get batch job by ID
 */
export async function getBatchJob(batchId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: null }
    }

    const { data, error } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('id', batchId)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get batch job',
      data: null,
    }
  }
}

/**
 * Get user's batch jobs
 */
export async function getUserBatchJobs(limit: number = 50) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: [] }
    }

    const { data, error } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get batch jobs',
      data: [],
    }
  }
}

/**
 * Delete batch job
 */
export async function deleteBatchJob(batchId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('batch_jobs')
      .delete()
      .eq('id', batchId)
      .eq('user_id', session.user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete batch job',
    }
  }
}

