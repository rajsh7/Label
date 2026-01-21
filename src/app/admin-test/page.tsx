'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminTest() {
  const [debug, setDebug] = useState<string[]>([])

  useEffect(() => {
    testAdminAccess()
  }, [])

  const testAdminAccess = async () => {
    const logs: string[] = []
    
    try {
      logs.push('Starting admin access test...')
      
      const { data: { session } } = await supabase.auth.getSession()
      logs.push(`Session user: ${session?.user?.email || 'No session'}`)
      logs.push(`Session ID: ${session?.user?.id || 'No ID'}`)
      
      if (!session?.user) {
        logs.push('❌ No session found')
        setDebug(logs)
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      logs.push(`Profile data: ${JSON.stringify(profile)}`)
      logs.push(`Profile error: ${JSON.stringify(error)}`)
      logs.push(`is_admin value: ${profile?.is_admin} (type: ${typeof profile?.is_admin})`)
      
      if (profile?.is_admin === true) {
        logs.push('✅ User has admin access!')
      } else {
        logs.push('❌ User does not have admin access')
      }
      
    } catch (error) {
      logs.push(`❌ Error: ${error}`)
    }
    
    setDebug(logs)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Access Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        {debug.map((log, i) => (
          <div key={i} className="font-mono text-sm mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}