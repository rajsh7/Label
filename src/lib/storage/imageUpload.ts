/**
 * Image upload utilities for Supabase Storage
 * Handles image uploads for label editor image elements
 */

import { supabase } from '@/lib/supabase/client'

export interface UploadImageParams {
  file: File
  userId: string
  designId?: string
  onProgress?: (progress: number) => void
}

export interface UploadImageResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload image to Supabase Storage
 * Path: label_images/{user_id}/{design_id or 'drafts'}/{filename}
 */
export async function uploadImage({
  file,
  userId,
  designId,
  onProgress: _onProgress,
}: UploadImageParams): Promise<UploadImageResult> {
  try {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload PNG, JPEG, or WebP images.',
      }
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size exceeds 2MB limit. Please compress your image.',
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = designId
      ? `${userId}/${designId}/${fileName}`
      : `${userId}/drafts/${fileName}`

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('label_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('label_images').getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract path from URL if full URL is provided
    const path = filePath.includes('/label_images/')
      ? filePath.split('/label_images/')[1]
      : filePath

    const { error } = await supabase.storage.from('label_images').remove([path])

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete image',
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}

/**
 * Get user's storage usage
 */
export async function getStorageUsage(userId: string): Promise<{
  used: number
  limit: number
  unit: 'MB' | 'GB'
}> {
  try {
    // List all files for user
    const { error } = await supabase.storage.from('label_images').list(userId, {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      return { used: 0, limit: 100, unit: 'MB' } // Default free tier
    }

    // Calculate total size (this is approximate, Supabase doesn't provide exact size)
    // In production, you might want to track this in a database
    let totalSize = 0
    const calculateSize = async (path: string) => {
      const { data: files } = await supabase.storage.from('label_images').list(path, {
        limit: 1000,
      })
      if (files) {
        files.forEach((file) => {
          if (file.metadata?.size) {
            totalSize += file.metadata.size
          }
        })
      }
    }

    await calculateSize(userId)

    // Determine limit based on subscription (default to free tier: 100MB)
    const limit = 100 * 1024 * 1024 // 100MB
    return {
      used: totalSize,
      limit,
      unit: 'MB',
    }
  } catch (error) {
    console.error('Storage usage error:', error)
    return { used: 0, limit: 100, unit: 'MB' }
  }
}

