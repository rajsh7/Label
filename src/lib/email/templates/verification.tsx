/**
 * Email verification template
 */

export function getVerificationEmailHtml(verificationUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - LabelPro</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">LabelPro</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
    
    <p>Hi${userName ? ` ${userName}` : ''},</p>
    
    <p>Thank you for signing up for LabelPro! To complete your registration and start creating labels, please verify your email address by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours. If you didn't create an account with LabelPro, you can safely ignore this email.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LabelPro. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getVerificationEmailText(verificationUrl: string, userName?: string): string {
  return `
Hi${userName ? ` ${userName}` : ''},

Thank you for signing up for LabelPro! To complete your registration and start creating labels, please verify your email address by visiting this link:

${verificationUrl}

This link will expire in 24 hours. If you didn't create an account with LabelPro, you can safely ignore this email.

© ${new Date().getFullYear()} LabelPro. All rights reserved.
  `.trim()
}

