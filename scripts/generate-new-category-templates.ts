/**
 * Generate templates for new label categories: Address Labels and Name Tags
 * Run with: npx tsx scripts/generate-new-category-templates.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseKey)

// Template variants for Address Labels
const addressLabelTemplates = [
  {
    name: 'Classic Return Address',
    category: 'address_labels',
    description: 'Traditional return address label with clean typography',
    label_base_id: 'avery_5160',
    elements: [
      {
        id: 'text_1',
        type: 'text',
        x: 20,
        y: 15,
        width: 500,
        height: 60,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: '{{sender_name}}\n{{address_line1}}\n{{city}}, {{state}} {{zip}}',
          font: 'Inter',
          fontSize: 11,
          fontWeight: 400,
          color: '#000000',
          align: 'left',
          lineHeight: 1.3,
        }
      }
    ]
  },
  {
    name: 'Modern Return Address',
    category: 'address_labels',
    description: 'Contemporary design with bold name and subtle address',
    label_base_id: 'avery_5160',
    elements: [
      {
        id: 'text_name',
        type: 'text',
        x: 20,
        y: 10,
        width: 500,
        height: 25,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{sender_name}}',
          font: 'Inter',
          fontSize: 14,
          fontWeight: 600,
          color: '#1a1a1a',
          align: 'left',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_address',
        type: 'text',
        x: 20,
        y: 38,
        width: 500,
        height: 45,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: '{{address_line1}}\n{{city}}, {{state}} {{zip}}',
          font: 'Inter',
          fontSize: 10,
          fontWeight: 400,
          color: '#666666',
          align: 'left',
          lineHeight: 1.3,
        }
      }
    ]
  },
  {
    name: 'Business Return Address',
    category: 'address_labels',
    description: 'Professional business address label with company name',
    label_base_id: 'avery_5161',
    elements: [
      {
        id: 'text_company',
        type: 'text',
        x: 25,
        y: 15,
        width: 750,
        height: 30,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{company_name}}',
          font: 'Inter',
          fontSize: 16,
          fontWeight: 700,
          color: '#2563eb',
          align: 'left',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_address',
        type: 'text',
        x: 25,
        y: 50,
        width: 750,
        height: 70,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          text: '{{address_line1}}\n{{city}}, {{state}} {{zip}}\n{{phone}}',
          font: 'Inter',
          fontSize: 11,
          fontWeight: 400,
          color: '#333333',
          align: 'left',
          lineHeight: 1.3,
        }
      }
    ]
  },
]

// Template variants for Name Tags
const nameTagTemplates = [
  {
    name: 'Hello My Name Is - Classic',
    category: 'name_tags',
    description: 'Classic "Hello My Name Is" sticker design',
    label_base_id: 'nametag_hello',
    elements: [
      {
        id: 'shape_bg',
        type: 'shape',
        x: 0,
        y: 0,
        width: 710,
        height: 456,
        rotation: 0,
        z_index: 0,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#ef4444',
          border_color: '#dc2626',
          border_width: 3,
          fill_opacity: 100,
        }
      },
      {
        id: 'text_hello',
        type: 'text',
        x: 30,
        y: 25,
        width: 650,
        height: 40,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: 'HELLO',
          font: 'Inter',
          fontSize: 28,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_my_name_is',
        type: 'text',
        x: 30,
        y: 70,
        width: 650,
        height: 35,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: 'my name is',
          font: 'Inter',
          fontSize: 20,
          fontWeight: 400,
          color: '#ffffff',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'shape_name_area',
        type: 'shape',
        x: 30,
        y: 120,
        width: 650,
        height: 300,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#ffffff',
          border_color: '#ffffff',
          border_width: 0,
          fill_opacity: 100,
        }
      },
      {
        id: 'text_name',
        type: 'text',
        x: 50,
        y: 200,
        width: 610,
        height: 140,
        rotation: 0,
        z_index: 3,
        visible: true,
        properties: {
          text: '{{attendee_name}}',
          font: 'Inter',
          fontSize: 48,
          fontWeight: 600,
          color: '#000000',
          align: 'center',
          lineHeight: 1.2,
        }
      }
    ]
  },
  {
    name: 'Professional Conference Badge',
    category: 'name_tags',
    description: 'Clean professional badge for conferences and events',
    label_base_id: 'avery_5384',
    elements: [
      {
        id: 'text_event',
        type: 'text',
        x: 30,
        y: 25,
        width: 549,
        height: 40,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{event_name}}',
          font: 'Inter',
          fontSize: 18,
          fontWeight: 700,
          color: '#2563eb',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'line_divider',
        type: 'shape',
        x: 50,
        y: 70,
        width: 509,
        height: 2,
        rotation: 0,
        z_index: 1,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#e5e7eb',
          border_color: '#e5e7eb',
          border_width: 0,
          fill_opacity: 100,
        }
      },
      {
        id: 'text_name',
        type: 'text',
        x: 40,
        y: 90,
        width: 529,
        height: 80,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{attendee_name}}',
          font: 'Inter',
          fontSize: 36,
          fontWeight: 600,
          color: '#1f2937',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_title',
        type: 'text',
        x: 40,
        y: 180,
        width: 529,
        height: 35,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{job_title}}',
          font: 'Inter',
          fontSize: 16,
          fontWeight: 400,
          color: '#6b7280',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_company',
        type: 'text',
        x: 40,
        y: 220,
        width: 529,
        height: 30,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{company_name}}',
          font: 'Inter',
          fontSize: 14,
          fontWeight: 500,
          color: '#9ca3af',
          align: 'center',
          lineHeight: 1.2,
        }
      }
    ]
  },
  {
    name: 'School Name Tag',
    category: 'name_tags',
    description: 'Friendly name tag design for schools and classrooms',
    label_base_id: 'nametag_standard',
    elements: [
      {
        id: 'shape_border',
        type: 'shape',
        x: 10,
        y: 10,
        width: 436,
        height: 690,
        rotation: 0,
        z_index: 0,
        visible: true,
        properties: {
          shape_type: 'rectangle',
          fill_color: '#fef3c7',
          border_color: '#f59e0b',
          border_width: 4,
          fill_opacity: 100,
        }
      },
      {
        id: 'text_name',
        type: 'text',
        x: 30,
        y: 280,
        width: 396,
        height: 140,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{student_name}}',
          font: 'Inter',
          fontSize: 42,
          fontWeight: 600,
          color: '#92400e',
          align: 'center',
          lineHeight: 1.2,
        }
      },
      {
        id: 'text_grade',
        type: 'text',
        x: 30,
        y: 440,
        width: 396,
        height: 40,
        rotation: 0,
        z_index: 2,
        visible: true,
        properties: {
          text: '{{grade}}',
          font: 'Inter',
          fontSize: 18,
          fontWeight: 500,
          color: '#b45309',
          align: 'center',
          lineHeight: 1.2,
        }
      }
    ]
  },
]

async function generateTemplates() {
  console.log('🎨 Generating templates for new categories...\n')

  let successCount = 0
  let errorCount = 0

  // Generate Address Label templates
  console.log('📬 Creating Address Label templates...')
  for (const template of addressLabelTemplates) {
    const { error } = await supabase
      .from('templates')
      .insert({
        ...template,
        is_public: true,
        downloads: 0,
      })
    
    if (error) {
      console.error(`❌ Error creating ${template.name}:`, error.message)
      errorCount++
    } else {
      console.log(`✅ Created ${template.name}`)
      successCount++
    }
  }

  // Generate Name Tag templates
  console.log('\n👤 Creating Name Tag templates...')
  for (const template of nameTagTemplates) {
    const { error } = await supabase
      .from('templates')
      .insert({
        ...template,
        is_public: true,
        downloads: 0,
      })
    
    if (error) {
      console.error(`❌ Error creating ${template.name}:`, error.message)
      errorCount++
    } else {
      console.log(`✅ Created ${template.name}`)
      successCount++
    }
  }

  console.log('\n✨ Template generation complete!')
  console.log(`📊 Success: ${successCount} | Errors: ${errorCount}`)
  console.log(`📈 Total templates created: ${successCount}`)
}

generateTemplates().catch(console.error)
