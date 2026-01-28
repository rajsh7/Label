/**
 * Template type definitions
 * Based on database schema and label designs
 */

export interface Template {
  id: string
  user_id?: string // null for public templates
  name: string
  description?: string
  label_base_id: string
  elements: any[] // EditorElement[] - using any to avoid circular dependency
  thumbnail_url?: string
  is_public: boolean
  downloads: number
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateTemplateInput {
  name: string
  description?: string
  label_base_id: string
  elements: any[]
  thumbnail_url?: string
  is_public?: boolean
  category?: string
  tags?: string[]
}

export interface UpdateTemplateInput {
  name?: string
  description?: string
  elements?: any[]
  thumbnail_url?: string
  is_public?: boolean
  category?: string
  tags?: string[]
}