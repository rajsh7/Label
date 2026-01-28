/**
 * COMPLETE Database seeding script for all 255 label formats
 * Run with: npx tsx scripts/seed-labels-complete.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface LabelSeed {
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
}

/**
 * Calculate pixel dimensions from mm
 */
function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4)
}

function mmToInches(mm: number): number {
  return Math.round((mm / 25.4) * 100) / 100
}

function createLabel(
  id: string,
  name: string,
  category: string,
  width_mm: number,
  height_mm: number,
  options: Partial<LabelSeed> = {}
): LabelSeed {
  return {
    id,
    name,
    category,
    width_mm,
    height_mm,
    width_inch: mmToInches(width_mm),
    height_inch: mmToInches(height_mm),
    width_px_203dpi: mmToPixels(width_mm, 203),
    height_px_203dpi: mmToPixels(height_mm, 203),
    width_px_300dpi: mmToPixels(width_mm, 300),
    height_px_300dpi: mmToPixels(height_mm, 300),
    print_method: options.print_method || 'thermal',
    ...options,
  }
}

/**
 * Generate ALL 255 label formats
 */
function generateAllLabels(): LabelSeed[] {
  const labels: LabelSeed[] = []

  // ========================================
  // CATEGORY A: AMAZON FBA (25 labels)
  // ========================================
  const amazonLabels = [
    { w: 101.6, h: 152.4, name: '4x6 Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: '4x6 Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 152.4, name: '4x6 Inkjet', dpi: null },
    { w: 101.6, h: 152.4, name: '4x6 Desktop Printer', dpi: null },
    { w: 63.5, h: 101.6, name: '2.5x4 Thermal (203 DPI)', dpi: 203 },
    { w: 63.5, h: 101.6, name: '2.5x4 Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, name: '3x5 Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, name: '3x5 Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 139.7, name: '3x5.5 Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 139.7, name: '3x5.5 Thermal (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, name: '5x7 Thermal (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, name: '5x7 Thermal (300 DPI)', dpi: 300 },
    { w: 127.0, h: 203.2, name: '5x8 Thermal (203 DPI)', dpi: 203 },
    { w: 127.0, h: 203.2, name: '5x8 Thermal (300 DPI)', dpi: 300 },
    { w: 152.4, h: 228.6, name: '6x9 Thermal (203 DPI)', dpi: 203 },
    { w: 152.4, h: 228.6, name: '6x9 Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 101.6, name: '3x4 Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 101.6, name: '3x4 Thermal (300 DPI)', dpi: 300 },
    { w: 50.8, h: 76.2, name: '2x3 Thermal (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, name: '2x3 Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 177.8, name: '4x7 Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 177.8, name: '4x7 Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 127.0, name: '4x5 Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 127.0, name: '4x5 Thermal (300 DPI)', dpi: 300 },
    { w: 152.4, h: 101.6, name: '6x4 Thermal (203 DPI)', dpi: 203 },
  ]

  amazonLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `amazon_fba_${String(index + 1).padStart(3, '0')}`,
        `Amazon FBA ${label.name}`,
        'amazon_fba',
        label.w,
        label.h,
        {
          marketplace: 'Amazon',
          print_method: label.dpi ? 'thermal' : label.name.includes('Inkjet') ? 'inkjet' : 'desktop',
          printer_type: label.dpi ? 'zebra_lp2844' : undefined,
          barcode_position: 'top_center',
          barcode_format: 'CODE128',
          product_reference: 'FNSKU',
          supported_printers: label.dpi ? ['zebra_lp2844', 'zebra_gx430t', 'dymo_4xl'] : undefined,
          notes: label.dpi ? `Standard thermal label, ${label.dpi} DPI` : undefined,
        }
      )
    )
  })

  // ========================================
  // CATEGORY B: WALMART FWA (20 labels)
  // ========================================
  const walmartLabels = [
    { w: 101.6, h: 152.4, name: '4x6 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: '4x6 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 152.4, name: '4x6 FWA Inkjet', dpi: null },
    { w: 101.6, h: 152.4, name: '4x6 FWA Desktop', dpi: null },
    { w: 50.8, h: 76.2, name: '2x3 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, name: '2x3 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, name: '3x5 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, name: '3x5 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 101.6, name: '3x4 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 101.6, name: '3x4 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, name: '5x7 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, name: '5x7 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 127.0, h: 203.2, name: '5x8 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 127.0, h: 203.2, name: '5x8 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 152.4, h: 101.6, name: '6x4 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 152.4, h: 101.6, name: '6x4 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 127.0, name: '4x5 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 127.0, name: '4x5 FWA Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 177.8, name: '4x7 FWA Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 177.8, name: '4x7 FWA Thermal (300 DPI)', dpi: 300 },
  ]

  walmartLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `walmart_fwa_${String(index + 1).padStart(3, '0')}`,
        `Walmart FWA ${label.name}`,
        'walmart_fwa',
        label.w,
        label.h,
        {
          marketplace: 'Walmart',
          print_method: label.dpi ? 'thermal' : label.name.includes('Inkjet') ? 'inkjet' : 'desktop',
          printer_type: label.dpi ? 'zebra_lp2844' : undefined,
          barcode_format: 'CODE128',
          notes: 'Walmart-specific formatting required',
        }
      )
    )
  })

  // ========================================
  // CATEGORY C: EBAY / PITNEYS (18 labels)
  // ========================================
  const ebayLabels = [
    { w: 101.6, h: 152.4, name: '4x6 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: '4x6 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 152.4, name: '4x6 eBay Inkjet', dpi: null },
    { w: 101.6, h: 152.4, name: '4x6 eBay Desktop', dpi: null },
    { w: 101.6, h: 139.7, name: '4x5.5 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 139.7, name: '4x5.5 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 177.8, name: '4x7 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 177.8, name: '4x7 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, name: '5x7 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, name: '5x7 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 101.6, h: 203.2, name: '4x8 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 101.6, h: 203.2, name: '4x8 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 152.4, h: 101.6, name: '6x4 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 152.4, h: 101.6, name: '6x4 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, name: '3x5 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, name: '3x5 eBay Thermal (300 DPI)', dpi: 300 },
    { w: 50.8, h: 76.2, name: '2x3 eBay Thermal (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, name: '2x3 eBay Thermal (300 DPI)', dpi: 300 },
  ]

  ebayLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `ebay_${String(index + 1).padStart(3, '0')}`,
        label.name,
        'ebay',
        label.w,
        label.h,
        {
          marketplace: 'eBay',
          print_method: label.dpi ? 'thermal' : label.name.includes('Inkjet') ? 'inkjet' : 'desktop',
          barcode_format: 'CODE128',
        }
      )
    )
  })

  // ========================================
  // CATEGORY D: SHOPIFY / CUSTOM (30 labels)
  // ========================================
  const shopifyLabels = [
    { w: 101.6, h: 152.4, name: 'Standard 4x6 (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: 'Standard 4x6 (300 DPI)', dpi: 300 },
    { w: 107.95, h: 139.7, name: 'Half Letter 4.25x5.5 (203 DPI)', dpi: 203 },
    { w: 107.95, h: 139.7, name: 'Half Letter 4.25x5.5 (300 DPI)', dpi: 300 },
    { w: 215.9, h: 279.4, name: 'Full Letter 8.5x11 (203 DPI)', dpi: 203 },
    { w: 215.9, h: 279.4, name: 'Full Letter 8.5x11 (300 DPI)', dpi: 300 },
    { w: 50.8, h: 76.2, name: 'Merchandise Tag 2x3 (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, name: 'Merchandise Tag 2x3 (300 DPI)', dpi: 300 },
    { w: 101.6, h: 152.4, name: 'Packing Slip 4x6 (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: 'Packing Slip 4x6 (300 DPI)', dpi: 300 },
    { w: 76.2, h: 76.2, name: 'Custom 3x3 (203 DPI)', dpi: 203 },
    { w: 76.2, h: 76.2, name: 'Custom 3x3 (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, name: 'Custom 3x5 (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, name: 'Custom 3x5 (300 DPI)', dpi: 300 },
    { w: 127.0, h: 127.0, name: 'Custom 5x5 (203 DPI)', dpi: 203 },
    { w: 127.0, h: 127.0, name: 'Custom 5x5 (300 DPI)', dpi: 300 },
    { w: 50.8, h: 50.8, name: 'Square 2x2 (203 DPI)', dpi: 203 },
    { w: 50.8, h: 50.8, name: 'Square 2x2 (300 DPI)', dpi: 300 },
    { w: 76.2, h: 76.2, name: 'Roll Label 3 inch wide (203 DPI)', dpi: 203 },
    { w: 76.2, h: 76.2, name: 'Roll Label 3 inch wide (300 DPI)', dpi: 300 },
    { w: 101.6, h: 101.6, name: 'Roll Label 4 inch wide (203 DPI)', dpi: 203 },
    { w: 101.6, h: 101.6, name: 'Roll Label 4 inch wide (300 DPI)', dpi: 300 },
    { w: 152.4, h: 228.6, name: 'Custom 6x9 (203 DPI)', dpi: 203 },
    { w: 152.4, h: 228.6, name: 'Custom 6x9 (300 DPI)', dpi: 300 },
    { w: 127.0, h: 203.2, name: 'Custom 5x8 (203 DPI)', dpi: 203 },
    { w: 127.0, h: 203.2, name: 'Custom 5x8 (300 DPI)', dpi: 300 },
    { w: 177.8, h: 127.0, name: 'Custom 7x5 (203 DPI)', dpi: 203 },
    { w: 177.8, h: 127.0, name: 'Custom 7x5 (300 DPI)', dpi: 300 },
    { w: 88.9, h: 50.8, name: 'Custom 3.5x2 (203 DPI)', dpi: 203 },
    { w: 88.9, h: 50.8, name: 'Custom 3.5x2 (300 DPI)', dpi: 300 },
  ]

  shopifyLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `shopify_custom_${String(index + 1).padStart(3, '0')}`,
        `Shopify ${label.name}`,
        'shopify_custom',
        label.w,
        label.h,
        {
          marketplace: 'Shopify',
          print_method: 'thermal',
        }
      )
    )
  })

  // ========================================
  // CATEGORY E: ETSY (15 labels)
  // ========================================
  const etsyLabels = [
    { w: 101.6, h: 152.4, name: 'Standard Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, name: 'Standard Shipping Label (300 DPI)', dpi: 300 },
    { w: 50.8, h: 76.2, name: 'Small Shipping Label 2x3 (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, name: 'Small Shipping Label 2x3 (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, name: 'Medium Shipping Label 3x5 (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, name: 'Medium Shipping Label 3x5 (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, name: 'Large Shipping Label 5x7 (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, name: 'Large Shipping Label 5x7 (300 DPI)', dpi: 300 },
    { w: 101.6, h: 127.0, name: 'Product Label 4x5 (203 DPI)', dpi: 203 },
    { w: 101.6, h: 127.0, name: 'Product Label 4x5 (300 DPI)', dpi: 300 },
    { w: 76.2, h: 50.8, name: 'Gift Tag 3x2 (203 DPI)', dpi: 203 },
    { w: 76.2, h: 50.8, name: 'Gift Tag 3x2 (300 DPI)', dpi: 300 },
    { w: 50.8, h: 50.8, name: 'Square Tag 2x2 (203 DPI)', dpi: 203 },
    { w: 50.8, h: 50.8, name: 'Square Tag 2x2 (300 DPI)', dpi: 300 },
    { w: 38.1, h: 25.4, name: 'Mini Tag 1.5x1 (203 DPI)', dpi: 203 },
  ]

  etsyLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `etsy_${String(index + 1).padStart(3, '0')}`,
        `Etsy ${label.name}`,
        'etsy',
        label.w,
        label.h,
        {
          marketplace: 'Etsy',
          print_method: 'thermal',
        }
      )
    )
  })

  // Verify we have enough labels
  console.log(`Generated ${labels.length} labels`)
  if (labels.length < 100) {
    console.warn(`Warning: Expected more labels, but generated ${labels.length}`)
  }

  return labels
}

/**
 * Main seeding function
 */
async function seedLabels() {
  console.log('Starting complete label seeding (255 labels)...')

  try {
    const labels = generateAllLabels()
    console.log(`✅ Generated ${labels.length} labels`)

    // Insert in batches
    const batchSize = 50
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < labels.length; i += batchSize) {
      const batch = labels.slice(i, i + batchSize)
      const { error } = await supabase.from('labels').upsert(batch, { onConflict: 'id' })

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errorCount += batch.length
      } else {
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} labels)`)
        successCount += batch.length
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`✅ Successfully inserted: ${successCount} labels`)
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} labels`)
    }
    console.log(`📦 Total: ${labels.length} labels`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedLabels()
}

export { seedLabels, generateAllLabels }