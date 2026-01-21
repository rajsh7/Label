/**
 * Dimension conversion utilities
 * Convert between mm, inches, pixels at different DPIs
 */

/**
 * Convert millimeters to inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4
}

/**
 * Convert inches to millimeters
 */
export function inchesToMm(inches: number): number {
  return inches * 25.4
}

/**
 * Convert millimeters to pixels at a given DPI
 */
export function mmToPixels(mm: number, dpi: number): number {
  const inches = mmToInches(mm)
  return Math.round(inches * dpi)
}

/**
 * Convert pixels to millimeters at a given DPI
 */
export function pixelsToMm(pixels: number, dpi: number): number {
  const inches = pixels / dpi
  return inchesToMm(inches)
}

/**
 * Convert inches to pixels at a given DPI
 */
export function inchesToPixels(inches: number, dpi: number): number {
  return Math.round(inches * dpi)
}

/**
 * Convert pixels to inches at a given DPI
 */
export function pixelsToInches(pixels: number, dpi: number): number {
  return pixels / dpi
}

/**
 * Common label sizes in mm
 */
export const COMMON_LABEL_SIZES_MM = {
  // Standard sizes
  '2x3': { width: 50.8, height: 76.2 },
  '2.5x4': { width: 63.5, height: 101.6 },
  '3x4': { width: 76.2, height: 101.6 },
  '3x5': { width: 76.2, height: 127.0 },
  '3x5.5': { width: 76.2, height: 139.7 },
  '4x5': { width: 101.6, height: 127.0 },
  '4x5.5': { width: 101.6, height: 139.7 },
  '4x6': { width: 101.6, height: 152.4 },
  '4x7': { width: 101.6, height: 177.8 },
  '4x8': { width: 101.6, height: 203.2 },
  '4x10': { width: 101.6, height: 254.0 },
  '5x7': { width: 127.0, height: 177.8 },
  '5x8': { width: 127.0, height: 203.2 },
  '6x4': { width: 152.4, height: 101.6 },
  '6x9': { width: 152.4, height: 228.6 },
  '8x11': { width: 203.2, height: 279.4 },
} as const

/**
 * Common label sizes in inches
 */
export const COMMON_LABEL_SIZES_INCHES = {
  '2x3': { width: 2.0, height: 3.0 },
  '2.5x4': { width: 2.5, height: 4.0 },
  '3x4': { width: 3.0, height: 4.0 },
  '3x5': { width: 3.0, height: 5.0 },
  '3x5.5': { width: 3.0, height: 5.5 },
  '4x5': { width: 4.0, height: 5.0 },
  '4x5.5': { width: 4.0, height: 5.5 },
  '4x6': { width: 4.0, height: 6.0 },
  '4x7': { width: 4.0, height: 7.0 },
  '4x8': { width: 4.0, height: 8.0 },
  '4x10': { width: 4.0, height: 10.0 },
  '5x7': { width: 5.0, height: 7.0 },
  '5x8': { width: 5.0, height: 8.0 },
  '6x4': { width: 6.0, height: 4.0 },
  '6x9': { width: 6.0, height: 9.0 },
  '8x11': { width: 8.0, height: 11.0 },
} as const

/**
 * Get pixel dimensions for a label size at given DPI
 */
export function getLabelPixelDimensions(
  widthMm: number,
  heightMm: number,
  dpi: number
): { width: number; height: number } {
  return {
    width: mmToPixels(widthMm, dpi),
    height: mmToPixels(heightMm, dpi),
  }
}

/**
 * Get pixel dimensions for both 203 and 300 DPI
 */
export function getLabelPixelDimensionsBoth(
  widthMm: number,
  heightMm: number
): {
  width203: number
  height203: number
  width300: number
  height300: number
} {
  return {
    width203: mmToPixels(widthMm, 203),
    height203: mmToPixels(heightMm, 203),
    width300: mmToPixels(widthMm, 300),
    height300: mmToPixels(heightMm, 300),
  }
}

/**
 * Round to 2 decimal places for display
 */
export function roundToDecimal(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Format dimension for display
 */
export function formatDimension(
  value: number,
  unit: 'mm' | 'inch' | 'px',
  decimals: number = 1
): string {
  return `${roundToDecimal(value, decimals)}${unit}`
}

