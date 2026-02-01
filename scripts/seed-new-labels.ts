import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Additional label definitions to seed
const newLabels = [
  // Avery Labels
  {
    id: 'avery_5160',
    name: 'Avery 5160 Address (1" x 2-5/8")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 66.675,
    height_mm: 25.4,
    width_inch: 2.625,
    height_inch: 1.0,
   width_px_203dpi: 533,
    height_px_203dpi: 203,
    width_px_300dpi: 788,
    height_px_300dpi: 300,
    notes: '30 labels per sheet, 3 columns x 10 rows',
  },
  {
    id: 'avery_5161',
    name: 'Avery 5161 Address (1" x 4")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 25.4,
    width_inch: 4.0,
    height_inch: 1.0,
    width_px_203dpi: 812,
    height_px_203dpi: 203,
    width_px_300dpi: 1200,
    height_px_300dpi: 300,
    notes: '20 labels per sheet, 2 columns x 10 rows',
  },
  {
    id: 'avery_5162',
    name: 'Avery 5162 Address (1-1/3" x 4")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 33.866,
    width_inch: 4.0,
    height_inch: 1.333,
    width_px_203dpi: 812,
    height_px_203dpi: 271,
    width_px_300dpi: 1200,
    height_px_300dpi: 400,
    notes: '14 labels per sheet, 2 columns x 7 rows',
  },
  {
    id: 'avery_5163',
    name: 'Avery 5163 Shipping (2" x 4")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 50.8,
    width_inch: 4.0,
    height_inch: 2.0,
    width_px_203dpi: 812,
    height_px_203dpi: 406,
    width_px_300dpi: 1200,
    height_px_300dpi: 600,
    notes: '10 labels per sheet, 2 columns x 5 rows',
  },
  {
    id: 'avery_5164',
    name: 'Avery 5164 Shipping (3-1/3" x 4")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 84.666,
    width_inch: 4.0,
    height_inch: 3.333,
    width_px_203dpi: 812,
    height_px_203dpi: 677,
    width_px_300dpi: 1200,
    height_px_300dpi: 1000,
    notes: '6 labels per sheet, 2 columns x 3 rows',
  },
  {
    id: 'avery_5167',
    name: 'Avery 5167 Return Address (1/2" x 1-3/4")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 44.45,
    height_mm: 12.7,
    width_inch: 1.75,
    height_inch: 0.5,
    width_px_203dpi: 355,
    height_px_203dpi: 102,
    width_px_300dpi: 525,
    height_px_300dpi: 150,
    notes: '80 labels per sheet, 4 columns x 20 rows',
  },
  {
    id: 'avery_full_sheet',
    name: 'Avery Full Sheet (8-1/2" x 11")',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 215.9,
    height_mm: 279.4,
    width_inch: 8.5,
    height_inch: 11.0,
    width_px_203dpi: 1727,
    height_px_203dpi: 2234,
    width_px_300dpi: 2550,
    height_px_300dpi: 3300,
    notes: '1 label per sheet, full page',
  },
  {
    id: 'avery_8160',
    name: 'Avery 8160 Address (1" x 2-5/8") Laser',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 66.675,
    height_mm: 25.4,
    width_inch: 2.625,
    height_inch: 1.0,
    width_px_203dpi: 533,
    height_px_203dpi: 203,
    width_px_300dpi: 788,
    height_px_300dpi: 300,
    notes: '30 labels per sheet, laser printer compatible',
  },
  {
    id: 'avery_8163',
    name: 'Avery 8163 Shipping (2" x 4") Laser',
    category: 'avery',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 50.8,
    width_inch: 4.0,
    height_inch: 2.0,
    width_px_203dpi: 812,
    height_px_203dpi: 406,
    width_px_300dpi: 1200,
    height_px_300dpi: 600,
    notes: '10 labels per sheet, laser printer',
  },
  // Shipping Labels
  {
    id: 'usps_4x6',
    name: 'USPS Priority Mail 4x6',
    category: 'usps',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'IMB',
  },
  {
    id: 'fedex_4x6',
    name: 'FedEx Shipping Label 4x6',
    category: 'fedex',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
  },
  {
    id: 'ups_4x6',
    name: 'UPS Shipping Label 4x6',
    category: 'ups',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
  },
  {
    id: 'dhl_4x6',
    name: 'DHL Express Label 4x6',
    category: 'dhl',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
  },
  // Compliance/Warning Labels
  {
    id: 'warning_2x2',
    name: 'Warning Label 2" x 2"',
    category: 'compliance',
    print_method: 'inkjet',
    width_mm: 50.8,
    height_mm: 50.8,
    width_inch: 2.0,
    height_inch: 2.0,
    width_px_203dpi: 406,
    height_px_203dpi: 406,
    width_px_300dpi: 600,
    height_px_300dpi: 600,
  },
  {
    id: 'warning_3x3',
    name: 'Warning Label 3" x 3"',
    category: 'compliance',
    print_method: 'inkjet',
    width_mm: 76.2,
    height_mm: 76.2,
    width_inch: 3.0,
    height_inch: 3.0,
    width_px_203dpi: 609,
    height_px_203dpi: 609,
    width_px_300dpi: 900,
    height_px_300dpi: 900,
  },
  {
    id: 'warning_4x4',
    name: 'Warning Label 4" x 4"',
    category: 'compliance',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 101.6,
    width_inch: 4.0,
    height_inch: 4.0,
    width_px_203dpi: 812,
    height_px_203dpi: 812,
    width_px_300dpi: 1200,
    height_px_300dpi: 1200,
  },
]

async function seedNewLabels() {
  console.log('🏷️  Starting new label seeding...')
  console.log(`📦 Total labels to seed: ${newLabels.length}\n`)

  try {
    // Check current label count
    const { count: currentCount } = await supabase
      .from('labels')
      .select('*', { count: 'exact' })

    console.log(`📊 Current labels in database: ${currentCount}`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (const label of newLabels) {
      // Check if label already exists
      const { data: existing } = await supabase
        .from('labels')
        .select('id')
        .eq('id', label.id)
        .single()

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${label.name}`)
        skippedCount++
        continue
      }

      const { error } = await supabase.from('labels').insert([label])

      if (error) {
        console.error(`❌ Error inserting "${label.name}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Inserted: ${label.name}`)
        successCount++
      }
    }

    // Final count
    const { count: finalCount } = await supabase
      .from('labels')
      .select('*', { count: 'exact' })

    console.log(`\n📊 Seeding Summary:`)
    console.log(`  ✅ Successfully inserted: ${successCount} labels`)
    console.log(`  ⏭️  Skipped (already exist): ${skippedCount} labels`)
    if (errorCount > 0) {
      console.log(`  ❌ Failed: ${errorCount} labels`)
    }
    console.log(`  📦 Total labels in database: ${finalCount}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

seedNewLabels()
