import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimitAPI, API_RATE_LIMITS } from '@/lib/rateLimit/apiRateLimit'
import { sendWelcomeEmail, sendVerificationEmail } from '@/server/actions/email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * POST /api/auth/signup
 * Handle user signup and send welcome/verification emails
 */
export async function POST(request: NextRequest) {
  // Rate limit check for signup
  const rateLimitResult = rateLimitAPI(request, API_RATE_LIMITS.auth)
  if (rateLimitResult) {
    return rateLimitResult
  }

  try {
    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Create user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || null,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email`,
      },
    })

    if (signupError) {
      return NextResponse.json({ error: signupError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, full_name || undefined)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail signup if email fails
    }

    // Send verification email if needed
    if (authData.user && !authData.user.email_confirmed_at) {
      try {
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${authData.user.id}`
        await sendVerificationEmail(email, verificationUrl, full_name || undefined)
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create account' },
      { status: 500 }
    )
  }
}

