import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/server/actions/email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * POST /api/auth/reset-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Request password reset from Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/reset`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get user profile for personalized email
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', email)
      .single()

    // Send custom password reset email
    // Note: In production, you'd get the actual reset token from Supabase
    // For now, we'll use the Supabase default reset flow
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/reset`
    
    await sendPasswordResetEmail(
      email,
      resetUrl,
      profile?.full_name || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send password reset email' },
      { status: 500 }
    )
  }
}

