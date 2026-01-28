import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkLabels() {
  try {
    const { data: labels, error, count } = await supabase
      .from('labels')
      .select('*', { count: 'exact' })

    if (error) {
      console.error('❌ Labels error:', error)
      return
    }

    console.log(`🏷️  LABELS: ${count} total`)
    
    if (labels && labels.length > 0) {
      // Group by category
      const categories = labels.reduce((acc, label) => {
        acc[label.category] = (acc[label.category] || 0) + 1
        return acc
      }, {})

      console.log('\n📊 By Category:')
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`)
      })

      // Sample label
      console.log('\n📋 Sample Label:')
      const sample = labels[0]
      console.log(`  Name: ${sample.name}`)
      console.log(`  Size: ${sample.width_mm}x${sample.height_mm}mm`)
      console.log(`  Pixels (203 DPI): ${sample.width_px_203dpi}x${sample.height_px_203dpi}`)
      console.log(`  Category: ${sample.category}`)
      console.log(`  Marketplace: ${sample.marketplace}`)
    }

    // Test label fetching
    const { data: testLabels, error: testError } = await supabase
      .from('labels')
      .select('id, name, category')
      .limit(5)

    if (testError) {
      console.error('❌ Test fetch error:', testError)
    } else {
      console.log('\n✅ Label fetching works fine')
      console.log('Sample labels:', testLabels?.map(l => l.name))
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkLabels()