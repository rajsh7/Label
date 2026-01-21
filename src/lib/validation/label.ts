import { z } from 'zod'
import { labelBaseSchema } from './schemas'

/**
 * Label-specific validation utilities
 */

/**
 * Validate label dimensions are reasonable
 */
export function validateLabelDimensions(width_mm: number, height_mm: number): {
  valid: boolean
  error?: string
} {
  // Minimum label size (1mm x 1mm)
  if (width_mm < 1 || height_mm < 1) {
    return { valid: false, error: 'Label dimensions must be at least 1mm' }
  }

  // Maximum label size (500mm x 500mm - very large format)
  if (width_mm > 500 || height_mm > 500) {
    return { valid: false, error: 'Label dimensions exceed maximum size (500mm)' }
  }

  // Aspect ratio check (prevent extremely wide or tall labels)
  const aspectRatio = width_mm / height_mm
  if (aspectRatio > 10 || aspectRatio < 0.1) {
    return {
      valid: false,
      error: 'Label aspect ratio is too extreme (max 10:1 or 1:10)',
    }
  }

  return { valid: true }
}

/**
 * Validate label ID format
 */
export function validateLabelId(id: string): boolean {
  // UUID format or custom format (e.g., 'amazon_fba_001')
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const customIdRegex = /^[a-z_]+_[0-9]{3}$/i

  return uuidRegex.test(id) || customIdRegex.test(id)
}

/**
 * Validate label name
 */
export function validateLabelName(name: string): {
  valid: boolean
  error?: string
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Label name is required' }
  }

  if (name.length > 200) {
    return { valid: false, error: 'Label name is too long (max 200 characters)' }
  }

  return { valid: true }
}

/**
 * Validate print method
 */
export function validatePrintMethod(method: string): method is 'thermal' | 'inkjet' | 'desktop' {
  return ['thermal', 'inkjet', 'desktop'].includes(method)
}

/**
 * Validate DPI values
 */
export function validateDPI(dpi: number): boolean {
  return dpi === 203 || dpi === 300 || (dpi >= 100 && dpi <= 600)
}

/**
 * Calculate pixel dimensions from mm and DPI
 */
export function mmToPixels(mm: number, dpi: number): number {
  const inches = mm / 25.4
  return Math.round(inches * dpi)
}

/**
 * Validate pixel dimensions match physical dimensions
 */
export function validatePixelDimensions(
  width_mm: number,
  height_mm: number,
  width_px: number,
  height_px: number,
  dpi: number
): { valid: boolean; error?: string } {
  const expectedWidthPx = mmToPixels(width_mm, dpi)
  const expectedHeightPx = mmToPixels(height_mm, dpi)

  // Allow 1 pixel tolerance for rounding
  if (Math.abs(width_px - expectedWidthPx) > 1) {
    return {
      valid: false,
      error: `Width in pixels (${width_px}) does not match expected ${expectedWidthPx}px for ${width_mm}mm at ${dpi} DPI`,
    }
  }

  if (Math.abs(height_px - expectedHeightPx) > 1) {
    return {
      valid: false,
      error: `Height in pixels (${height_px}) does not match expected ${expectedHeightPx}px for ${height_mm}mm at ${dpi} DPI`,
    }
  }

  return { valid: true }
}

/**
 * Validate complete label object
 */
export function validateLabel(label: unknown): {
  valid: boolean
  error?: string
  data?: z.infer<typeof labelBaseSchema>
} {
  try {
    const validated = labelBaseSchema.parse(label)

    // Additional dimension validation
    const dimensionCheck = validateLabelDimensions(validated.width_mm, validated.height_mm)
    if (!dimensionCheck.valid) {
      return dimensionCheck
    }

    // Validate pixel dimensions if provided
    if (validated.width_px_203dpi && validated.height_px_203dpi) {
      const pixelCheck = validatePixelDimensions(
        validated.width_mm,
        validated.height_mm,
        validated.width_px_203dpi,
        validated.height_px_203dpi,
        203
      )
      if (!pixelCheck.valid) {
        return pixelCheck
      }
    }

    if (validated.width_px_300dpi && validated.height_px_300dpi) {
      const pixelCheck = validatePixelDimensions(
        validated.width_mm,
        validated.height_mm,
        validated.width_px_300dpi,
        validated.height_px_300dpi,
        300
      )
      if (!pixelCheck.valid) {
        return pixelCheck
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
    return { valid: false, error: 'Invalid label data' }
  }
}

