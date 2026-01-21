/**
 * PDF storage utilities
 * Centralized functions for managing PDFs in Supabase Storage
 * These functions should be called with a Supabase client from server-side code
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

export interface PDFStorageOptions {
  supabase: SupabaseClient
  buffer: Buffer
  userId: string
  filename?: string
  folder?: 'labels' | 'batch' | 'templates' | 'exports'
  designId?: string
  batchJobId?: string
  templateId?: string
  expiresIn?: number // seconds, default 604800 (7 days)
  skipAuthCheck?: boolean // Skip session check (for service role clients)
}

export interface PDFStorageResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

/**
 * Upload PDF to Supabase Storage with proper organization
 */
export async function storePDF({
  supabase,
  buffer,
  userId,
  filename,
  folder = 'labels',
  designId,
  batchJobId,
  templateId,
  expiresIn = 604800, // 7 days default
  skipAuthCheck = false,
}: PDFStorageOptions): Promise<PDFStorageResult> {
  try {
    // Get current session to ensure user is authenticated (unless using service role)
    if (!skipAuthCheck) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.id !== userId) {
        return { success: false, error: 'Not authenticated or unauthorized' }
      }
    }

    const timestamp = Date.now()
    const fileId = uuidv4()
    
    // Generate organized filename based on context
    let filePath: string
    if (filename) {
      filePath = filename
    } else {
      const basePath = `${folder}/${userId}`
      
      if (batchJobId) {
        filePath = `${basePath}/batch/${batchJobId}_${timestamp}.pdf`
      } else if (templateId) {
        filePath = `${basePath}/templates/${templateId}_${timestamp}.pdf`
      } else if (designId) {
        filePath = `${basePath}/designs/${designId}_${timestamp}.pdf`
      } else {
        filePath = `${basePath}/${fileId}_${timestamp}.pdf`
      }
    }

    // Upload file
    const { error } = await supabase.storage
      .from('label_outputs')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (error) {
      console.error('PDF upload error:', error)
      return { success: false, error: error.message }
    }

    // Get signed URL with expiration
    const { data: urlData, error: urlError } = await supabase.storage
      .from('label_outputs')
      .createSignedUrl(filePath, expiresIn)

    if (urlError) {
      console.error('Get signed URL error:', urlError)
      // Fallback to public URL if signed URL fails
      const { data: publicUrlData } = supabase.storage
        .from('label_outputs')
        .getPublicUrl(filePath)

      return {
        success: true,
        url: publicUrlData.publicUrl,
        path: filePath,
      }
    }

    return {
      success: true,
      url: urlData.signedUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('Store PDF error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store PDF',
    }
  }
}

/**
 * Get PDF URL from storage path
 */
export async function getPDFUrl(
  supabase: SupabaseClient,
  filePath: string,
  expiresIn: number = 604800
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('label_outputs')
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, url: data.signedUrl }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get PDF URL',
    }
  }
}

/**
 * Delete PDF from storage
 */
export async function deletePDF(
  supabase: SupabaseClient,
  filePath: string,
  userId: string,
  skipAuthCheck: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user has access (unless using service role)
    if (!skipAuthCheck) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.id !== userId) {
        return { success: false, error: 'Not authenticated or unauthorized' }
      }
    }

    // Verify the file path belongs to this user
    if (!filePath.startsWith(`labels/${userId}/`) && 
        !filePath.startsWith(`batch/${userId}/`) &&
        !filePath.startsWith(`templates/${userId}/`) &&
        !filePath.startsWith(`exports/${userId}/`)) {
      return { success: false, error: 'Unauthorized to delete this file' }
    }

    const { error } = await supabase.storage
      .from('label_outputs')
      .remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete PDF',
    }
  }
}

/**
 * List PDFs for a user in a specific folder
 */
export async function listUserPDFs(
  supabase: SupabaseClient,
  userId: string,
  folder: 'labels' | 'batch' | 'templates' | 'exports' = 'labels',
  skipAuthCheck: boolean = false
): Promise<{ success: boolean; files?: Array<{ name: string; path: string; size: number; created_at: string }>; error?: string }> {
  try {
    // Verify user has access (unless using service role)
    if (!skipAuthCheck) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.id !== userId) {
        return { success: false, error: 'Not authenticated or unauthorized' }
      }
    }

    const folderPath = `${folder}/${userId}`

    const { data, error } = await supabase.storage
      .from('label_outputs')
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      files: data?.map((file) => ({
        name: file.name,
        path: `${folderPath}/${file.name}`,
        size: file.metadata?.size || 0,
        created_at: file.created_at || new Date().toISOString(),
      })) || [],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list PDFs',
    }
  }
}

