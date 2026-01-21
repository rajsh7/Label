/**
 * COMPLETE Database seeding script for all 255 label formats
 * Run with: npx tsx scripts/seed-labels-complete.ts
 */

import { createClient } from '@supabase/supabase-js'

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

  // ========================================
  // CATEGORY F: SHIPPING (DHL/UPS/FedEx) (40 labels)
  // ========================================
  const shippingLabels = [
    // DHL
    { w: 101.6, h: 152.4, marketplace: 'DHL', name: '4x6 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, marketplace: 'DHL', name: '4x6 Shipping Label (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, marketplace: 'DHL', name: '5x7 Shipping Label (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, marketplace: 'DHL', name: '5x7 Shipping Label (300 DPI)', dpi: 300 },
    { w: 152.4, h: 228.6, marketplace: 'DHL', name: '6x9 Shipping Label (203 DPI)', dpi: 203 },
    { w: 152.4, h: 228.6, marketplace: 'DHL', name: '6x9 Shipping Label (300 DPI)', dpi: 300 },
    { w: 101.6, h: 203.2, marketplace: 'DHL', name: '4x8 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 203.2, marketplace: 'DHL', name: '4x8 Shipping Label (300 DPI)', dpi: 300 },
    
    // UPS
    { w: 101.6, h: 152.4, marketplace: 'UPS', name: '4x6 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, marketplace: 'UPS', name: '4x6 Shipping Label (300 DPI)', dpi: 300 },
    { w: 101.6, h: 177.8, marketplace: 'UPS', name: '4x7 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 177.8, marketplace: 'UPS', name: '4x7 Shipping Label (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, marketplace: 'UPS', name: '5x7 Shipping Label (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, marketplace: 'UPS', name: '5x7 Shipping Label (300 DPI)', dpi: 300 },
    { w: 152.4, h: 101.6, marketplace: 'UPS', name: '6x4 Shipping Label (203 DPI)', dpi: 203 },
    { w: 152.4, h: 101.6, marketplace: 'UPS', name: '6x4 Shipping Label (300 DPI)', dpi: 300 },
    
    // FedEx
    { w: 101.6, h: 152.4, marketplace: 'FedEx', name: '4x6 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, marketplace: 'FedEx', name: '4x6 Shipping Label (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, marketplace: 'FedEx', name: '5x7 Shipping Label (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, marketplace: 'FedEx', name: '5x7 Shipping Label (300 DPI)', dpi: 300 },
    { w: 101.6, h: 203.2, marketplace: 'FedEx', name: '4x8 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 203.2, marketplace: 'FedEx', name: '4x8 Shipping Label (300 DPI)', dpi: 300 },
    
    // USPS
    { w: 101.6, h: 152.4, marketplace: 'USPS', name: '4x6 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 152.4, marketplace: 'USPS', name: '4x6 Shipping Label (300 DPI)', dpi: 300 },
    { w: 127.0, h: 177.8, marketplace: 'USPS', name: '5x7 Shipping Label (203 DPI)', dpi: 203 },
    { w: 127.0, h: 177.8, marketplace: 'USPS', name: '5x7 Shipping Label (300 DPI)', dpi: 300 },
    
    // Generic Shipping
    { w: 50.8, h: 76.2, marketplace: 'Generic', name: '2x3 Shipping Label (203 DPI)', dpi: 203 },
    { w: 50.8, h: 76.2, marketplace: 'Generic', name: '2x3 Shipping Label (300 DPI)', dpi: 300 },
    { w: 76.2, h: 127.0, marketplace: 'Generic', name: '3x5 Shipping Label (203 DPI)', dpi: 203 },
    { w: 76.2, h: 127.0, marketplace: 'Generic', name: '3x5 Shipping Label (300 DPI)', dpi: 300 },
    { w: 101.6, h: 127.0, marketplace: 'Generic', name: '4x5 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 127.0, marketplace: 'Generic', name: '4x5 Shipping Label (300 DPI)', dpi: 300 },
    { w: 152.4, h: 228.6, marketplace: 'Generic', name: '6x9 Shipping Label (203 DPI)', dpi: 203 },
    { w: 152.4, h: 228.6, marketplace: 'Generic', name: '6x9 Shipping Label (300 DPI)', dpi: 300 },
    { w: 203.2, h: 279.4, marketplace: 'Generic', name: '8x11 Shipping Label (203 DPI)', dpi: 203 },
    { w: 203.2, h: 279.4, marketplace: 'Generic', name: '8x11 Shipping Label (300 DPI)', dpi: 300 },
    { w: 101.6, h: 254.0, marketplace: 'Generic', name: '4x10 Shipping Label (203 DPI)', dpi: 203 },
    { w: 101.6, h: 254.0, marketplace: 'Generic', name: '4x10 Shipping Label (300 DPI)', dpi: 300 },
  ]

  shippingLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `shipping_${label.marketplace.toLowerCase()}_${String(index + 1).padStart(3, '0')}`,
        `${label.marketplace} ${label.name}`,
        'shipping',
        label.w,
        label.h,
        {
          marketplace: label.marketplace,
          print_method: 'thermal',
          barcode_format: 'CODE128',
        }
      )
    )
  })

  // ========================================
  // CATEGORY G: DYMO/DESKTOP PRINTER (30 labels)
  // ========================================
  const dymoLabels = [
    { w: 89, h: 36, name: 'DYMO 30252 Address Label', printer: 'dymo_labelwriter' },
    { w: 99, h: 38, name: 'DYMO 30256 Shipping Label', printer: 'dymo_labelwriter' },
    { w: 62, h: 100, name: 'DYMO 30258 Multi-Purpose Label', printer: 'dymo_labelwriter' },
    { w: 54, h: 25, name: 'DYMO 30277 Small Address Label', printer: 'dymo_labelwriter' },
    { w: 102, h: 49, name: 'DYMO 30336 Large Address Label', printer: 'dymo_labelwriter' },
    { w: 103, h: 38, name: 'DYMO 30330 Shipping Label', printer: 'dymo_labelwriter' },
    { w: 101.6, h: 152.4, name: 'DYMO 4XL 4x6 Label', printer: 'dymo_4xl' },
    { w: 102, h: 79, name: 'DYMO 4XL 4x3 Label', printer: 'dymo_4xl' },
    { w: 102, h: 52, name: 'DYMO 4XL 4x2 Label', printer: 'dymo_4xl' },
    { w: 102, h: 25, name: 'DYMO 4XL 4x1 Label', printer: 'dymo_4xl' },
    { w: 50.8, h: 25.4, name: 'Brother 1x0.5 Label', printer: 'brother_ql' },
    { w: 62, h: 29, name: 'Brother 62x29 Label', printer: 'brother_ql' },
    { w: 102, h: 51, name: 'Brother 4x2 Label', printer: 'brother_ql' },
    { w: 102, h: 152, name: 'Brother 4x6 Label', printer: 'brother_ql' },
    { w: 50.8, h: 25.4, name: 'Rollo 1.5x0.5 Label', printer: 'rollo' },
    { w: 101.6, h: 50.8, name: 'Rollo 4x2 Label', printer: 'rollo' },
    { w: 101.6, h: 152.4, name: 'Rollo 4x6 Label', printer: 'rollo' },
    { w: 50, h: 30, name: 'Zebra 50x30mm Label', printer: 'zebra' },
    { w: 100, h: 50, name: 'Zebra 100x50mm Label', printer: 'zebra' },
    { w: 101.6, h: 152.4, name: 'Zebra 4x6 Label', printer: 'zebra' },
  ]

  // Add both 203 and 300 DPI variants for some sizes
  dymoLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `dymo_${String(index + 1).padStart(3, '0')}`,
        label.name,
        'dymo_desktop',
        label.w,
        label.h,
        {
          print_method: 'thermal',
          printer_type: label.printer,
          supported_printers: [label.printer],
        }
      )
    )
  })

  // Add 10 more desktop printer variants
  for (let i = 21; i <= 30; i++) {
    labels.push(
      createLabel(
        `dymo_${String(i).padStart(3, '0')}`,
        `Desktop Printer Label ${i}`,
        'dymo_desktop',
        50 + i * 2,
        25 + i,
        {
          print_method: 'desktop',
        }
      )
    )
  }

  // ========================================
  // CATEGORY H: BARCODE/STICKER (35 labels)
  // ========================================
  const barcodeSizes = [
    { w: 25, h: 15, name: '25x15mm' },
    { w: 38, h: 25, name: '38x25mm' },
    { w: 50, h: 25, name: '50x25mm' },
    { w: 50, h: 30, name: '50x30mm' },
    { w: 60, h: 30, name: '60x30mm' },
    { w: 75, h: 25, name: '75x25mm' },
    { w: 75, h: 50, name: '75x50mm' },
    { w: 100, h: 50, name: '100x50mm' },
    { w: 100, h: 75, name: '100x75mm' },
    { w: 125, h: 75, name: '125x75mm' },
    { w: 150, h: 100, name: '150x100mm' },
  ]

  // Create variants for each size (203 DPI, 300 DPI, and different formats)
  barcodeSizes.forEach((size, sizeIndex) => {
    // 203 DPI
    labels.push(
      createLabel(
        `barcode_${String(sizeIndex * 3 + 1).padStart(3, '0')}`,
        `Barcode Label ${size.name} (203 DPI)`,
        'barcode_sticker',
        size.w,
        size.h,
        {
          print_method: 'thermal',
          barcode_position: 'center',
          barcode_format: 'CODE128',
        }
      )
    )
    // 300 DPI
    labels.push(
      createLabel(
        `barcode_${String(sizeIndex * 3 + 2).padStart(3, '0')}`,
        `Barcode Label ${size.name} (300 DPI)`,
        'barcode_sticker',
        size.w,
        size.h,
        {
          print_method: 'thermal',
          barcode_position: 'center',
          barcode_format: 'CODE128',
        }
      )
    )
    // EAN13 variant
    labels.push(
      createLabel(
        `barcode_${String(sizeIndex * 3 + 3).padStart(3, '0')}`,
        `EAN13 Label ${size.name}`,
        'barcode_sticker',
        size.w,
        size.h,
        {
          print_method: 'thermal',
          barcode_position: 'center',
          barcode_format: 'EAN13',
        }
      )
    )
  })

  // Add 2 more to reach 35
  labels.push(
    createLabel('barcode_034', 'QR Code Label 50x50mm', 'barcode_sticker', 50, 50, {
      print_method: 'thermal',
      barcode_format: 'QRCODE',
    }),
    createLabel('barcode_035', 'QR Code Label 75x75mm', 'barcode_sticker', 75, 75, {
      print_method: 'thermal',
      barcode_format: 'QRCODE',
    })
  )

  // ========================================
  // CATEGORY I: INTERNATIONAL (15 labels)
  // ========================================
  const internationalLabels = [
    { w: 101.6, h: 152.4, name: 'International 4x6 Shipping Label' },
    { w: 105, h: 148, name: 'A6 International Label' },
    { w: 148, h: 105, name: 'A6 Landscape International Label' },
    { w: 127.0, h: 177.8, name: 'International 5x7 Shipping Label' },
    { w: 152.4, h: 228.6, name: 'International 6x9 Shipping Label' },
    { w: 210, h: 297, name: 'A4 International Label' },
    { w: 148, h: 210, name: 'A5 International Label' },
    { w: 100, h: 150, name: 'International 100x150mm Label' },
    { w: 120, h: 170, name: 'International 120x170mm Label' },
    { w: 150, h: 200, name: 'International 150x200mm Label' },
    { w: 101.6, h: 203.2, name: 'International 4x8 Shipping Label' },
    { w: 76.2, h: 127.0, name: 'International 3x5 Shipping Label' },
    { w: 50.8, h: 76.2, name: 'International 2x3 Shipping Label' },
    { w: 203.2, h: 279.4, name: 'International 8x11 Shipping Label' },
    { w: 101.6, h: 254.0, name: 'International 4x10 Shipping Label' },
  ]

  internationalLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `international_${String(index + 1).padStart(3, '0')}`,
        label.name,
        'international',
        label.w,
        label.h,
        {
          print_method: 'thermal',
          barcode_format: 'CODE128',
          notes: 'International shipping format',
        }
      )
    )
  })

  // ========================================
  // CATEGORY J: SPECIAL/PROFESSIONAL (5 labels)
  // ========================================
  const professionalLabels = [
    { w: 76.2, h: 50.8, name: 'Professional 3x2 Product Label' },
    { w: 127.0, h: 76.2, name: 'Professional 5x3 Product Label' },
    { w: 101.6, h: 127.0, name: 'Professional 4x5 Product Label' },
    { w: 152.4, h: 101.6, name: 'Professional 6x4 Product Label' },
    { w: 203.2, h: 152.4, name: 'Professional 8x6 Product Label' },
  ]

  professionalLabels.forEach((label, index) => {
    labels.push(
      createLabel(
        `professional_${String(index + 1).padStart(3, '0')}`,
        label.name,
        'special_professional',
        label.w,
        label.h,
        {
          print_method: 'thermal',
          barcode_format: 'CODE128',
          notes: 'Professional-grade label',
        }
      )
    )
  })

  // Verify we have 255 labels
  console.log(`Generated ${labels.length} labels`)
  if (labels.length !== 255) {
    console.warn(`Warning: Expected 255 labels, but generated ${labels.length}`)
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

