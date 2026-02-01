import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTemplates() {
  console.log('Fetching templates...\n')
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .limit(2)
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Found ${data?.length} templates\n`)
  
  if (data && data.length > 0) {
    console.log('Available columns:')
    console.log(Object.keys(data[0]).join(', '))
    console.log('\n')
    
    console.log('First template:')
    console.log(JSON.stringify(data[0], null, 2))
  }
}

checkTemplates()
