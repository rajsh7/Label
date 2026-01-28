import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTemplates() {
  try {
    // Check label_designs table (this is where templates are stored)
    const { data: designs, error: designsError, count: designsCount } = await supabase
      .from('label_designs')
      .select('*', { count: 'exact' })

    if (designsError) {
      console.error('Label designs error:', designsError)
    } else {
      console.log(`\n📋 LABEL_DESIGNS TABLE (Templates):`) 
      console.log(`Total designs/templates: ${designsCount}`)
      if (designs && designs.length > 0) {
        console.log('\nSample design/template:')
        console.log(JSON.stringify(designs[0], null, 2))
        
        // Show elements size for each design
        console.log('\n📊 Template sizes:')
        designs.forEach((design, index) => {
          const elements = JSON.parse(design.elements || '[]')
          console.log(`${index + 1}. "${design.name}" - ${elements.length} elements`)
        })
      }
    }

    // Check labels table for comparison
    const { count: labelsCount } = await supabase
      .from('labels')
      .select('*', { count: 'exact' })

    console.log(`\n🏷️  LABELS TABLE:`)
    console.log(`Total labels: ${labelsCount}`)

  } catch (error) {
    console.error('Error:', error)
  }
}

checkTemplates()