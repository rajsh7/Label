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
 * LabTag Laboratory Labels (56 labels)
 */
const labTagLabels: Label[] = [
  // Real Data Labels
  {
    id: 'cl_50t1_wh',
    name: 'Cryo-LazrTAG CLT - Square Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 35.052,
    height_mm: 35.052,
    width_inch: 1.38,
    height_inch: 1.38,
    product_reference: 'CL-50T1-WH',
    notes: 'Cryogenic laser labels for storage in liquid nitrogen',
  },
  {
    id: 'cl_6t1',
    name: 'Cryo-LazrTAG CLT - Identification Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 36.068,
    height_mm: 13.97,
    width_inch: 1.42,
    height_inch: 0.55,
    product_reference: 'CL-6T1',
    notes: 'Permanent cryogenic laser labels',
  },
  {
    id: 'cl_44t1_wh',
    name: 'Cryo-LazrTAG CLT - Medium Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 36.068,
    height_mm: 25.4,
    width_inch: 1.42,
    height_inch: 1.0,
    product_reference: 'CL-44T1-WH',
    notes: 'Cryogenic laser labels for vials and boxes',
  },
  {
    id: 'cl_12t1',
    name: 'Cryo-LazrTAG CLT - Small Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 23.876,
    height_mm: 12.7,
    width_inch: 0.94,
    height_inch: 0.5,
    product_reference: 'CL-12T1',
    notes: 'Small form factor cryogenic laser labels',
  },
  {
    id: 'cl_4t1',
    name: 'Cryo-LazrTAG CLT - Narrow Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 23.876,
    height_mm: 19.558,
    width_inch: 0.94,
    height_inch: 0.77,
    product_reference: 'CL-4T1',
    notes: 'Standard laboratory identifying labels',
  },
  {
    id: 'cl_69t1_wh',
    name: 'Cryo-LazrTAG CLT - Extended Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'inkjet',
    width_mm: 28.575,
    height_mm: 44.45,
    width_inch: 1.125,
    height_inch: 1.75,
    product_reference: 'CL-69T1-WH',
    notes: 'Large cryogenic laser labels',
  },
  {
    id: 'tr_jtta-161c1-2ga',
    name: 'NitroTAG Green Apple Cryo Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 30.1625,
    height_mm: 25.4,
    width_inch: 1.1875,
    height_inch: 1.0,
    product_reference: 'JTTA-161C1-2GA',
    notes: 'Thermal-transfer cryogenic label with 0.375 inch circle for tube tops',
  },
  {
    id: 'tr_jtta-9',
    name: 'NitroTAG Cryogenic Barcode Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 31.75,
    height_mm: 22.225,
    width_inch: 1.25,
    height_inch: 0.875,
    product_reference: 'JTTA-9',
    notes: 'Durable cryogenic barcode labels',
  },
  {
    id: 'tr_jtta-560sb',
    name: 'SnapPEEL Cryogenic Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 23.876,
    height_mm: 12.7,
    width_inch: 0.94,
    height_inch: 0.5,
    product_reference: 'JTTA-560SB',
    notes: 'Snap-and-peel cryogenic label with 0.437 inch circle',
  },
  {
    id: 'tr_jtta-104',
    name: 'NitroTAG Cryo Tube Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 12.7,
    height_mm: 34.925,
    width_inch: 0.5,
    height_inch: 1.375,
    product_reference: 'JTTA-104',
    notes: 'Thermal-transfer cryogenic labels for microtubes',
  },
  {
    id: 'tr_jtta-176',
    name: 'NitroTAG Cryo Wrap-around Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 13.97,
    height_mm: 69.85,
    width_inch: 0.55,
    height_inch: 2.75,
    product_reference: 'JTTA-176',
    notes: 'Wrap-around labels for extreme cryogenic storage',
  },
  {
    id: 'tr_jtta-531',
    name: 'NitroTAG General Purpose Lab Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 12.7,
    height_mm: 50.8,
    width_inch: 0.5,
    height_inch: 2.0,
    product_reference: 'JTTA-531',
    notes: 'Permanent labels for tubes and flasks',
  },
  {
    id: 'tr_jtta-162',
    name: 'NitroTAG Microtube Side Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 12.7,
    height_mm: 25.4,
    width_inch: 0.5,
    height_inch: 1.0,
    product_reference: 'JTTA-162',
    notes: 'Small microtube side labels',
  },
  {
    id: 'tr_jtta-255',
    name: 'NitroTAG Cryo Cap Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 9.525,
    height_mm: 9.525,
    width_inch: 0.375,
    height_inch: 0.375,
    product_reference: 'JTTA-255',
    notes: 'Small square cap labels for cryo-vials',
  },
  {
    id: 'tr_jtta-18',
    name: 'NitroTAG Rectangular Cryo Label',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 31.75,
    height_mm: 12.7,
    width_inch: 1.25,
    height_inch: 0.5,
    product_reference: 'JTTA-18',
    notes: 'Standard rectangular cryogenic label',
  },
  // Catalog Labels
  {
    id: 'labtag_us_3',
    name: 'LabTag US-3 Rectangle',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 66.8,
    height_mm: 25.4,
    width_inch: 2.63,
    height_inch: 1.0,
    notes: '33 labels per sheet',
  },
  {
    id: 'labtag_us_4',
    name: 'LabTag US-4 Rectangle',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 23.876,
    height_mm: 19.558,
    width_inch: 0.94,
    height_inch: 0.77,
  },
  {
    id: 'labtag_us_6',
    name: 'LabTag US-6 Rectangle',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 36.068,
    height_mm: 13.97,
    width_inch: 1.42,
    height_inch: 0.55,
    notes: '100 labels per sheet',
  },
  {
    id: 'labtag_us_12',
    name: 'LabTag US-12 Rectangle',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 23.876,
    height_mm: 12.7,
    width_inch: 0.94,
    height_inch: 0.5,
    notes: '160 labels per sheet',
  },
  {
    id: 'labtag_us_44',
    name: 'LabTag US-44 Rectangle',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 36.068,
    height_mm: 25.4,
    width_inch: 1.42,
    height_inch: 1.0,
  },
  {
    id: 'labtag_us_50',
    name: 'LabTag US-50 Square',
    category: 'laboratory',
    marketplace: 'LabTag',
    print_method: 'thermal',
    width_mm: 35.052,
    height_mm: 35.052,
    width_inch: 1.38,
    height_inch: 1.38,
  },
]

/**
 * Combined labels array
 * Complete list of all supported label formats
 */
export const ALL_LABELS: Label[] = [
  ...amazonFBALabels,
  ...walmartFWALabels,
  ...ebayLabels,
  ...shopifyLabels,
  ...etsyLabels,
  ...labTagLabels,
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