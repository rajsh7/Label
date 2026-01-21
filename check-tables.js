// Check database tables script
// Run: node check-tables.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMDEwMDUsImV4cCI6MjA4Mzg3NzAwNX0.nwBJsBUpKw6g4yuOLdu_xbtegk2wT6XtVeZ-_kvIG2Q'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Checking database tables...\n')
  
  const tables = ['profiles', 'labels', 'batch_jobs', 'templates', 'printers', 'integrations']
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ ${table}: Table not found or error - ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count} rows`)
      }
    } catch (err) {
      console.log(`❌ ${table}: Error - ${err.message}`)
    }
  }
  
  console.log('\n📊 Database check complete!')
}

checkTables()