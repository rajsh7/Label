import { createClient } from '@supabase/supabase-js'
import type { EditorElement } from '../src/types/editor'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper to generate unique IDs
const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

/**
 * Amazon FBA 2x1" FNSKU Label Template
 * Compact label for small products
 */
const amazonFBA2x1Template = {
  name: 'Amazon FBA 2x1" FNSKU Label',
  description: 'Compact FNSKU barcode label for small products',
  label_base_id: 'amazon_fba_006',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', '2x1', 'compact'],
  elements: [
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 30,
      y: 10,
      width: 340,
      height: 130,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 10,
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 30,
      y: 150,
      width: 340,
      height: 40,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
        lineHeight: 1.2,
      },
    },
  ] as EditorElement[],
}

/**
 * Amazon FBA 2.625x1" FNSKU Label (Avery 5160 Compatible)
 */
const amazonFBA2625x1Template = {
  name: 'Amazon FBA 2.625x1" FNSKU (Avery 5160)',
  description: 'Standard FNSKU label compatible with Avery 5160 sheets',
  label_base_id: 'amazon_fba_008',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', 'avery', '5160'],
  elements: [
    // Title text
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 5,
      width: 513,
      height: 20,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'AMAZON FNSKU',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 700,
        color: '#232F3E',
        align: 'left',
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 10,
      y: 30,
      width: 513,
      height: 120,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 11,
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 160,
      width: 513,
      height: 35,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 9,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.1,
      },
    },
  ] as EditorElement[],
}

/**
 * Amazon FBA 3.5x1" FNSKU Label (Extended)
 */
const amazonFBA35x1Template = {
  name: 'Amazon FBA 3.5x1" FNSKU (Extended)',
  description: 'Extended FNSKU label with more space for product info',
  label_base_id: 'amazon_fba_010',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', '3.5x1', 'extended'],
  elements: [
    // Brand/Title
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 5,
      width: 691,
      height: 22,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'AMAZON FBA - {{brand_name}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#232F3E',
        align: 'left',
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 10,
      y: 35,
      width: 450,
      height: 110,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 11,
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 470,
      y: 35,
      width: 221,
      height: 60,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 8,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.2,
      },
    },
    // SKU text
    {
      id: generateId(),
      type: 'text',
      x: 470,
      y: 100,
      width: 221,
      height: 45,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'SKU: {{sku}}',
        font: 'Arial',
        fontSize: 8,
        fontWeight: 400,
        color: '#666666',
        align: 'left',
      },
    },
    // Condition text
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 155,
      width: 300,
      height: 40,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: 'Condition: New',
        font: 'Arial',
        fontSize: 9,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
  ] as EditorElement[],
}

/**
 * Amazon FBA 4x6" Standard Thermal Label
 */
const amazonFBA4x6Template = {
  name: 'Amazon FBA 4x6" Standard Thermal',
  description: 'Standard 4x6 thermal FNSKU label with logo space',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', '4x6', 'thermal'],
  elements: [
    // Header background
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 0,
      width: 812,
      height: 80,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#232F3E',
        fill_opacity: 1,
        border_color: '#232F3E',
        border_width: 0,
      },
    },
    // Header text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 20,
      width: 600,
      height: 40,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'AMAZON FBA',
        font: 'Arial',
        fontSize: 28,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'left',
      },
    },
    // Logo placeholder
    {
      id: generateId(),
      type: 'text',
      x: 650,
      y: 15,
      width: 140,
      height: 50,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{logo}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 100,
      width: 772,
      height: 80,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 18,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 100,
      y: 200,
      width: 612,
      height: 250,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 20,
      },
    },
    // FNSKU label
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 470,
      width: 300,
      height: 40,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: 'FNSKU:',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // SKU info
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 515,
      width: 772,
      height: 80,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        text: 'SKU: {{sku}}\\nCondition: New\\nQuantity: {{quantity}}',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.4,
      },
    },
  ] as EditorElement[],
}

/**
 * Avery 5160 Address Label
 */
const avery5160Template = {
  name: 'Avery 5160 Address Label',
  description: 'Standard 1x2.625" address label (30 per sheet)',
  label_base_id: 'avery_5160',
  is_public: true,
  category: 'avery',
  tags: ['avery', '5160', 'address', 'mailing'],
  elements: [
    // Company name
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 15,
      width: 493,
      height: 30,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{company_name}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Address line 1
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 50,
      width: 493,
      height: 25,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{address_line1}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Address line 2
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 80,
      width: 493,
      height: 25,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{address_line2}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // City, State, ZIP
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 110,
      width: 493,
      height: 25,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: '{{city}}, {{state}} {{zip}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Country (optional)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 140,
      width: 493,
      height: 25,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '{{country}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
  ] as EditorElement[],
}

/**
 * Avery 5163 Shipping Label (2x4")
 */
const avery5163Template = {
  name: 'Avery 5163 Shipping Label',
  description: '2x4" shipping label (10 per sheet)',
  label_base_id: 'avery_5163',
  is_public: true,
  category: 'avery',
  tags: ['avery', '5163', 'shipping', '2x4'],
  elements: [
    // Shipping From header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 10,
      width: 372,
      height: 25,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'FROM:',
        font: 'Arial',
        fontSize: 9,
        fontWeight: 700,
        color: '#666666',
        align: 'left',
      },
    },
    // From address
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 35,
      width: 372,
      height: 80,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{from_name}}\\n{{from_address}}\\n{{from_city}}, {{from_state}} {{from_zip}}',
        font: 'Arial',
        fontSize: 9,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // Divider line
    {
      id: generateId(),
      type: 'shape',
      x: 20,
      y: 130,
      width: 372,
      height: 2,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#CCCCCC',
        fill_opacity: 1,
        border_color: '#CCCCCC',
        border_width: 0,
      },
    },
    // Shipping To header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 145,
      width: 372,
      height: 25,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'SHIP TO:',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // To company
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 175,
      width: 372,
      height: 28,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '{{to_company}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // To address
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 210,
      width: 372,
      height: 90,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: '{{to_address}}\\n{{to_city}}, {{to_state}} {{to_zip}}\\n{{to_country}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // Tracking barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 40,
      y: 320,
      width: 332,
      height: 70,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{tracking_number}}',
        human_readable: true,
        human_readable_font_size: 9,
      },
    },
  ] as EditorElement[],
}

/**
 * Avery 5164 Large Shipping Label (3.33x4")
 */
const avery5164Template = {
  name: 'Avery 5164 Large Shipping',
  description: '3.33x4" large format shipping label (6 per sheet)',
  label_base_id: 'avery_5164',
  is_public: true,
  category: 'avery',
  tags: ['avery', '5164', 'shipping', 'large'],
  elements: [
    // Header background
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 0,
      width: 676,
      height: 50,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#003366',
        fill_opacity: 1,
        border_color: '#003366',
        border_width: 0,
      },
    },
    // Header text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 12,
      width: 400,
      height: 26,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'SHIPPING LABEL',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'left',
      },
    },
    // From section
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 70,
      width: 300,
      height: 120,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'FROM:\\n{{from_name}}\\n{{from_address}}\\n{{from_city}}, {{from_state}} {{from_zip}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.4,
      },
    },
    // To section header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 210,
      width: 636,
      height: 30,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'DELIVER TO:',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#003366',
        align: 'left',
      },
    },
    // To recipient
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 245,
      width: 636,
      height: 35,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '{{to_name}}',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // To company (optional)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 285,
      width: 636,
      height: 30,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: '{{to_company}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // To address
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 320,
      width: 636,
      height: 100,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        text: '{{to_address}}\\n{{to_city}}, {{to_state}} {{to_zip}}\\n{{to_country}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.4,
      },
    },
    // Tracking number
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 440,
      width: 636,
      height: 25,
      rotation: 0,
      z_index: 8,
      visible: true,
      properties: {
        text: 'Tracking: {{tracking_number}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#666666',
        align: 'left',
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 100,
      y: 480,
      width: 476,
      height: 120,
      rotation: 0,
      z_index: 9,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{tracking_number}}',
        human_readable: true,
        human_readable_font_size: 11,
      },
    },
  ] as EditorElement[],
}

/**
 * Avery 5167 Return Address (0.5x1.75")
 */
const avery5167Template = {
  name: 'Avery 5167 Return Address',
  description: 'Mini return address label (80 per sheet)',
  label_base_id: 'avery_5167',
  is_public: true,
  category: 'avery',
  tags: ['avery', '5167', 'return', 'address', 'mini'],
  elements: [
    // Name
    {
      id: generateId(),
      type: 'text',
      x: 5,
      y: 3,
      width: 346,
      height: 18,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{name}}',
        font: 'Arial',
        fontSize: 7,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Address
    {
      id: generateId(),
      type: 'text',
      x: 5,
      y: 23,
      width: 346,
      height: 15,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{address}}',
        font: 'Arial',
        fontSize: 6,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // City State ZIP
    {
      id: generateId(),
      type: 'text',
      x: 5,
      y: 40,
      width: 346,
      height: 15,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{city}}, {{state}} {{zip}}',
        font: 'Arial',
        fontSize: 6,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
  ] as EditorElement[],
}

/**
 * Amazon FBA 1x4" Vertical FNSKU
 */
const amazonFBA1x4Template = {
  name: 'Amazon FBA 1x4" Vertical FNSKU',
  description: 'Narrow vertical FNSKU label',
  label_base_id: 'amazon_fba_014',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', '1x4', 'vertical'],
  elements: [
    // Title rotated
    {
      id: generateId(),
      type: 'text',
      x: 5,
      y: 10,
      width: 193,
      height: 60,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'AMAZON\\nFNSKU',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 700,
        color: '#232F3E',
        align: 'center',
        lineHeight: 1.1,
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 20,
      y: 80,
      width: 163,
      height: 550,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 9,
      },
    },
    // Product info
    {
      id: generateId(),
      type: 'text',
      x: 5,
      y: 650,
      width: 193,
      height: 150,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 7,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
        lineHeight: 1.2,
      },
    },
  ] as EditorElement[],
}

/**
 * Amazon FBA 2x4" Medium Vertical
 */
const amazonFBA2x4Template = {
  name: 'Amazon FBA 2x4" Medium Label',
  description: 'Medium vertical FNSKU label with product details',
  label_base_id: 'amazon_fba_016',
  is_public: true,
  category: 'amazon_fba',
  tags: ['amazon', 'fba', 'fnsku', '2x4', 'medium'],
  elements: [
    // Header
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 0,
      width: 406,
      height: 40,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#FF9900',
        fill_opacity: 1,
        border_color: '#FF9900',
        border_width: 0,
      },
    },
    // Amazon branding
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 8,
      width: 386,
      height: 24,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'amazon',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 700,
        color: '#232F3E',
        align: 'left',
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 55,
      width: 386,
      height: 120,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
        lineHeight: 1.2,
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 30,
      y: 190,
      width: 346,
      height: 420,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 14,
      },
    },
    // Additional info
    {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 630,
      width: 386,
      height: 170,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: 'SKU: {{sku}}\\nCondition: New\\nMade for Amazon',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.4,
      },
    },
  ] as EditorElement[],
}

/**
 * Avery Full Page Label
 */
const averyFullPageTemplate = {
  name: 'Avery 8165 Full Page Label',
  description: 'Full 8.5x11" page label for custom designs',
  label_base_id: 'avery_8165',
  is_public: true,
  category: 'avery',
  tags: ['avery', '8165', 'full-page', 'custom'],
  elements: [
    // Main title area
    {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 100,
      width: 1230,
      height: 150,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{title}}',
        font: 'Arial',
        fontSize: 48,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Subtitle
    {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 280,
      width: 1230,
      height: 80,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{subtitle}}',
        font: 'Arial',
        fontSize: 24,
        fontWeight: 400,
        color: '#666666',
        align: 'center',
      },
    },
    // Content area
    {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 400,
      width: 1230,
      height: 600,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{content}}',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.5,
      },
    },
    // Barcode/QR area
    {
      id: generateId(),
      type: 'barcode',
      x: 400,
      y: 1050,
      width: 630,
      height: 200,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        barcode_type: 'QRCODE',
        barcode_value: '{{url}}',
        human_readable: false,
      },
    },
  ] as EditorElement[],
}

// Array of all templates
const templates = [
  amazonFBA2x1Template,
  amazonFBA2625x1Template,
  amazonFBA35x1Template,
  amazonFBA4x6Template,
  amazonFBA1x4Template,
  amazonFBA2x4Template,
  avery5160Template,
  avery5163Template,
  avery5164Template,
  avery5167Template,
  averyFullPageTemplate,
]

async function seedTemplates() {
  console.log('🌱 Starting template seeding...')
  console.log(`📦 Total templates to seed: ${templates.length}\\n`)

  try {
    // First, check if we have labels
    const { count: labelCount } = await supabase
      .from('labels')
      .select('*', { count: 'exact' })

    console.log(`✅ Found ${labelCount} labels in database`)

    // Delete existing public templates to avoid duplicates
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .eq('is_public', true)

    if (deleteError) {
      console.warn('⚠️  Warning deleting existing templates:', deleteError.message)
    } else {
      console.log('🗑️  Cleared existing public templates')
    }

    // Insert templates
    let successCount = 0
    let errorCount = 0

    for (const template of templates) {
      const templateData = {
        name: template.name,
        description: template.description,
        label_base_id: template.label_base_id,
        elements: template.elements, // Don't stringify - JSONB column handles this
        is_public: template.is_public,
        category: template.category,
        tags: template.tags,
        user_id: null, // Public templates have no user
        downloads: 0,
      }

      const { error } = await supabase.from('templates').insert([templateData])

      if (error) {
        console.error(`❌ Error inserting "${template.name}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Inserted: ${template.name}`)
        successCount++
      }
    }

    console.log(`\\n📊 Seeding Summary:`)
    console.log(`✅ Successfully inserted: ${successCount} templates`)
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} templates`)
    }
    console.log(`📦 Total: ${templates.length} templates`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

seedTemplates()
