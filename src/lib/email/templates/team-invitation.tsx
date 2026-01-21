/**
 * Team invitation email template
 */

export function getTeamInvitationEmailHtml(
  inviterName: string,
  teamName: string,
  invitationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation - LabelPro</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Team Invitation</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">You've Been Invited!</h2>
    
    <p>Hi,</p>
    
    <p><strong>${inviterName}</strong> has invited you to join their team on LabelPro. Collaborate on label designs, share templates, and work together to create professional labels.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="margin: 0; color: #4b5563;"><strong>Team:</strong> ${teamName}</p>
      <p style="margin: 10px 0 0 0; color: #4b5563;"><strong>Invited by:</strong> ${inviterName}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Accept Invitation</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
    <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${invitationUrl}</p>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">If you don't have a LabelPro account, clicking the link will allow you to create one and automatically join the team.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LabelPro. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim()
}

export function getTeamInvitationEmailText(
  inviterName: string,
  teamName: string,
  invitationUrl: string
): string {
  return `
Team Invitation

Hi,

${inviterName} has invited you to join their team on LabelPro. Collaborate on label designs, share templates, and work together to create professional labels.

Team: ${teamName}
Invited by: ${inviterName}

Accept invitation: ${invitationUrl}

If you don't have a LabelPro account, clicking the link will allow you to create one and automatically join the team.

© ${new Date().getFullYear()} LabelPro. All rights reserved.
  `.trim()
}

