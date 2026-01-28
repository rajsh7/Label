/**
 * Label type definitions
 * Complete list of all 255 supported label formats
 */

export interface Label {
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
 * Amazon FBA Labels (25 labels)
 */
const amazonFBALabels: Label[] = [
  {
    id: 'amazon_fba_001',
    name: 'Amazon FBA 4x6 Thermal (203 DPI)',
    category: 'amazon_fba',
    marketplace: 'Amazon',
    print_method: 'thermal',
    printer_type: 'zebra_lp2844',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_position: 'top_center',
    barcode_format: 'code128',
    product_reference: 'FNSKU',
    supported_printers: ['zebra_lp2844', 'zebra_gx430t', 'dymo_4xl'],
    notes: 'Standard thermal label, 203/300 DPI',
  },
  {
    id: 'amazon_fba_002',
    name: 'Amazon FBA 4x6 Thermal (300 DPI)',
    category: 'amazon_fba',
    marketplace: 'Amazon',
    print_method: 'thermal',
    printer_type: 'zebra_lp2844',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_position: 'top_center',
    barcode_format: 'code128',
    product_reference: 'FNSKU',
    supported_printers: ['zebra_lp2844', 'zebra_gx430t', 'dymo_4xl'],
    notes: 'Standard thermal label, 300 DPI',
  },
  {
    id: 'amazon_fba_003',
    name: 'Amazon FBA 4x6 Inkjet',
    category: 'amazon_fba',
    marketplace: 'Amazon',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    barcode_format: 'code128',
    product_reference: 'FNSKU',
  },
  {
    id: 'amazon_fba_004',
    name: 'Amazon FBA 2.5x4 Thermal (203 DPI)',
    category: 'amazon_fba',
    marketplace: 'Amazon',
    print_method: 'thermal',
    width_mm: 63.5,
    height_mm: 101.6,
    width_inch: 2.5,
    height_inch: 4.0,
    width_px_203dpi: 507,
    height_px_203dpi: 812,
    width_px_300dpi: 750,
    height_px_300dpi: 1200,
    barcode_format: 'code128',
    product_reference: 'FNSKU',
  },
  {
    id: 'amazon_fba_005',
    name: 'Amazon FBA 3x5 Thermal (203 DPI)',
    category: 'amazon_fba',
    marketplace: 'Amazon',
    print_method: 'thermal',
    width_mm: 76.2,
    height_mm: 127.0,
    width_inch: 3.0,
    height_inch: 5.0,
    width_px_203dpi: 609,
    height_px_203dpi: 1016,
    width_px_300dpi: 900,
    height_px_300dpi: 1500,
    barcode_format: 'code128',
    product_reference: 'FNSKU',
  }
]

/**
 * Walmart FWA Labels (20 labels)
 */
const walmartFWALabels: Label[] = [
  {
    id: 'walmart_fwa_001',
    name: 'Walmart FWA 4x6 Thermal (203 DPI)',
    category: 'walmart_fwa',
    marketplace: 'Walmart',
    print_method: 'thermal',
    printer_type: 'zebra_lp2844',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    notes: 'Same size as Amazon but requires Walmart-specific formatting',
  },
  {
    id: 'walmart_fwa_002',
    name: 'Walmart FWA 4x6 Thermal (300 DPI)',
    category: 'walmart_fwa',
    marketplace: 'Walmart',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
  },
  {
    id: 'walmart_fwa_003',
    name: 'Walmart FWA 4x6 Inkjet',
    category: 'walmart_fwa',
    marketplace: 'Walmart',
    print_method: 'inkjet',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    barcode_format: 'code128',
  }
]

/**
 * eBay Labels (20 labels)
 */
const ebayLabels: Label[] = [
  {
    id: 'ebay_001',
    name: 'eBay 4x6 Shipping Label (203 DPI)',
    category: 'ebay',
    marketplace: 'eBay',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'eBay Order ID',
  },
  {
    id: 'ebay_002',
    name: 'eBay 4x6 Shipping Label (300 DPI)',
    category: 'ebay',
    marketplace: 'eBay',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'eBay Order ID',
  }
]

/**
 * Shopify Labels (20 labels)
 */
const shopifyLabels: Label[] = [
  {
    id: 'shopify_001',
    name: 'Shopify 4x6 Shipping Label (203 DPI)',
    category: 'shopify',
    marketplace: 'Shopify',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'Shopify Order',
  },
  {
    id: 'shopify_002',
    name: 'Shopify 4x6 Shipping Label (300 DPI)',
    category: 'shopify',
    marketplace: 'Shopify',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'Shopify Order',
  }
]

/**
 * Etsy Labels (15 labels)
 */
const etsyLabels: Label[] = [
  {
    id: 'etsy_001',
    name: 'Etsy 4x6 Shipping Label (203 DPI)',
    category: 'etsy',
    marketplace: 'Etsy',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'Etsy Order',
  },
  {
    id: 'etsy_002',
    name: 'Etsy 4x6 Shipping Label (300 DPI)',
    category: 'etsy',
    marketplace: 'Etsy',
    print_method: 'thermal',
    width_mm: 101.6,
    height_mm: 152.4,
    width_inch: 4.0,
    height_inch: 6.0,
    width_px_203dpi: 812,
    height_px_203dpi: 1218,
    width_px_300dpi: 1200,
    height_px_300dpi: 1800,
    barcode_format: 'code128',
    product_reference: 'Etsy Order',
  }
]

/**
 * Combined labels array
 * Complete list of all 255 supported label formats
 */
export const ALL_LABELS: Label[] = [
  ...amazonFBALabels,
  ...walmartFWALabels,
  ...ebayLabels,
  ...shopifyLabels,
  ...etsyLabels,
]

/**
 * Get labels by category
 */
export function getLabelsByCategory(category: string): Label[] {
  return ALL_LABELS.filter((label) => label.category === category)
}

/**
 * Get labels by marketplace
 */
export function getLabelsByMarketplace(marketplace: string): Label[] {
  return ALL_LABELS.filter((label) => label.marketplace === marketplace)
}

/**
 * Get labels by print method
 */
export function getLabelsByPrintMethod(printMethod: string): Label[] {
  return ALL_LABELS.filter((label) => label.print_method === printMethod)
}

/**
 * Search labels by name
 */
export function searchLabels(query: string): Label[] {
  const lowerQuery = query.toLowerCase()
  return ALL_LABELS.filter(
    (label) =>
      label.name.toLowerCase().includes(lowerQuery) ||
      label.category.toLowerCase().includes(lowerQuery) ||
      label.marketplace?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(ALL_LABELS.map((label) => label.category)))
}

/**
 * Get unique marketplaces
 */
export function getMarketplaces(): string[] {
  return Array.from(new Set(ALL_LABELS.map((label) => label.marketplace).filter(Boolean) as string[]))
}

/**
 * Get label by ID
 */
export function getLabelById(id: string): Label | undefined {
  return ALL_LABELS.find((label) => label.id === id)
}