/**
 * Label type definitions
 * Re-export from constants for type consistency
 */

export type { Label } from '@/lib/constants/labels'

export interface LabelBase {
  id: string
  name: string
  category: string
  marketplace?: string
  print_method: 'thermal' | 'inkjet' | 'desktop'
  printer_type?: string
  width_mm: number
  height_mm: number
  width_inch?: number
  height_inch?: number
  width_px_203dpi?: number
  height_px_203dpi?: number
  width_px_300dpi?: number
  height_px_300dpi?: number
  barcode_position?: string
  barcode_format?: string
  product_reference?: string
  supported_printers?: string[]
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface LabelDesign {
  id: string
  user_id: string
  label_base_id: string
  name: string
  description?: string
  elements: any[] // EditorElement[] - using any to avoid circular dependency
  width_px: number
  height_px: number
  dpi?: number
  thumbnail_url?: string
  is_template: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

