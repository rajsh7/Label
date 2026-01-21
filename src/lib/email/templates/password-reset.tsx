/**
 * Password reset email template
 */

export function getPasswordResetEmailHtml(resetUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - LabelPro</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">LabelPro</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
    
    <p>Hi${userName ? ` ${userName}` : ''},</p>
    
    <p>We received a request to reset your password for your LabelPro account. Click the button below to create a new password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${resetUrl}</p>
    
    <p style="color: #dc2626; font-size: 14px; margin-top: 30px;"><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LabelPro. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getPasswordResetEmailText(resetUrl: string, userName?: string): string {
  return `
Hi${userName ? ` ${userName}` : ''},

We received a request to reset your password for your LabelPro account. Visit this link to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

© ${new Date().getFullYear()} LabelPro. All rights reserved.
  `.trim()
}

