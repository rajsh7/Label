import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkRLS() {
  console.log('\n🔍 Checking Templates with Service Role (bypasses RLS):\n')
  
  const { data, error, count } = await supabase
    .from('templates')
    .select('*', { count: 'exact' })
    .eq('is_public', true)

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`Total public templates: ${count}`)
  
  if (data && data.length > 0) {
    console.log('\nTemplates found:')
    data.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name}`)
      console.log(`   - ID: ${t.id}`)
      console.log(`   - user_id: ${t.user_id}`)
      console.log(`   - is_public: ${t.is_public}`)
      console.log(`   - category: ${t.category}`)
    })
  } else {
    console.log('❌ No templates found!')
  }
}

checkRLS()
