import { NextRequest, NextResponse } from 'next/server'
import { resetMonthlyUsage } from '@/lib/usage/tracking'

/**
 * POST /api/cron/reset-usage
 * Reset monthly usage counters for all users
 * Should be called via cron job (e.g., Vercel Cron) on the 1st of each month
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (if using Vercel Cron, check authorization header)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await resetMonthlyUsage()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Monthly usage counters reset successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset usage' },
      { status: 500 }
    )
  }
}

