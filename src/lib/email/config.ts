import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_CONFIG = {
  from: 'LabelPro <noreply@labelpro.com>',
  replyTo: 'support@labelpro.com',
} as const

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}