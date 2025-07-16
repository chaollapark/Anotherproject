const axios = require('axios');

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.sender = {
      name: process.env.SENDER_NAME || "EU Jobs",
      email: process.env.SENDER_EMAIL || "you@eujobs.co"
    };
    this.baseURL = 'https://api.brevo.com/v3/smtp/email';
  }

  async sendEmail(to, subject, htmlContent) {
    try {
      const response = await axios.post(this.baseURL, {
        sender: this.sender,
        to: [{ email: to }],
        subject,
        htmlContent
      }, {
        headers: {
          "api-key": this.apiKey,
          "Content-Type": "application/json"
        }
      });
      
      console.log(`Email sent successfully to ${to}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async sendWelcomeEmail(email, domainUrl) {
    const preferenceLinks = ["junior", "middle", "senior"].map(level =>
      `<a href="${domainUrl}/preferences?email=${encodeURIComponent(email)}&level=${level}" 
         style="display: inline-block; margin: 10px; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
         Show me ${level} jobs
       </a>`
    ).join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to EU Jobs! 🎉</h2>
        <p style="color: #666; line-height: 1.6;">
          We're excited to help you find your next opportunity! 
          Please let us know what kind of jobs you're looking for:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          ${preferenceLinks}
        </div>
        <p style="color: #999; font-size: 14px;">
          You'll receive daily job digests tailored to your preferences.
        </p>
      </div>
    `;

    return this.sendEmail(email, "Customize your job alerts", htmlContent);
  }

  async sendJobDigest(email, featuredJobs, latestJobs, level) {
    const htmlContent = this.buildJobDigestHtml(featuredJobs, latestJobs, level);
    const subject = `Your ${level} job digest - ${new Date().toLocaleDateString()}`;
    
    return this.sendEmail(email, subject, htmlContent);
  }

  buildJobDigestHtml(featuredJobs, latestJobs, level) {
    const formatJob = (job) => `
      <li style="margin-bottom: 15px; padding: 10px; border-left: 3px solid #007bff; background-color: #f8f9fa;">
        <a href="${job.url}" style="color: #007bff; text-decoration: none; font-weight: bold;">
          ${job.title}
        </a>
        <br>
        <span style="color: #666;">at ${job.company}</span>
        ${job.location ? `<br><span style="color: #888;">📍 ${job.location}</span>` : ''}
        ${job.salary ? `<br><span style="color: #28a745;">💰 ${job.salary}</span>` : ''}
      </li>
    `;

    const featuredSection = featuredJobs.length > 0 ? `
      <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">✨ Featured Jobs</h3>
      <ul style="list-style: none; padding: 0;">
        ${featuredJobs.map(formatJob).join('')}
      </ul>
    ` : '';

    const latestSection = latestJobs.length > 0 ? `
      <h3 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 5px;">🆕 Latest ${level} Jobs</h3>
      <ul style="list-style: none; padding: 0;">
        ${latestJobs.map(formatJob).join('')}
      </ul>
    ` : '';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Your Daily Job Digest</h2>
        <p style="color: #666; text-align: center;">
          Here are the latest opportunities matching your ${level} level preferences
        </p>
        ${featuredSection}
        ${latestSection}
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px;">
            <a href="${process.env.DOMAIN_URL}/unsubscribe?email=${encodeURIComponent(email)}" 
               style="color: #dc3545; text-decoration: none;">
              Unsubscribe
            </a>
          </p>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService(); 