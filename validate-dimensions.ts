/**
 * Dimension validation and correction script
 * Checks and fixes all label dimensions for accuracy
 */

// Conversion functions
function mmToInches(mm: number): number {
  return Math.round((mm / 25.4) * 10000) / 10000 // 4 decimal places
}

function inchesToMm(inches: number): number {
  return Math.round((inches * 25.4) * 1000) / 1000 // 3 decimal places
}

function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4)
}

// Validate and correct LabTag dimensions
const labTagCorrections = [
  // Real Data Labels - verified from original JSON
  { id: 'cl_50t1_wh', width_mm: 35.052, height_mm: 35.052, width_inch: 1.38, height_inch: 1.38 },
  { id: 'cl_6t1', width_mm: 36.068, height_mm: 13.97, width_inch: 1.42, height_inch: 0.55 },
  { id: 'cl_44t1_wh', width_mm: 36.068, height_mm: 25.4, width_inch: 1.42, height_inch: 1.0 },
  { id: 'cl_12t1', width_mm: 23.876, height_mm: 12.7, width_inch: 0.94, height_inch: 0.5 },
  { id: 'cl_4t1', width_mm: 23.876, height_mm: 19.558, width_inch: 0.94, height_inch: 0.77 },
  { id: 'cl_69t1_wh', width_mm: 28.575, height_mm: 44.45, width_inch: 1.125, height_inch: 1.75 },
  { id: 'tr_jtta-161c1-2ga', width_mm: 30.1625, height_mm: 25.4, width_inch: 1.1875, height_inch: 1.0 },
  { id: 'tr_jtta-9', width_mm: 31.75, height_mm: 22.225, width_inch: 1.25, height_inch: 0.875 },
  { id: 'tr_jtta-560sb', width_mm: 23.876, height_mm: 12.7, width_inch: 0.94, height_inch: 0.5 },
  { id: 'tr_jtta-104', width_mm: 12.7, height_mm: 34.925, width_inch: 0.5, height_inch: 1.375 },
  { id: 'tr_jtta-176', width_mm: 13.97, height_mm: 69.85, width_inch: 0.55, height_inch: 2.75 },
  { id: 'tr_jtta-531', width_mm: 12.7, height_mm: 50.8, width_inch: 0.5, height_inch: 2.0 },
  { id: 'tr_jtta-162', width_mm: 12.7, height_mm: 25.4, width_inch: 0.5, height_inch: 1.0 },
  { id: 'tr_jtta-255', width_mm: 9.525, height_mm: 9.525, width_inch: 0.375, height_inch: 0.375 },
  { id: 'tr_jtta-18', width_mm: 31.75, height_mm: 12.7, width_inch: 1.25, height_inch: 0.5 },
  
  // Catalog Labels - corrected from catalog data
  { id: 'labtag_us_3', width_mm: 66.802, height_mm: 25.4, width_inch: 2.63, height_inch: 1.0 },
  { id: 'labtag_us_4', width_mm: 23.876, height_mm: 19.558, width_inch: 0.94, height_inch: 0.77 },
  { id: 'labtag_us_6', width_mm: 36.068, height_mm: 13.97, width_inch: 1.42, height_inch: 0.55 },
  { id: 'labtag_us_12', width_mm: 23.876, height_mm: 12.7, width_inch: 0.94, height_inch: 0.5 },
  { id: 'labtag_us_44', width_mm: 36.068, height_mm: 25.4, width_inch: 1.42, height_inch: 1.0 },
  { id: 'labtag_us_50', width_mm: 35.052, height_mm: 35.052, width_inch: 1.38, height_inch: 1.38 }
]

// Validate dimensions
console.log('🔍 Validating LabTag Label Dimensions...\n')

labTagCorrections.forEach(label => {
  const calculatedWidthInch = mmToInches(label.width_mm)
  const calculatedHeightInch = mmToInches(label.height_mm)
  
  const widthInchMatch = Math.abs(calculatedWidthInch - label.width_inch) < 0.001
  const heightInchMatch = Math.abs(calculatedHeightInch - label.height_inch) < 0.001
  
  console.log(`${label.id}:`)
  console.log(`  Width:  ${label.width_mm}mm (${label.width_inch}") ${widthInchMatch ? '✅' : '❌'}`)
  console.log(`  Height: ${label.height_mm}mm (${label.height_inch}") ${heightInchMatch ? '✅' : '❌'}`)
  
  if (!widthInchMatch || !heightInchMatch) {
    console.log(`  📐 Calculated: ${calculatedWidthInch}" × ${calculatedHeightInch}"`)
  }
  console.log('')
})

export { labTagCorrections, mmToInches, inchesToMm, mmToPixels }