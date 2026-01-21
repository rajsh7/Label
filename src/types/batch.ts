/**
 * Batch processing type definitions
 * Based on database schema
 */

export type BatchJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'canceled'

export interface BatchJob {
  id: string
  user_id: string
  template_id?: string
  design_id?: string
  file_url?: string
  data_rows: Record<string, any>[] // CSV data as JSON array
  column_mapping: Record<string, string> // Map CSV columns to template variables
  total_labels: number
  generated_labels: number
  status: BatchJobStatus
  error_message?: string
  output_file_url?: string
  created_at: string
  completed_at?: string
}

export interface CreateBatchJobInput {
  template_id?: string
  design_id?: string
  csv_data: Record<string, any>[]
  column_mapping: Record<string, string>
  total_labels: number
}

export interface BatchJobProgress {
  batch_id: string
  total: number
  completed: number
  status: BatchJobStatus
  error?: string
}

