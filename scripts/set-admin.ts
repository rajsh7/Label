import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ommnghxwpqwoprtrkept.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbW5naHh3cHF3b3BydHJrZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODMwMTAwNSwiZXhwIjoyMDgzODc3MDA1fQ.JARIDhDtz5WI2WOCMX6lxi5gmebKio-STtjTKNayrCA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setAdminPrivileges() {
  const adminUserId = '0e758c03-1b3b-4923-9f1d-d73da8ef6a5b'
  
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUserId)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', adminUserId)

      if (error) {
        console.error('Error updating admin flag:', error)
      } else {
        console.log('✅ Admin privileges granted to existing profile')
      }
    } else {
      // Create new profile with admin flag
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: adminUserId,
          email: 'admin@labelpro.com',
          is_admin: true,
          full_name: 'Admin User',
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating admin profile:', error)
      } else {
        console.log('✅ Admin profile created with privileges')
      }
    }

    // Verify the change
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUserId)
      .single()

    console.log('Admin profile:', profile)

  } catch (error) {
    console.error('Error:', error)
  }
}

setAdminPrivileges()