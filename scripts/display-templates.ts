import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function displayTemplates() {
  const { data: templates, count } = await supabase
    .from('templates')
    .select('id, name, category, label_base_id, elements')
    .eq('is_public', true)
    .order('category', { ascending: true })

  console.log(`\n✨ PUBLIC PREBUILT TEMPLATES\n`)
  console.log(`📦 Total: ${count} templates\n`)

  if (templates && templates.length > 0) {
    const grouped = templates.reduce((acc, t) => {
      const cat = t.category || 'other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(t)
      return acc
    }, {} as Record<string, any[]>)

    for (const [category, temps] of Object.entries(grouped)) {
      console.log(`\n${category.toUpperCase()}:`)
      temps.forEach(t => {
        const elements = JSON.parse(t.elements || '[]')
        console.log(`  ✓ ${t.name} (${elements.length} elements)`)
      })
    }
  }

  console.log(`\n✅ Templates are ready to use in the editor!`)
}

displayTemplates()
