/**
 * Welcome email template
 */

export function getWelcomeEmailHtml(userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LabelPro!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LabelPro!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">You're All Set! 🎉</h2>
    
    <p>Hi${userName ? ` ${userName}` : ''},</p>
    
    <p>Welcome to LabelPro! We're excited to have you on board. You now have access to create professional labels for all your e-commerce needs.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="color: #1f2937; margin-top: 0;">Get Started in 3 Easy Steps:</h3>
      <ol style="color: #4b5563; padding-left: 20px;">
        <li style="margin-bottom: 10px;"><strong>Browse Labels</strong> - Choose from 255+ label formats</li>
        <li style="margin-bottom: 10px;"><strong>Design Your Label</strong> - Add text, images, and barcodes</li>
        <li style="margin-bottom: 10px;"><strong>Print or Download</strong> - Generate your labels instantly</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'}/labels" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Start Creating Labels</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">If you have any questions, feel free to reach out to our support team. We're here to help!</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LabelPro. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getWelcomeEmailText(userName?: string): string {
  return `
Welcome to LabelPro!

Hi${userName ? ` ${userName}` : ''},

Welcome to LabelPro! We're excited to have you on board. You now have access to create professional labels for all your e-commerce needs.

Get Started in 3 Easy Steps:
1. Browse Labels - Choose from 255+ label formats
2. Design Your Label - Add text, images, and barcodes
3. Print or Download - Generate your labels instantly

Start creating labels: ${process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'}/labels

If you have any questions, feel free to reach out to our support team. We're here to help!

© ${new Date().getFullYear()} LabelPro. All rights reserved.
  `.trim()
}

