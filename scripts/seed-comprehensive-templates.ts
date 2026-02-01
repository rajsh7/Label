import { createClient } from '@supabase/supabase-js'
import type { EditorElement } from '../src/types/editor'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper to generate unique IDs
const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

/**
 * CATEGORY 1: PRODUCT LABELS (6 templates)
 */

// 1. Amazon FBA Product Label (4x6")
const amazonFBAProductLabel4x6 = {
  name: 'Amazon FBA Product Label (4x6")',
  description: 'Professional product label with barcode, FNSKU, and product details',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'product_labels',
  tags: ['amazon', 'fba', 'product', 'fnsku', '4x6'],
  elements: [
    // Header text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 15,
      width: 772,
      height: 30,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{header_text}}',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
    // Main barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 56,
      y: 60,
      width: 700,
      height: 200,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fnsku}}',
        human_readable: true,
        human_readable_font_size: 14,
      },
    },
    // FNSKU text below barcode
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 280,
      width: 772,
      height: 30,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'FNSKU{{fnsku}}',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Product name
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 330,
      width: 772,
      height: 100,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // MSKU
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 450,
      width: 400,
      height: 25,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '<MSKU-{{msku}}>',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Condition
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 485,
      width: 200,
      height: 25,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: '{{condition}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Free text next to condition
    {
      id: generateId(),
      type: 'text',
      x: 450,
      y: 485,
      width: 342,
      height: 25,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        text: '{{free_text}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'right',
      },
    },
    // Footer text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 530,
      width: 650,
      height: 25,
      rotation: 0,
      z_index: 8,
      visible: true,
      properties: {
        text: '{{footer_text}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
    // Page number
    {
      id: generateId(),
      type: 'text',
      x: 700,
      y: 530,
      width: 92,
      height: 25,
      rotation: 0,
      z_index: 9,
      visible: true,
      properties: {
        text: '{{page_number}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'right',
      },
    },
  ] as EditorElement[],
}

// 2. Amazon FBA Product Label (2x1")
const amazonFBAProductLabel2x1 = {
  name: 'Amazon FBA Product Label (2x1")',
  description: 'Compact product label for small items',
  label_base_id: 'amazon_fba_006',
  is_public: true,
  category: 'product_labels',
  tags: ['amazon', 'fba', 'product', 'compact', '2x1'],
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
        fontSize: 9,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
  ] as EditorElement[],
}

// 3. Generic Product Label with Barcode
const genericProductLabel = {
  name: 'Generic Product Label with Barcode',
  description: 'Universal product label for any marketplace',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'product_labels',
  tags: ['generic', 'product', 'barcode', '2x4'],
  elements: [
    // Product name header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 20,
      width: 732,
      height: 40,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{product_name}}',
        font: 'Arial',
        fontSize: 14,
        fontWeight:  700,
        color: '#000000',
        align: 'center',
      },
    },
    // Barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 126,
      y: 70,
      width: 520,
      height: 150,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{sku}}',
        human_readable: true,
        human_readable_font_size: 12,
      },
    },
    // SKU text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 240,
      width: 732,
      height: 25,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'SKU: {{sku}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
  ] as EditorElement[],
}

/**
 * CATEGORY 2: SHIPPING LABELS (8 templates)
 */

// 4. UPS Ground Shipping Label (4x6")
const upsGroundShippingLabel = {
  name: 'UPS Ground Shipping Label',
  description: 'Professional UPS Ground shipping label with tracking',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'shipping_labels',
  tags: ['ups', 'ground', 'shipping', '4x6', 'tracking'],
  elements: [
    // Weight (top left)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 10,
      width: 200,
      height: 40,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: '{{weight}} LBS',
        font: 'Arial',
        fontSize: 18,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Package count (top right)
    {
      id: generateId(),
      type: 'text',
      x: 650,
      y: 10,
      width: 142,
      height: 40,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{package_count}}',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        align: 'right',
      },
    },
    // DWT label
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 60,
      width: 772,
      height: 25,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'DWT: {{dwt}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // SHIP TO header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 100,
      width: 200,
      height: 30,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'SHIP TO:',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Recipient name
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 140,
      width: 752,
      height: 25,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '{{to_name}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Address line 1
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 170,
      width: 752,
      height: 25,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: '{{to_address1}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // City State ZIP (LARGE)
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 200,
      width: 752,
      height: 50,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        text: '{{to_city}} {{to_state}} {{to_zip}}',
        font: 'Arial',
        fontSize: 26,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Horizontal divider line
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 340,
      width: 812,
      height: 3,
      rotation: 0,
      z_index: 8,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
    // QR Code
    {
      id: generateId(),
      type: 'barcode',
      x: 20,
      y: 380,
      width: 160,
      height: 160,
      rotation: 0,
      z_index: 9,
      visible: true,
      properties: {
        barcode_type: 'QRCODE',
        barcode_value: '{{tracking_qr}}',
        human_readable: false,
      },
    },
    // Routing code (large)
    {
      id: generateId(),
      type: 'text',
      x: 220,
      y: 410,
      width: 572,
      height: 80,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        text: '{{routing_code}}',
        font: 'Arial',
        fontSize: 48,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Tracking barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 56,
      y: 590,
      width: 700,
      height: 130,
      rotation: 0,
      z_index: 11,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{tracking_number}}',
        human_readable: false,
      },
    },
    // UPS GROUND bar (black background)
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 770,
      width: 812,
      height: 70,
      rotation: 0,
      z_index: 12,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
    // UPS GROUND text (white on black)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 785,
      width: 500,
      height: 40,
      rotation: 0,
      z_index: 13,
      visible: true,
      properties: {
        text: 'UPS GROUND',
        font: 'Arial',
        fontSize: 28,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'left',
      },
    },
    // Tracking number text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 880,
      width: 772,
      height: 25,
      rotation: 0,
      z_index: 14,
      visible: true,
      properties: {
        text: 'TRACKING #: {{tracking_number}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // Billing info
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 910,
      width: 300,
      height: 25,
      rotation: 0,
      z_index: 15,
      visible: true,
      properties: {
        text: 'BILLING: {{billing}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
  ] as EditorElement[],
}

// 5. FedEx Express Shipping Label (4x6")
const fedexExpressShippingLabel = {
  name: 'FedEx Express Shipping Label',
  description: 'Professional FedEx Express shipping label',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'shipping_labels',
  tags: ['fedex', 'express', 'shipping', '4x6'],
  elements: [
    // FedEx header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 10,
      width: 300,
      height: 40,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'FedEx',
        font: 'Arial',
        fontSize: 32,
        fontWeight: 700,
        color: '#4D148C',
        align: 'left',
      },
    },
    // Service type
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 55,
      width: 300,
      height: 25,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: '{{service_type}}',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#FF6200',
        align: 'left',
      },
    },
    // SHIP TO
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 100,
      width: 200,
      height: 25,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'SHIP TO:',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Recipient address block
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 130,
      width: 752,
      height: 120,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: '{{to_name}}\\n{{to_address1}}\\n{{to_city}}, {{to_state}} {{to_zip}}',
        font: 'Arial',
        fontSize: 12,
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
      x: 56,
      y: 300,
      width: 700,
      height: 150,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{tracking_number}}',
        human_readable: true,
        human_readable_font_size: 14,
      },
    },
    // QR code
    {
      id: generateId(),
      type: 'barcode',
      x: 650,
      y: 10,
      width: 142,
      height: 142,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        barcode_type: 'QRCODE',
        barcode_value: '{{tracking_qr}}',
        human_readable: false,
      },
    },
  ] as EditorElement[],
}

/**
 * CATEGORY 3: BOX LABELS (5 templates)
 */

// 6. Amazon FBA Box Label (Standard)
const amazonFBABoxLabel = {
  name: 'Amazon FBA Box Label',
  description: 'Standard FBA box label for shipment to Amazon warehouses',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'box_labels',
  tags: ['amazon', 'fba', 'box', 'shipment', '4x6'],
  elements: [
    // FBA header with box count
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 10,
      width: 400,
      height: 40,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'FBA',
        font: 'Arial',
        fontSize: 28,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Box count (top right)
    {
      id: generateId(),
      type: 'text',
      x: 450,
      y: 10,
      width: 342,
      height: 40,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'Box {{box_number}} of {{total_boxes}} - {{weight}}lb',
        font: 'Arial',
        fontSize: 16,
        fontWeight: 700,
        color: '#000000',
        align: 'right',
      },
    },
    // SHIP FROM header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 70,
      width: 350,
      height: 25,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'SHIP FROM:',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // SHIP TO header
    {
      id: generateId(),
      type: 'text',
      x: 442,
      y: 70,
      width: 350,
      height: 25,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'SHIP TO:',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Ship from address
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 100,
      width: 370,
      height: 100,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: '{{from_address}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // Ship to address
    {
      id: generateId(),
      type: 'text',
      x: 442,
      y: 100,
      width: 350,
      height: 100,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: '{{to_address}}',
        font: 'Arial',
        fontSize: 10,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
    // Black bar divider
    {
      id: generateId(),
      type: 'shape',
      x: 0,
      y: 220,
      width: 812,
      height: 3,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
    // FBA shipment ID label
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 235,
      width: 772,
      height: 20,
      rotation: 0,
      z_index: 8,
      visible: true,
      properties: {
        text: '{{fba_shipment_id}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // FBA shipment barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 20,
      y: 265,
      width: 600,
      height: 200,
      rotation: 0,
      z_index: 9,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{fba_shipment_id}}',
        human_readable: true,
        human_readable_font_size: 12,
      },
    },
    // 2D barcode (right side)
    {
      id: generateId(),
      type: 'barcode',
      x: 640,
      y: 265,
      width: 152,
      height: 152,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        barcode_type: 'QRCODE',
        barcode_value: '{{qr_data}}',
        human_readable: false,
      },
    },
    // Product barcode label
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 485,
      width: 772,
      height: 20,
      rotation: 0,
      z_index: 11,
      visible: true,
      properties: {
        text: '{{msku}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        align: 'right',
      },
    },
    // Product MSKU barcode
    {
      id: generateId(),
      type: 'barcode',
      x: 326,
      y: 510,
      width: 466,
      height: 100,
      rotation: 0,
      z_index: 12,
      visible: true,
      properties: {
        barcode_type: 'CODE128',
        barcode_value: '{{msku}}',
        human_readable: false,
      },
    },
    // Quantity text
    {
      id: generateId(),
      type: 'text',
      x: 640,
      y: 485,
      width: 152,
      height: 20,
      rotation: 0,
      z_index: 13,
      visible: true,
      properties: {
        text: 'Qty {{qty}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        align: 'right',
      },
    },
    // Warning text
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 640,
      width: 772,
      height: 30,
      rotation: 0,
      z_index: 14,
      visible: true,
      properties: {
        text: 'PLEASE LEAVE THIS LABEL UNCOVERED',
        font: 'Arial',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Product title
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 680,
      width: 772,
      height: 60,
      rotation: 0,
      z_index: 15,
      visible: true,
      properties: {
        text: '{{product_title}}',
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
 * CATEGORY 4: COMPLIANCE LABELS (10 templates)
 */

// 7. Expiration Date Label
const expirationDateLabel = {
  name: 'Expiration Date Label',
  description: 'Warning label for products with expiration dates',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'compliance_labels',
  tags: ['expiration', 'date', 'compliance', 'warning'],
  elements: [
    // Rounded rectangle background
    {
      id: generateId(),
      type: 'shape',
      x: 10,
      y: 10,
      width: 752,
      height: 285,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#FFFFFF',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 2,
      },
    },
    // Header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 30,
      width: 732,
      height: 50,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'EXPIRATION DATE',
        font: 'Arial',
        fontSize: 32,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Date placeholder
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 90,
      width: 732,
      height: 60,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '{{expiration_date}}',
        font: 'Arial',
        fontSize: 48,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Warning icon (!)
    {
      id: generateId(),
      type: 'text',
      x: 60,
      y: 170,
      width: 50,
      height: 50,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: '⚠',
        font: 'Arial',
        fontSize: 32,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
      },
    },
    // Warning text
    {
      id: generateId(),
      type: 'text',
      x: 120,
      y: 175,
      width: 612,
      height: 100,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: 'This bundle includes a number of products, and the expiration date specified is the earliest expiration date among the included products',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
        lineHeight: 1.3,
      },
    },
  ] as EditorElement[],
}

// 8. Fragile / Handle with Care Label
const fragileLabel = {
  name: 'Fragile - Handle with Care Label',
  description: 'Warning label for fragile packages',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'compliance_labels',
  tags: ['fragile', 'warning', 'handle', 'care'],
  elements: [
    // Red border background
    {
      id: generateId(),
      type: 'shape',
      x: 10,
      y: 10,
      width: 752,
      height: 285,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#FFFFFF',
        fill_opacity: 100,
        border_color: '#DC143C',
        border_width: 4,
      },
    },
    // Top red bar
    {
      id: generateId(),
      type: 'shape',
      x: 10,
      y: 10,
      width: 752,
      height: 50,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#DC143C',
        fill_opacity: 100,
        border_color: '#DC143C',
        border_width: 0,
      },
    },
    // Header text (white on red)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 20,
      width: 732,
      height: 30,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'HANDLE WITH CARE',
        font: 'Arial',
        fontSize: 20,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
      },
    },
    // FRAGILE text (large red)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 100,
      width: 732,
      height: 80,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'FRAGILE',
        font: 'Arial',
        fontSize: 64,
        fontWeight: 700,
        color: '#DC143C',
        align: 'center',
      },
    },
    // Bottom red bar
    {
      id: generateId(),
      type: 'shape',
      x: 10,
      y: 245,
      width: 752,
      height: 50,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#DC143C',
        fill_opacity: 100,
        border_color: '#DC143C',
        border_width: 0,
      },
    },
    // Footer text (white on red)
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 255,
      width: 732,
      height: 30,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: 'THANK YOU',
        font: 'Arial',
        fontSize: 18,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
      },
    },
  ] as EditorElement[],
}

// 9. Hazmat Warning Label (Lithium Battery)
const hazmatLithiumLabel = {
  name: 'Hazmat - Lithium Battery Warning',
  description: 'Compliance label for lithium battery shipments',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'compliance_labels',
  tags: ['hazmat', 'lithium', 'battery', 'warning', 'compliance'],
  elements: [
    // Red dashed border
    {
      id: generateId(),
      type: 'shape',
      x: 10,
      y: 10,
      width: 752,
      height: 285,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#FFFFFF',
        fill_opacity: 100,
        border_color: '#DC143C',
        border_width: 3,
      },
    },
    // CAUTION header
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 30,
      width: 732,
      height: 40,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'CAUTION !',
        font: 'Arial',
        fontSize: 32,
        fontWeight: 700,
        color: '#DC143C',
        align: 'center',
      },
    },
    // Warning icons (battery, flame)
    {
      id: generateId(),
      type: 'text',
      x: 250,
      y: 90,
      width: 272,
      height: 60,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: '🔋 🔥',
        font: 'Arial',
        fontSize: 48,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
    // Main warning text
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 170,
      width: 692,
      height: 50,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'Lithium metal battery\\nDO NOT LOAD OR TRANSPORT\\nPACKAGE IF DAMAGED',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'center',
        lineHeight: 1.3,
      },
    },
    // Footer instruction
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 240,
      width: 692,
      height: 40,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: 'For more information, call:',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
  ] as EditorElement[],
}

// 10. QR Code Compliance Label
const qrComplianceLabel = {
  name: 'QR Code Compliance Label',
  description: 'Product compliance label with QR code',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'compliance_labels',
  tags: ['qr', 'compliance', 'tracking', '2x4'],
  elements: [
    // QR code (centered)
    {
      id: generateId(),
      type: 'barcode',
      x: 286,
      y: 45,
      width: 200,
      height: 200,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        barcode_type: 'QRCODE',
        barcode_value: '{{qr_url}}',
        human_readable: false,
      },
    },
    // Text below QR
    {
      id: generateId(),
      type: 'text',
      x: 20,
      y: 255,
      width: 732,
      height: 30,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        text: 'Scan for product information',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'center',
      },
    },
  ] as EditorElement[],
}

/**
 * CATEGORY 5: PACKING SLIPS (6 templates)
 */

// 11. Amazon FBA Packing List
const amazonFBAPackingList = {
  name: 'Amazon FBA Packing List',
  description: 'Detailed packing slip for FBA shipments',
  label_base_id: 'amazon_fba_001',
  is_public: true,
  category: 'packing_slips',
  tags: ['amazon', 'fba', 'packing', 'list', 'manifest'],
  elements: [
    // Header
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 40,
      width: 2475,
      height: 60,
      rotation: 0,
      z_index: 1,
      visible: true,
      properties: {
        text: 'PACKING LIST',
        font: 'Arial',
        fontSize: 42,
        fontWeight: 700,
        color: '#232F3E',
        align: 'left',
      },
    },
    // Horizontal line under header
    {
      id: generateId(),
      type: 'shape',
      x: 40,
      y: 110,
      width: 2475,
      height: 3,
      rotation: 0,
      z_index: 2,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#232F3E',
        fill_opacity: 100,
        border_color: '#232F3E',
        border_width: 0,
      },
    },
    // Date label
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 140,
      width: 200,
      height: 30,
      rotation: 0,
      z_index: 3,
      visible: true,
      properties: {
        text: 'Date',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Shipment ID label
    {
      id: generateId(),
      type: 'text',
      x: 400,
      y: 140,
      width: 300,
      height: 30,
      rotation: 0,
      z_index: 4,
      visible: true,
      properties: {
        text: 'Shipment ID',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Tracking Numbers label
    {
      id: generateId(),
      type: 'text',
      x: 900,
      y: 140,
      width: 400,
      height: 30,
      rotation: 0,
      z_index: 5,
      visible: true,
      properties: {
        text: 'Tracking Numbers',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Box Weights label
    {
      id: generateId(),
      type: 'text',
      x: 1700,
      y: 140,
      width: 400,
      height: 30,
      rotation: 0,
      z_index: 6,
      visible: true,
      properties: {
        text: 'Box Weights & Dims',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Date value
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 175,
      width: 300,
      height: 25,
      rotation: 0,
      z_index: 7,
      visible: true,
      properties: {
        text: '{{date}}',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    },
    // FROM / TO addresses
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 250,
      width: 200,
      height: 30,
      rotation: 0,
      z_index: 8,
      visible: true,
      properties: {
        text: 'From',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 285,
      width: 600,
      height: 120,
      rotation: 0,
      z_index: 9,
      visible: true,
      properties: {
        text: '{{from_address}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#666666',
        align: 'left',
        lineHeight: 1.4,
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 800,
      y: 250,
      width: 200,
      height: 30,
      rotation: 0,
      z_index: 10,
      visible: true,
      properties: {
        text: 'Ship to',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 800,
      y: 285,
      width: 600,
      height: 120,
      rotation: 0,
      z_index: 11,
      visible: true,
      properties: {
        text: '{{to_address}}',
        font: 'Arial',
        fontSize: 11,
        fontWeight: 400,
        color: '#666666',
        align: 'left',
        lineHeight: 1.4,
      },
    },
    // Product table header
    {
      id: generateId(),
      type: 'shape',
      x: 40,
      y: 450,
      width: 2475,
      height: 3,
      rotation: 0,
      z_index: 12,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#CCCCCC',
        fill_opacity: 100,
        border_color: '#CCCCCC',
        border_width: 0,
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 470,
      width: 400,
      height: 30,
      rotation: 0,
      z_index: 13,
      visible: true,
      properties: {
        text: 'SKU',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 500,
      y: 470,
      width: 400,
      height: 30,
      rotation: 0,
      z_index: 14,
      visible: true,
      properties: {
        text: 'FNSKU',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 960,
      y: 470,
      width: 200,
      height: 30,
      rotation: 0,
      z_index: 15,
      visible: true,
      properties: {
        text: 'QTY',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 1220,
      y: 470,
      width: 1000,
      height: 30,
      rotation: 0,
      z_index: 16,
      visible: true,
      properties: {
        text: 'Product Name',
        font: 'Arial',
        fontSize: 13,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    // Footer signature section
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 2800,
      width: 300,
      height: 30,
      rotation: 0,
      z_index: 17,
      visible: true,
      properties: {
        text: 'Packed By',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'shape',
      x: 400,
      y: 2825,
      width: 800,
      height: 2,
      rotation: 0,
      z_index: 18,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 2860,
      width: 300,
      height: 30,
      rotation: 0,
      z_index: 19,
      visible: true,
      properties: {
        text: 'Date',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'shape',
      x: 400,
      y: 2885,
      width: 800,
      height: 2,
      rotation: 0,
      z_index: 20,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
    {
      id: generateId(),
      type: 'text',
      x: 40,
      y: 2920,
      width: 400,
      height: 30,
      rotation: 0,
      z_index: 21,
      visible: true,
      properties: {
        text: 'Signature For Shipment',
        font: 'Arial',
        fontSize: 12,
        fontWeight: 700,
        color: '#000000',
        align: 'left',
      },
    },
    {
      id: generateId(),
      type: 'shape',
      x: 550,
      y: 2945,
      width: 800,
      height: 2,
      rotation: 0,
      z_index: 22,
      visible: true,
      properties: {
        shape_type: 'rectangle',
        fill_color: '#000000',
        fill_opacity: 100,
        border_color: '#000000',
        border_width: 0,
      },
    },
  ] as EditorElement[],
}

// Array of all templates
const templates = [
  // Product Labels (3)
  amazonFBAProductLabel4x6,
  amazonFBAProductLabel2x1,
  genericProductLabel,
  
  // Shipping Labels (2)
  upsGroundShippingLabel,
  fedexExpressShippingLabel,
  
  // Box Labels (1)
  amazonFBABoxLabel,
  
  // Compliance Labels (4)
  expirationDateLabel,
  fragileLabel,
  hazmatLithiumLabel,
  qrComplianceLabel,
  
  // Packing Slips (1)
  amazonFBAPackingList,
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
