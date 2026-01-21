import { NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'

/**
 * POST /api/account/export-data
 * Export all user data (GDPR compliance)
 */
export async function POST() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Gather all user data
    const [profile, designs, templates, batchJobs, printers, favorites, apiKeys, teamMembers] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('label_designs').select('*').eq('user_id', session.user.id),
        supabase.from('templates').select('*').eq('user_id', session.user.id),
        supabase.from('batch_jobs').select('*').eq('user_id', session.user.id),
        supabase.from('printers').select('*').eq('user_id', session.user.id),
        supabase.from('favorites').select('*').eq('user_id', session.user.id),
        supabase.from('api_keys').select('id, name, created_at').eq('user_id', session.user.id),
        supabase.from('team_members').select('*').eq('team_owner_id', session.user.id),
      ])

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: session.user.id,
      user_email: session.user.email,
      profile: profile.data,
      designs: designs.data || [],
      templates: templates.data || [],
      batch_jobs: batchJobs.data || [],
      printers: printers.data || [],
      favorites: favorites.data || [],
      api_keys: apiKeys.data || [],
      team_members: teamMembers.data || [],
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="labelpro-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export data error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export data' },
      { status: 500 }
    )
  }
}

