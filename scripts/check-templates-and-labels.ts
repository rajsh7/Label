import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTemplatesAndLabels() {
  // Check templates
  const { data: templates, count } = await supabase
    .from('templates')
    .select('*', { count: 'exact' })
    .eq('is_public', true)

  console.log(`\n📋 TEMPLATES (Public):`)
  console.log(`Total: ${count}`)
  if (templates && templates.length > 0) {
    console.log('\nTemplates:')
    templates.forEach((t, i) => {
      const elements = JSON.parse(t.elements || '[]')
      console.log(`${i + 1}. "${t.name}" - ${elements.length} elements (base: ${t.label_base_id})`)
    })
  }

  // Check labels that match our template IDs
  const labelIds = [
    'amazon_fba_006', 'amazon_fba_008', 'amazon_fba_010', 'amazon_fba_001',
    'amazon_fba_014', 'amazon_fba_016',
    'avery_5160', 'avery_5163', 'avery_5164', 'avery_5167', 'avery_8165'
  ]

  console.log(`\n🏷️  LABEL IDS CHECK:`)
  for (const id of labelIds) {
    const { data } = await supabase
      .from('labels')
      .select('id, name')
      .eq('id', id)
      .single()

    if (data) {
      console.log(`✅ ${id}: ${data.name}`)
    } else {
      console.log(`❌ ${id}: NOT FOUND`)
    }
  }
}

checkTemplatesAndLabels()
