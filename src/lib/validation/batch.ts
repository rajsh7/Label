import { z } from 'zod'
import { batchJobSchema, csvRowSchema, columnMappingSchema } from './schemas'

/**
 * Batch processing validation utilities
 */

/**
 * Validate CSV data has minimum required rows
 */
export function validateCSVRowCount(rows: unknown[]): {
  valid: boolean
  error?: string
} {
  if (!Array.isArray(rows)) {
    return { valid: false, error: 'CSV data must be an array' }
  }

  if (rows.length === 0) {
    return { valid: false, error: 'CSV data cannot be empty' }
  }

  if (rows.length > 10000) {
    return { valid: false, error: 'CSV data cannot exceed 10,000 rows' }
  }

  return { valid: true }
}

/**
 * Validate CSV row structure
 */
export function validateCSVRow(row: unknown, rowIndex: number): {
  valid: boolean
  error?: string
} {
  try {
    csvRowSchema.parse(row)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: `Row ${rowIndex + 1}: ${error.errors.map((e) => e.message).join(', ')}`,
      }
    }
    return { valid: false, error: `Row ${rowIndex + 1}: Invalid data format` }
  }
}

/**
 * Validate column mapping
 */
export function validateColumnMapping(
  mapping: unknown,
  csvHeaders: string[]
): {
  valid: boolean
  error?: string
  data?: Record<string, string>
} {
  try {
    const validated = columnMappingSchema.parse(mapping)

    // Check that all mapped columns exist in CSV
    const mappedColumns = Object.values(validated)
    const invalidColumns = mappedColumns.filter((col) => !csvHeaders.includes(col))

    if (invalidColumns.length > 0) {
      return {
        valid: false,
        error: `Mapped columns not found in CSV: ${invalidColumns.join(', ')}`,
      }
    }

    return { valid: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return { valid: false, error: 'Invalid column mapping format' }
  }
}

/**
 * Validate batch job input
 */
export function validateBatchJobInput(input: unknown): {
  valid: boolean
  error?: string
  data?: z.infer<typeof batchJobSchema>
} {
  try {
    const validated = batchJobSchema.parse(input)

    // Additional validation
    const rowCountCheck = validateCSVRowCount(validated.csv_data)
    if (!rowCountCheck.valid) {
      return rowCountCheck
    }

    // Validate each row
    for (let i = 0; i < validated.csv_data.length; i++) {
      const rowCheck = validateCSVRow(validated.csv_data[i], i)
      if (!rowCheck.valid) {
        return rowCheck
      }
    }

    // Validate column mapping if provided
    if (validated.column_mapping) {
      const csvHeaders = validated.csv_data.length > 0 ? Object.keys(validated.csv_data[0]) : []
      const mappingCheck = validateColumnMapping(validated.column_mapping, csvHeaders)
      if (!mappingCheck.valid) {
        return {
          valid: false,
          error: mappingCheck.error
        }
      }
    }

    return { valid: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }
    return { valid: false, error: 'Invalid batch job data' }
  }
}

/**
 * Extract CSV headers from data
 */
export function extractCSVHeaders(csvData: Record<string, any>[]): string[] {
  if (csvData.length === 0) {
    return []
  }

  return Object.keys(csvData[0])
}

/**
 * Validate required columns are mapped
 */
export function validateRequiredColumns(
  columnMapping: Record<string, string>,
  requiredColumns: string[]
): {
  valid: boolean
  error?: string
  missing?: string[]
} {
  const mappedTemplateVars = Object.keys(columnMapping)
  const missing = requiredColumns.filter((col) => !mappedTemplateVars.includes(col))

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Required columns not mapped: ${missing.join(', ')}`,
      missing,
    }
  }

  return { valid: true }
}

/**
 * Estimate batch generation time (in seconds)
 */
export function estimateBatchTime(labelCount: number): number {
  // Rough estimate: ~120ms per label
  return Math.ceil(labelCount * 0.12)
}

/**
 * Estimate batch file size (in MB)
 */
export function estimateBatchSize(labelCount: number): number {
  // Rough estimate: ~50KB per label
  return Math.ceil((labelCount * 50) / 1024)
}

