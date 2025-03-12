export function cvUploadEmailTemplate(fileUrl: string) {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2 style="color: #007bff;">🎉 Your CV is Successfully Uploaded!</h2>
        <p>Hello,</p>
        <p>We have received your CV and it's now securely stored in our system.</p>
        <p>You can view it anytime here: <a href="${fileUrl}" style="color: #007bff;">View CV</a></p>
        <p>What’s next? We will send you our score for your CV - if it's over 7 out of 10 we'll match you with a interview in the next 30 days.</p>
        <p>Our goal is to gradually reduce you get your interview scheduled to 1 day!</p>
        <p>In the meantime you can also check out our jobs https://www.eujobs.co </p>
        <p><strong>Stay tuned for updates! and for any questions email me at ceo@zatjob.com </strong></p>
        <p><strong>Cherios</strong></p>
        <p><strong>Madan | CEO</strong></p>
        <hr style="border: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">
          This is an automated email from EUJobs. If you did not request this, please ignore.
        </p>
      </div>
    `;
  }