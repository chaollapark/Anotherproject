import * as Brevo from '@getbrevo/brevo';
import * as dotenv from 'dotenv';

// Load environment variables for local testing
dotenv.config();

/**
 * Brevo email configuration
 */

// Get the API key from environment variable
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();

// Initialize Brevo client with API key
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  apiKey
);

// Log success message without exposing the key
console.log('Brevo email service initialized');

export async function sendEmail(to: string, subject: string, message: string) {
  try {
    // Get sender email from environment or use default
    const fromEmail = process.env.EMAIL_FROM || 'noreply@eujobs.online';
    
    // Ensure we're using a clean email format for Brevo
    const cleanEmail = fromEmail.includes('<') ? fromEmail.match(/<(.+?)>/)?.[1] || fromEmail : fromEmail;
    
    // Create email message using Brevo
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = message;
    sendSmtpEmail.sender = { name: 'EUJobs.co', email: cleanEmail };
    sendSmtpEmail.to = [{ email: to }];
    
    console.log(`Attempting to send email from: ${cleanEmail} to: ${to}`);
    
    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Email sent successfully with Brevo");
    return response;
  } catch (error) {
    console.error("❌ Error sending email with Brevo:", error);
    // Log error details for debugging while keeping sensitive info secure
    if (error && typeof error === 'object') {
      console.error('Error details:', error);
    }
    
    throw new Error("Failed to send email.");
  }
}
