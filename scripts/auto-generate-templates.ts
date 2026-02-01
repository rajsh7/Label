import { createClient } from '@supabase/supabase-js'
import type { EditorElement } from '../src/types/editor'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper to generate unique IDs
const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

/**
 * Template Generator
 * Auto-generates templates for different label dimensions
 */

interface LabelInfo {
  id: string
  name: string
  width_px_300dpi: number
  height_px_300dpi: number
  category: string
}

// Target labels for template generation (now 40+ labels)
const targetLabels = [
  // Amazon FBA
  'amazon_fba_001', 'amazon_fba_006', 'amazon_fba_3x5', 'amazon_fba_2x4',
  // Avery Address
  'avery_5160', 'avery_5161', 'avery_5162', 'avery_5163', 'avery_5164', 'avery_5167',
  'avery_5261', 'avery_5262', 'avery_5263', 'avery_5264',
  // Avery Round
  'avery_5294', 'avery_22807', 'avery_22808',
  // Avery Square
  'avery_22806', 'avery_22817',
  // Avery File/Badge
  'avery_5366', 'avery_5395', 'avery_5390', 'avery_5931',
  // Avery Laser
  'avery_8160', 'avery_8162', 'avery_8163', 'avery_8164',
  // Avery Full Sheet
  'avery_full_sheet',
  // Shipping
  'usps_4x6', 'usps_6x4', 'fedex_4x6', 'fedex_6x4', 'ups_4x6', 'ups_6x4', 'dhl_4x6',
  // Compliance/Warning
  'warning_1x3', 'warning_2x2', 'warning_2x3', 'warning_3x3', 'warning_4x4', 'warning_4x6',
  // Product
  'product_1x1', 'product_1x2', 'product_2x3', 'product_3x4',
]

/**
 * Generate Product Label Template (300 DPI)
 */
function generateProductLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  
  // Calculate responsive positions based on label size
  const padding = Math.max(30, width * 0.03) // Increased padding for 300 DPI
  const barcodeHeight = Math.min(300, height * 0.35)
  
  return {
    name: `Product Label - ${label.name}`,
    description: `High Quality (300 DPI) product label with barcode for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'product_labels',
    tags: ['product', 'barcode', 'sku', label.category, '300dpi'],
    elements: [
      // Header text
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding,
        width: width - (padding * 2),
        height: 45,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: '{{product_name}}',
          font: 'Arial',
          fontSize: Math.min(24, width / 25), // Adjusted for 300 DPI
          fontWeight: 700,
          color: '#000000',
          align: 'center',
        },
      },
      // Barcode
      {
        id: generateId(),
        type: 'barcode',
        x: padding + (width * 0.1),
        y: padding + 80,
        width: width - (padding * 2) - (width * 0.2),
        height: barcodeHeight,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          barcode_type: 'CODE128',
          barcode_value: '{{sku}}',
          human_readable: true,
          human_readable_font_size: 16,
        },
      },
      // SKU text
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding + 80 + barcodeHeight + 30,
        width: width - (padding * 2),
        height: 35,
        rotation: 0,
        z_index: 3,
        visible: true,
        properties: {
          text: 'SKU: {{sku}}',
          font: 'Arial',
          fontSize: 16,
          fontWeight: 400,
          color: '#000000',
          align: 'center',
        },
      },
    ] as EditorElement[],
  }
}

/**
 * Generate Shipping Label Template (300 DPI)
 */
function generateShippingLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  
  const padding = Math.max(30, width * 0.03)
  
  return {
    name: `Shipping Label - ${label.name}`,
    description: `High Quality (300 DPI) shipping label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'shipping_labels',
    tags: ['shipping', 'address', 'tracking', label.category, '300dpi'],
    elements: [
      // SHIP TO header
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding,
        width: 300,
        height: 40,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'SHIP TO:',
          font: 'Arial',
          fontSize: 20,
          fontWeight: 700,
          color: '#000000',
          align: 'left',
        },
      },
      // Recipient name
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding + 50,
        width: width - (padding * 2),
        height: 40,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{to_name}}',
          font: 'Arial',
          fontSize: 18,
          fontWeight: 400,
          color: '#000000',
          align: 'left',
        },
      },
      // Address
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding + 95,
        width: width - (padding * 2),
        height: 90,
        rotation: 0,
        z_index: 3,
        visible: true,
        properties: {
          text: '{{to_address1}}\\n{{to_city}}, {{to_state}} {{to_zip}}',
          font: 'Arial',
          fontSize: 16,
          fontWeight: 400,
          color: '#000000',
          align: 'left',
          lineHeight: 1.4,
        },
      },
      // Tracking barcode
      {
        id: generateId(),
        type: 'barcode',
        x: padding + (width * 0.05),
        y: height - 300,
        width: width - (padding * 2) - (width * 0.1),
        height: 220,
        rotation: 0,
        z_index: 4,
        visible: true,
        properties: {
          barcode_type: 'CODE128',
          barcode_value: '{{tracking_number}}',
          human_readable: true,
          human_readable_font_size: 16,
        },
      },
    ] as EditorElement[],
  }
}

/**
 * Generate Compliance/Warning Label Template (300 DPI)
 */
function generateComplianceLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  
  const padding = Math.max(20, width * 0.03)
  
  return {
    name: `Warning Label - ${label.name}`,
    description: `High Quality (300 DPI) warning label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'compliance_labels',
    tags: ['warning', 'compliance', 'hazard', label.category, '300dpi'],
    elements: [
      // Red border
      {
        id: generateId(),
        type: 'shape',
        x: padding,
        y: padding,
        width: width - (padding * 2),
        height: height - (padding * 2),
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#FFFFFF',
          fill_opacity: 0,
          border_color: '#DC143C',
          border_width: 8, // Thicker border for 300 DPI
        },
      },
      // WARNING header
      {
        id: generateId(),
        type: 'text',
        x: padding + 20,
        y: padding + 25,
        width: width - (padding * 2) - 40,
        height: 90,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: 'WARNING',
          font: 'Arial',
          fontSize: Math.min(48, width / 8),
          fontWeight: 700,
          color: '#DC143C',
          align: 'center',
        },
      },
      // Warning icon
      {
        id: generateId(),
        type: 'text',
        x: padding + 20,
        y: padding + 120,
        width: width - (padding * 2) - 40,
        height: 80,
        rotation: 0,
        z_index: 3,
        visible: true,
        properties: {
          text: '⚠',
          font: 'Arial',
          fontSize: Math.min(72, width / 6),
          fontWeight: 400,
          color: '#FFD700',
          align: 'center',
        },
      },
      // Warning message
      {
        id: generateId(),
        type: 'text',
        x: padding + 20,
        y: padding + 220,
        width: width - (padding * 2) - 40,
        height: Math.max(60, height - 300),
        rotation: 0,
        z_index: 4,
        visible: true,
        properties: {
          text: '{{warning_message}}',
          font: 'Arial',
          fontSize: Math.min(20, width / 20),
          fontWeight: 700,
          color: '#000000',
          align: 'center',
          lineHeight: 1.3,
        },
      },
    ] as EditorElement[],
  }
}

/**
 * Generate Barcode Label (300 DPI)
 */
function generateBarcodeLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  
  const padding = Math.max(25, width * 0.04)
  
  return {
    name: `Barcode Label - ${label.name}`,
    description: `High Quality (300 DPI) barcode label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'product_labels',
    tags: ['barcode', 'inventory', 'sku', label.category, '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'barcode',
        x: padding,
        y: Math.max(padding, height * 0.15),
        width: width - (padding * 2),
        height: Math.min(height * 0.6, 250),
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          barcode_type: 'CODE128',
          barcode_value: '{{barcode_value}}',
          human_readable: true,
          human_readable_font_size: 16,
        },
      },
    ] as EditorElement[],
  }
}

/**
 * Generate "Sold as Set" Label (FBA Requirement)
 */
function generateSoldAsSetLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  const padding = Math.max(20, width * 0.03)

  return {
    name: `Sold as Set - ${label.name}`,
    description: `FBA "Do Not Separate" Warning Label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'compliance_labels',
    tags: ['fba', 'warning', 'set', 'do not separate', '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'shape',
        x: 0,
        y: 0,
        width: width,
        height: height,
        rotation: 0,
        z_index: 0,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#FF6B00', // Neon Orange/Red
          fill_opacity: 1,
          border_color: '#FF6B00',
          border_width: 0,
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: height * 0.25,
        width: width - (padding * 2),
        height: height * 0.3,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'SOLD AS SET',
          font: 'Arial',
          fontSize: Math.min(64, width / 8),
          fontWeight: 900,
          color: '#FFFFFF',
          align: 'center',
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: height * 0.55,
        width: width - (padding * 2),
        height: height * 0.2,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: 'DO NOT SEPARATE',
          font: 'Arial',
          fontSize: Math.min(42, width / 12),
          fontWeight: 700,
          color: '#FFFFFF',
          align: 'center',
        },
      }
    ]
  }
}

/**
 * Generate Fragile Label
 */
function generateFragileLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  const padding = Math.max(20, width * 0.03)

  return {
    name: `Fragile Label - ${label.name}`,
    description: `Fragile / Handle with Care Label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'shipping_labels',
    tags: ['fragile', 'warning', 'shipping', '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: height * 0.1,
        width: width - (padding * 2),
        height: height * 0.3,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'FRAGILE',
          font: 'Arial',
          fontSize: Math.min(72, width / 6),
          fontWeight: 900,
          color: '#DC143C',
          align: 'center',
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: height * 0.45,
        width: width - (padding * 2),
        height: height * 0.2,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: 'HANDLE WITH CARE',
          font: 'Arial',
          fontSize: Math.min(36, width / 12),
          fontWeight: 700,
          color: '#000000',
          align: 'center',
        },
      }
    ]
  }
}

/**
 * Generate Ready To Ship Label
 */
function generateReadyToShipLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  const padding = Math.max(20, width * 0.03)

  return {
    name: `Ready to Ship - ${label.name}`,
    description: `Green Ready to Ship Status Label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'box_labels',
    tags: ['status', 'logistics', 'ready', '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'shape',
        x: 0,
        y: 0,
        width: width,
        height: height,
        rotation: 0,
        z_index: 0,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#22c55e', // Green
          fill_opacity: 1,
          border_color: '#22c55e',
          border_width: 0,
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: height * 0.35,
        width: width - (padding * 2),
        height: height * 0.3,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'READY TO SHIP',
          font: 'Arial',
          fontSize: Math.min(56, width / 9),
          fontWeight: 900,
          color: '#FFFFFF',
          align: 'center',
        },
      }
    ]
  }
}

/**
 * Generate QR Code Label
 */
function generateQRCodeLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  const padding = Math.max(20, width * 0.03)

  return {
    name: `QR Code Label - ${label.name}`,
    description: `Modern QR Code Inventory Label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'product_labels',
    tags: ['qrcode', 'inventory', 'modern', '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'barcode',
        x: (width - Math.min(width * 0.6, height * 0.6)) / 2,
        y: padding,
        width: Math.min(width * 0.6, height * 0.6),
        height: Math.min(width * 0.6, height * 0.6),
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          barcode_type: 'QRCODE',
          barcode_value: '{{url_or_sku}}',
          human_readable: false,
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding,
        y: padding + Math.min(width * 0.6, height * 0.6) + 30,
        width: width - (padding * 2),
        height: 30,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{product_name}}',
          font: 'Arial',
          fontSize: Math.min(20, width / 20),
          fontWeight: 700,
          color: '#000000',
          align: 'center',
        },
      }
    ]
  }
}

/**
 * Generate Discount Label
 */
function generateDiscountLabel(label: LabelInfo): any {
  const width = label.width_px_300dpi
  const height = label.height_px_300dpi
  const padding = Math.max(20, width * 0.03)

  return {
    name: `Discount Label - ${label.name}`,
    description: `Retail Discount / Sale Label for ${label.name}`,
    label_base_id: label.id,
    is_public: true,
    category: 'product_labels',
    tags: ['retail', 'sale', 'discount', '300dpi'],
    elements: [
      {
        id: generateId(),
        type: 'shape',
        x: padding,
        y: padding,
        width: width - (padding * 2),
        height: height - (padding * 2),
        rotation: 0,
        z_index: 0,
        visible: true,
        properties: {
          shape_type: 'ellipse',
          fill_color: '#EF4444', // Red
          fill_opacity: 1,
          border_color: '#EF4444',
          border_width: 0,
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding * 2,
        y: height * 0.25,
        width: width - (padding * 4),
        height: height * 0.25,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: 'SALE',
          font: 'Arial',
          fontSize: Math.min(64, width / 6),
          fontWeight: 900,
          color: '#FFFFFF',
          align: 'center',
        },
      },
      {
        id: generateId(),
        type: 'text',
        x: padding * 2,
        y: height * 0.55,
        width: width - (padding * 4),
        height: height * 0.2,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{discount}}% OFF',
          font: 'Arial',
          fontSize: Math.min(48, width / 8),
          fontWeight: 700,
          color: '#FFFFFF',
          align: 'center',
        },
      }
    ]
  }
}

/**
 * Main generation function
 */
async function generateTemplates() {
  console.log('🎨 Starting template auto-generation (HIGH QUALITY 300 DPI)...\n')

  try {
    // Fetch label info from database
    const { data: labels, error: fetchError } = await supabase
      .from('labels')
      .select('id, name, width_px_300dpi, height_px_300dpi, category')
      .in('id', targetLabels)

    if (fetchError) {
      console.error('❌ Error fetching labels:', fetchError)
      return
    }

    if (!labels || labels.length === 0) {
      console.error('❌ No labels found')
      return
    }

    console.log(`📊 Found ${labels.length} labels to generate templates for\n`)

    const templates: any[] = []

    // Generate templates for each label
    for (const label of labels as LabelInfo[]) {
      // Determine which template types to generate based on label category and size
      const isLargeLabel = label.height_px_300dpi >= 900 // > 3 inches at 300 DPI
      
      // === STANDARD SET ===
      templates.push(generateProductLabel(label))
      templates.push(generateBarcodeLabel(label))
      templates.push(generateQRCodeLabel(label))
      
      // === COMPLIANCE / WARNING SET ===
      templates.push(generateSoldAsSetLabel(label))
      templates.push(generateFragileLabel(label))
      
      // === CONDITIONAL SET ===
      
      // Shipping only for larger labels
      if (isLargeLabel) {
        templates.push(generateShippingLabel(label))
      }
      
      // Compliance warnings generally for smaller/medium, but "Ready to Ship" is for boxes
      templates.push(generateComplianceLabel(label))
      templates.push(generateReadyToShipLabel(label))
      templates.push(generateDiscountLabel(label))
    }

    console.log(`✅ Generated ${templates.length} templates (High Quality)\n`)
    console.log('📦 Seeding to database...\n')

    // Clear existing auto-generated templates
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .in('category', ['product_labels', 'shipping_labels', 'compliance_labels', 'box_labels'])
      .neq('name', 'Amazon FBA Product Label (4x6")') // Keep manually created ones

    if (deleteError) {
      console.warn('⚠️  Warning clearing old templates:', deleteError.message)
    }

    // Insert templates in batches of 50 to avoid payload limits
    let successCount = 0
    let errorCount = 0
    const batchSize = 50
    
    for (let i = 0; i < templates.length; i += batchSize) {
        const batch = templates.slice(i, i + batchSize)
        
        const batchData = batch.map(template => ({
            name: template.name,
            description: template.description,
            label_base_id: template.label_base_id,
            elements: template.elements,
            is_public: template.is_public,
            category: template.category,
            tags: template.tags,
            user_id: null,
            downloads: 0,
        }))

        const { error } = await supabase.from('templates').insert(batchData)

        if (error) {
            console.error(`❌ Batch error (${i}-${i+batchSize}):`, error.message)
            errorCount += batch.length
        } else {
            console.log(`✅ Inserted batch ${i/batchSize + 1}`)
            successCount += batch.length
        }
    }

    console.log(`\n📊 Generation Summary:`)
    console.log(`  ✅ Successfully inserted: ${successCount} templates`)
    if (errorCount > 0) {
      console.log(`  ❌ Failed: ${errorCount} templates`)
    }
    console.log(`  📦 Total generated: ${templates.length} templates`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

generateTemplates()
