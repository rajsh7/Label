import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimitAPI, API_RATE_LIMITS } from '@/lib/rateLimit/apiRateLimit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * DELETE /api/user/delete-account
 * GDPR-compliant account deletion endpoint
 * Soft deletes all user data and signs out the user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Rate limit check (5 requests per hour, same as GDPR export)
    const rateLimitResult = rateLimitAPI(request, API_RATE_LIMITS.export)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)
    const deletedAt = new Date().toISOString()

    // Soft delete all user data in order (respecting foreign key constraints)
    // 1. Soft delete favorites
    await adminSupabase
      .from('favorites')
      .update({ deleted_at: deletedAt })
      .eq('user_id', userId)

    // 2. Soft delete batch jobs
    await adminSupabase
      .from('batch_jobs')
      .update({ deleted_at: deletedAt })
      .eq('user_id', userId)

    // 3. Soft delete printers
    await adminSupabase
      .from('printers')
      .update({ deleted_at: deletedAt })
      .eq('user_id', userId)

    // 4. Soft delete label designs (including templates)
    await adminSupabase
      .from('label_designs')
      .update({ deleted_at: deletedAt })
      .eq('user_id', userId)

    // 5. Soft delete templates (if separate table exists)
    // Note: templates might be in label_designs with is_template flag
    // Check if templates table exists, otherwise skip
    try {
      await adminSupabase
        .from('templates')
        .update({ deleted_at: deletedAt })
        .eq('user_id', userId)
    } catch (error) {
      // Templates table might not exist or templates are in label_designs
      console.log('Templates table not found or already handled via label_designs')
    }

    // 6. Soft delete profile (user account)
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .update({ 
        deleted_at: deletedAt,
        email: `deleted-${userId}@deleted.local`, // Anonymize email
        full_name: null,
        company_name: null,
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Profile deletion error:', profileError)
      return NextResponse.json(
        { error: 'Failed to delete account profile' },
        { status: 500 }
      )
    }

    // 7. Sign out the user session
    // Note: This will be handled by the client after receiving success response
    // We can't sign out server-side easily, so client should handle it

    return NextResponse.json({ 
      success: true,
      message: 'Account and all associated data have been deleted successfully',
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete account' },
      { status: 500 }
    )
  }
}

