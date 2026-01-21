/**
 * Batch job completion email template
 */

export function getBatchCompleteEmailHtml(
  batchJobName: string,
  totalLabels: number,
  downloadUrl: string,
  userName?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Batch Job Complete - LabelPro</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Batch Job Complete!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">Your Labels Are Ready</h2>
    
    <p>Hi${userName ? ` ${userName}` : ''},</p>
    
    <p>Great news! Your batch job "<strong>${batchJobName}</strong>" has been completed successfully.</p>
    
    <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="margin: 0; color: #166534; font-weight: 600;">✓ ${totalLabels} label${totalLabels !== 1 ? 's' : ''} generated successfully</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Download Labels</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">The download link will be valid for 7 days. You can also access your batch jobs from your dashboard.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LabelPro. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getBatchCompleteEmailText(
  batchJobName: string,
  totalLabels: number,
  downloadUrl: string,
  userName?: string
): string {
  return `
Batch Job Complete!

Hi${userName ? ` ${userName}` : ''},

Great news! Your batch job "${batchJobName}" has been completed successfully.

✓ ${totalLabels} label${totalLabels !== 1 ? 's' : ''} generated successfully

Download your labels: ${downloadUrl}

The download link will be valid for 7 days. You can also access your batch jobs from your dashboard.

© ${new Date().getFullYear()} LabelPro. All rights reserved.
  `.trim()
}

