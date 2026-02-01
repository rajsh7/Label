/**
 * Script to add new label categories: Address Labels and Name Tags
 * Run with: npx tsx scripts/add-new-label-categories.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMDEwMDUsImV4cCI6MjA4Mzg3NzAwNX0.nwBJsBUpKw6g4yuOLdu_xbtegk2wT6XtVeZ-_kvIG2Q'

const supabase = createClient(supabaseUrl, supabaseKey)

// Address Labels - Avery standard sizes
const addressLabels = [
  {
    id: 'avery_5160',
    name: 'Avery 5160 Address Label (2.625" x 1")',
    category: 'address_labels',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 2.625,
    height_inch: 1.0,
    width_mm: 66.675,
    height_mm: 25.4,
    width_px_203dpi: Math.round(2.625 * 203),
    height_px_203dpi: Math.round(1.0 * 203),
    width_px_300dpi: Math.round(2.625 * 300),
    height_px_300dpi: Math.round(1.0 * 300),
    notes: 'Standard address label, 30 per sheet'
  },
  {
    id: 'avery_5161',
    name: 'Avery 5161 Address Label (4" x 1.33")',
    category: 'address_labels',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 4.0,
    height_inch: 1.33,
    width_mm: 101.6,
    height_mm: 33.782,
    width_px_203dpi: Math.round(4.0 * 203),
    height_px_203dpi: Math.round(1.33 * 203),
    width_px_300dpi: Math.round(4.0 * 300),
    height_px_300dpi: Math.round(1.33 * 300),
    notes: 'Large address label, 20 per sheet'
  },
  {
    id: 'avery_5163',
    name: 'Avery 5163 Shipping Label (4" x 2")',
    category: 'address_labels',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 4.0,
    height_inch: 2.0,
    width_mm: 101.6,
    height_mm: 50.8,
    width_px_203dpi: Math.round(4.0 * 203),
    height_px_203dpi: Math.round(2.0 * 203),
    width_px_300dpi: Math.round(4.0 * 300),
    height_px_300dpi: Math.round(2.0 * 300),
    notes: 'Shipping address label, 10 per sheet'
  },
  {
    id: 'avery_8160',
    name: 'Avery 8160 Address Label (3.5" x 1.125")',
    category: 'address_labels',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 3.5,
    height_inch: 1.125,
    width_mm: 88.9,
    height_mm: 28.575,
    width_px_203dpi: Math.round(3.5 * 203),
    height_px_203dpi: Math.round(1.125 * 203),
    width_px_300dpi: Math.round(3.5 * 300),
    height_px_300dpi: Math.round(1.125 * 300),
    notes: 'Return address label, 30 per sheet'
  },
]

// Name Tags / Badges
const nameTags = [
  {
    id: 'avery_5395',
    name: 'Avery 5395 Name Badge (2.33" x 3.375")',
    category: 'name_tags',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 2.33,
    height_inch: 3.375,
    width_mm: 59.182,
    height_mm: 85.725,
    width_px_203dpi: Math.round(2.33 * 203),
    height_px_203dpi: Math.round(3.375 * 203),
    width_px_300dpi: Math.round(2.33 * 300),
    height_px_300dpi: Math.round(3.375 * 300),
    notes: 'Adhesive name badge, 8 per sheet'
  },
  {
    id: 'avery_5384',
    name: 'Avery 5384 Name Badge (3" x 4")',
    category: 'name_tags',
    marketplace: 'Avery',
    print_method: 'inkjet' as const,
    width_inch: 3.0,
    height_inch: 4.0,
    width_mm: 76.2,
    height_mm: 101.6,
    width_px_203dpi: Math.round(3.0 * 203),
    height_px_203dpi: Math.round(4.0 * 203),
    width_px_300dpi: Math.round(3.0 * 300),
    height_px_300dpi: Math.round(4.0 * 300),
    notes: 'Large name badge, 6 per sheet'
  },
  {
    id: 'nametag_standard',
    name: 'Standard Name Tag (2.25" x 3.5")',
    category: 'name_tags',
    marketplace: 'Custom',
    print_method: 'desktop' as const,
    width_inch: 2.25,
    height_inch: 3.5,
    width_mm: 57.15,
    height_mm: 88.9,
    width_px_203dpi: Math.round(2.25 * 203),
    height_px_203dpi: Math.round(3.5 * 203),
    width_px_300dpi: Math.round(2.25 * 300),
    height_px_300dpi: Math.round(3.5 * 300),
    notes: 'Standard name tag size'
  },
  {
    id: 'nametag_hello',
    name: 'Hello My Name Is Tag (3.5" x 2.25")',
    category: 'name_tags',
    marketplace: 'Custom',
    print_method: 'desktop' as const,
    width_inch: 3.5,
    height_inch: 2.25,
    width_mm: 88.9,
    height_mm: 57.15,
    width_px_203dpi: Math.round(3.5 * 203),
    height_px_203dpi: Math.round(2.25 * 203),
    width_px_300dpi: Math.round(3.5 * 300),
    height_px_300dpi: Math.round(2.25 * 300),
    notes: 'Classic "Hello My Name Is" sticker'
  },
]

async function addNewLabels() {
  console.log('🏷️  Adding new label categories...\n')

  // Add Address Labels
  console.log('📬 Adding Address Labels...')
  for (const label of addressLabels) {
    const { error } = await supabase
      .from('labels')
      .upsert(label, { onConflict: 'id' })
    
    if (error) {
      console.error(`❌ Error adding ${label.id}:`, error.message)
    } else {
      console.log(`✅ Added ${label.name}`)
    }
  }

  // Add Name Tags
  console.log('\n👤 Adding Name Tags...')
  for (const tag of nameTags) {
    const { error } = await supabase
      .from('labels')
      .upsert(tag, { onConflict: 'id' })
    
    if (error) {
      console.error(`❌ Error adding ${tag.id}:`, error.message)
    } else {
      console.log(`✅ Added ${tag.name}`)
    }
  }

  console.log('\n✨ Label categories added successfully!')
  console.log(`📊 Total new labels: ${addressLabels.length + nameTags.length}`)
}

addNewLabels().catch(console.error)
