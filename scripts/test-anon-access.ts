import { createClient } from '@supabase/supabase-js'

// Use the ANON key (same as frontend) to test RLS
const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'need-anon-key'

console.log('Testing with ANON key (same as frontend)...\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAnonAccess() {
  console.log('🔍 Querying templates as anonymous user (no auth):\n')
  
  const { data, error, count } = await supabase
    .from('templates')
    .select('*', { count: 'exact' })
    .eq('is_public', true)

  if (error) {
    console.error('❌ Error:', error.message)
    console.error('Details:', error)
    return
  }

  console.log(`✅ Found ${count} public templates\n`)
  
  if (data && data.length > 0) {
    data.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name}`)
    })
  } else {
    console.log('⚠️  No templates returned (RLS might be blocking)')
  }
}

testAnonAccess()
