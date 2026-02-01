import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 50+ additional label definitions for comprehensive coverage
const expandedLabels = [
  // More Avery Address Labels
  { id: 'avery_5261', name: 'Avery 5261 Address (2/3" x 1-3/4")', category: 'avery', print_method: 'inkjet', width_mm: 44.45, height_mm: 16.93, width_inch: 1.75, height_inch: 0.667, width_px_203dpi: 355, height_px_203dpi: 135, width_px_300dpi: 525, height_px_300dpi: 200, notes: '80 labels per sheet' },
  { id: 'avery_5262', name: 'Avery 5262 Address (1-1/3" x 4")', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 33.866, width_inch: 4.0, height_inch: 1.333, width_px_203dpi: 812, height_px_203dpi: 271, width_px_300dpi: 1200, height_px_300dpi: 400, notes: '14 labels per sheet' },
  { id: 'avery_5263', name: 'Avery 5263 Shipping (2" x 4")', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 50.8, width_inch: 4.0, height_inch: 2.0, width_px_203dpi: 812, height_px_203dpi: 406, width_px_300dpi: 1200, height_px_300dpi: 600, notes: '10 labels per sheet' },
  { id: 'avery_5264', name: 'Avery 5264 Shipping (3-1/3" x 4")', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 84.666, width_inch: 4.0, height_inch: 3.333, width_px_203dpi: 812, height_px_203dpi: 677, width_px_300dpi: 1200, height_px_300dpi: 1000, notes: '6 labels per sheet' },
  
  // Round Labels
  { id: 'avery_5294', name: 'Avery 5294 Round (2-1/3" diameter)', category: 'avery', print_method: 'inkjet', width_mm: 59.26, height_mm: 59.26, width_inch: 2.333, height_inch: 2.333, width_px_203dpi: 474, height_px_203dpi: 474, width_px_300dpi: 700, height_px_300dpi: 700, notes: '12 labels per sheet, round' },
  { id: 'avery_22807', name: 'Avery 22807 Round (1-1/2" diameter)', category: 'avery', print_method: 'inkjet', width_mm: 38.1, height_mm: 38.1, width_inch: 1.5, height_inch: 1.5, width_px_203dpi: 305, height_px_203dpi: 305, width_px_300dpi: 450, height_px_300dpi: 450, notes: '24 labels per sheet, round' },
  { id: 'avery_22808', name: 'Avery 22808 Round (1" diameter)', category: 'avery', print_method: 'inkjet', width_mm: 25.4, height_mm: 25.4, width_inch: 1.0, height_inch: 1.0, width_px_203dpi: 203, height_px_203dpi: 203, width_px_300dpi: 300, height_px_300dpi: 300, notes: '48 labels per sheet, round' },
  
  // Square Labels
  { id: 'avery_22806', name: 'Avery 22806 Square (1-1/2" x 1-1/2")', category: 'avery', print_method: 'inkjet', width_mm: 38.1, height_mm: 38.1, width_inch: 1.5, height_inch: 1.5, width_px_203dpi: 305, height_px_203dpi: 305, width_px_300dpi: 450, height_px_300dpi: 450, notes: '24 labels per sheet, square' },
  { id: 'avery_22817', name: 'Avery 22817 Square (2" x 2")', category: 'avery', print_method: 'inkjet', width_mm: 50.8, height_mm: 50.8, width_inch: 2.0, height_inch: 2.0, width_px_203dpi: 406, height_px_203dpi: 406, width_px_300dpi: 600, height_px_300dpi: 600, notes: '12 labels per sheet, square' },
  
  // File Folder Labels
  { id: 'avery_5366', name: 'Avery 5366 File Folder (2/3" x 3-7/16")', category: 'avery', print_method: 'inkjet', width_mm: 87.31, height_mm: 16.93, width_inch: 3.4375, height_inch: 0.667, width_px_203dpi: 698, height_px_203dpi: 135, width_px_300dpi: 1031, height_px_300dpi: 200, notes: '30 labels per sheet' },
  
  // Name Badges
  { id: 'avery_5395', name: 'Avery 5395 Name Badge (2-1/3" x 3-3/8")', category: 'avery', print_method: 'inkjet', width_mm: 85.72, height_mm: 59.26, width_inch: 3.375, height_inch: 2.333, width_px_203dpi: 685, height_px_203dpi: 474, width_px_300dpi: 1013, height_px_300dpi: 700, notes: '8 labels per sheet, name badges' },
  { id: 'avery_5390', name: 'Avery 5390 Name Badge (3" x 4")', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 76.2, width_inch: 4.0, height_inch: 3.0, width_px_203dpi: 812, height_px_203dpi: 609, width_px_300dpi: 1200, height_px_300dpi: 900, notes: '6 labels per sheet' },
  
  // Diskette/CD Labels
  { id: 'avery_5931', name: 'Avery 5931 Diskette (2-11/16" x 2")', category: 'avery', print_method: 'inkjet', width_mm: 50.8, height_mm: 68.26, width_inch: 2.6875, height_inch: 2.0, width_px_203dpi: 540, height_px_203dpi: 406, width_px_300dpi: 806, height_px_300dpi: 600, notes: '14 labels per sheet' },
  
  // More Laser Labels
  { id: 'avery_8162', name: 'Avery 8162 Address (1-1/3" x 4") Laser', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 33.866, width_inch: 4.0, height_inch: 1.333, width_px_203dpi: 812, height_px_203dpi: 271, width_px_300dpi: 1200, height_px_300dpi: 400, notes: '14 labels per sheet, laser' },
  { id: 'avery_8164', name: 'Avery 8164 Shipping (3-1/3" x 4") Laser', category: 'avery', print_method: 'inkjet', width_mm: 101.6, height_mm: 84.666, width_inch: 4.0, height_inch: 3.333, width_px_203dpi: 812, height_px_203dpi: 677, width_px_300dpi: 1200, height_px_300dpi: 1000, notes: '6 labels per sheet, laser' },
  
  // Different shipping sizes
  { id: 'usps_6x4', name: 'USPS Flat Rate 6x4', category: 'usps', print_method: 'thermal', width_mm: 152.4, height_mm: 101.6, width_inch: 6.0, height_inch: 4.0, width_px_203dpi: 1218, height_px_203dpi: 812, width_px_300dpi: 1800, height_px_300dpi: 1200 },
  { id: 'fedex_6x4', name: 'FedEx Label 6x4', category: 'fedex', print_method: 'thermal', width_mm: 152.4, height_mm: 101.6, width_inch: 6.0, height_inch: 4.0, width_px_203dpi: 1218, height_px_203dpi: 812, width_px_300dpi: 1800, height_px_300dpi: 1200 },
  { id: 'ups_6x4', name: 'UPS Label 6x4', category: 'ups', print_method: 'thermal', width_mm: 152.4, height_mm: 101.6, width_inch: 6.0, height_inch: 4.0, width_px_203dpi: 1218, height_px_203dpi: 812, width_px_300dpi: 1800, height_px_300dpi: 1200 },
  
  // More Amazon sizes
  { id: 'amazon_fba_3x5', name: 'Amazon FBA 3x5 Thermal', category: 'amazon_fba', marketplace: 'Amazon', print_method: 'thermal', width_mm: 76.2, height_mm: 127, width_inch: 3.0, height_inch: 5.0, width_px_203dpi: 609, height_px_203dpi: 1015, width_px_300dpi: 900, height_px_300dpi: 1500 },
  { id: 'amazon_fba_2x4', name: 'Amazon FBA 2x4 Thermal', category: 'amazon_fba', marketplace: 'Amazon', print_method: 'thermal', width_mm: 50.8, height_mm: 101.6, width_inch: 2.0, height_inch: 4.0, width_px_203dpi: 406, height_px_203dpi: 812, width_px_300dpi: 600, height_px_300dpi: 1200 },
  
  // More compliance sizes
  { id: 'warning_1x3', name: 'Warning Label 1" x 3"', category: 'compliance', print_method: 'inkjet', width_mm: 76.2, height_mm: 25.4, width_inch: 3.0, height_inch: 1.0, width_px_203dpi: 609, height_px_203dpi: 203, width_px_300dpi: 900, height_px_300dpi: 300 },
  { id: 'warning_2x3', name: 'Warning Label 2" x 3"', category: 'compliance', print_method: 'inkjet', width_mm: 76.2, height_mm: 50.8, width_inch: 3.0, height_inch: 2.0, width_px_203dpi: 609, height_px_203dpi: 406, width_px_300dpi: 900, height_px_300dpi: 600 },
  { id: 'warning_4x6', name: 'Warning Label 4" x 6"', category: 'compliance', print_method: 'inkjet', width_mm: 101.6, height_mm: 152.4, width_inch: 4.0, height_inch: 6.0, width_px_203dpi: 812, height_px_203dpi: 1218, width_px_300dpi: 1200, height_px_300dpi: 1800 },
  
  // Small labels for product marking
  { id: 'product_1x1', name: 'Product Label 1" x 1"', category: 'product', print_method: 'inkjet', width_mm: 25.4, height_mm: 25.4, width_inch: 1.0, height_inch: 1.0, width_px_203dpi: 203, height_px_203dpi: 203, width_px_300dpi: 300, height_px_300dpi: 300 },
  { id: 'product_1x2', name: 'Product Label 1" x 2"', category: 'product', print_method: 'inkjet', width_mm: 50.8, height_mm: 25.4, width_inch: 2.0, height_inch: 1.0, width_px_203dpi: 406, height_px_203dpi: 203, width_px_300dpi: 600, height_px_300dpi: 300 },
  { id: 'product_2x3', name: 'Product Label 2" x 3"', category: 'product', print_method: 'inkjet', width_mm: 76.2, height_mm: 50.8, width_inch: 3.0, height_inch: 2.0, width_px_203dpi: 609, height_px_203dpi: 406, width_px_300dpi: 900, height_px_300dpi: 600 },
  { id: 'product_3x4', name: 'Product Label 3" x 4"', category: 'product', print_method: 'inkjet', width_mm: 101.6, height_mm: 76.2, width_inch: 4.0, height_inch: 3.0, width_px_203dpi: 812, height_px_203dpi: 609, width_px_300dpi: 1200, height_px_300dpi: 900 },
]

async function seedExpandedLabels() {
  console.log('🏷️  Seeding expanded label library...')
  console.log(`📦 Additional labels to seed: ${expandedLabels.length}\n`)

  try {
    const { count: currentCount } = await supabase.from('labels').select('*', { count: 'exact' })
    console.log(`📊 Current labels: ${currentCount}`)

    let successCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const label of expandedLabels) {
      const { data: existing } = await supabase.from('labels').select('id').eq('id', label.id).single()
      
      if (existing) {
        console.log(`⏭️  Skipped: ${label.name}`)
        skippedCount++
        continue
      }

      const { error } = await supabase.from('labels').insert([label])

      if (error) {
        console.error(`❌ Error: "${label.name}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ ${label.name}`)
        successCount++
      }
    }

    const { count: finalCount } = await supabase.from('labels').select('*', { count: 'exact' })

    console.log(`\n📊 Summary:`)
    console.log(`  ✅ Inserted: ${successCount}`)
    console.log(`  ⏭️  Skipped: ${skippedCount}`)
    console.log(`  ❌ Failed: ${errorCount}`)
    console.log(`  📦 Total labels: ${finalCount}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

seedExpandedLabels()
