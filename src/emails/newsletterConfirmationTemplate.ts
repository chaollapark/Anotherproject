export function newsletterConfirmationTemplate(email: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #007bff; margin-bottom: 10px;">🎉 Welcome to EUJobs.co!</h1>
        <p style="color: #666; font-size: 18px;">You've successfully subscribed to our newsletter</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">What you'll receive:</h2>
        <ul style="color: #555; padding-left: 20px;">
          <li>Daily digest of the latest EU job opportunities</li>
          <li>Exclusive insights about the EU job market</li>
          <li>Tips and advice for landing your dream EU job</li>
          <li>Updates on new features and services</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://eujobs.co" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Browse Latest Jobs</a>
      </div>
      
      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">
          <strong>Your email:</strong> ${email}
        </p>
        <p style="color: #666; font-size: 14px;">
          You can unsubscribe at any time by clicking the unsubscribe link in any of our emails.
        </p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
        <p>This email was sent to ${email} because you subscribed to EUJobs.co newsletter.</p>
        <p>© 2024 EUJobs.co - Your gateway to EU career opportunities</p>
      </div>
    </div>
  `;
} 