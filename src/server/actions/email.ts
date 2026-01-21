/**
 * Server actions for sending emails
 */

import { sendEmail } from '@/lib/email/config'
import { getVerificationEmailHtml, getVerificationEmailText } from '@/lib/email/templates/verification'
import { getPasswordResetEmailHtml, getPasswordResetEmailText } from '@/lib/email/templates/password-reset'
import { getWelcomeEmailHtml, getWelcomeEmailText } from '@/lib/email/templates/welcome'
import { getBatchCompleteEmailHtml, getBatchCompleteEmailText } from '@/lib/email/templates/batch-complete'
import { getTeamInvitationEmailHtml, getTeamInvitationEmailText } from '@/lib/email/templates/team-invitation'

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: 'Verify your LabelPro email address',
      html: getVerificationEmailHtml(verificationUrl, userName),
      text: getVerificationEmailText(verificationUrl, userName),
    })

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification email',
    }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: 'Reset your LabelPro password',
      html: getPasswordResetEmailHtml(resetUrl, userName),
      text: getPasswordResetEmailText(resetUrl, userName),
    })

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send password reset email',
    }
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to LabelPro! 🎉',
      html: getWelcomeEmailHtml(userName),
      text: getWelcomeEmailText(userName),
    })

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send welcome email',
    }
  }
}

/**
 * Send batch job completion email
 */
export async function sendBatchCompleteEmail({
  email,
  batchJobName,
  totalLabels,
  downloadUrl,
  userName,
}: {
  email: string
  batchJobName: string
  totalLabels: number
  downloadUrl: string
  userName?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: `Batch job complete: ${batchJobName}`,
      html: getBatchCompleteEmailHtml(batchJobName, totalLabels, downloadUrl, userName),
      text: getBatchCompleteEmailText(batchJobName, totalLabels, downloadUrl, userName),
    })

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send batch complete email',
    }
  }
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(
  email: string,
  inviterName: string,
  teamName: string,
  invitationUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to: email,
      subject: `${inviterName} invited you to join their team on LabelPro`,
      html: getTeamInvitationEmailHtml(inviterName, teamName, invitationUrl),
      text: getTeamInvitationEmailText(inviterName, teamName, invitationUrl),
    })

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send team invitation email',
    }
  }
}

