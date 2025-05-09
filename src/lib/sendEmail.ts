import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

// Load environment variables for local testing
dotenv.config();

/**
 * SendGrid email configuration
 */

// Get the API key from environment variable
const apiKey = (process.env.SENDGRID_API_KEY || '').replace(/["']/g, '').trim();

// Initialize SendGrid client with API key
sgMail.setApiKey(apiKey);

// Log success message without exposing the key
console.log('SendGrid email service initialized');

export async function sendEmail(to: string, subject: string, message: string) {
  try {
    // Get sender email from environment or use default
    const fromEmail = process.env.EMAIL_FROM || 'madan@lobbyinglondon.com';
    
    // Create email message
    const msg = {
      to: to,
      from: fromEmail, // Use verified sender from environment variables
      subject: subject,
      html: message, // SendGrid also supports HTML formatting
    };
    
    console.log(`Attempting to send email from: ${fromEmail} to: ${to}`);
    
    // Send email
    const response = await sgMail.send(msg);
    
    console.log("✅ Email sent successfully with SendGrid");
    return response;
  } catch (error) {
    console.error("❌ Error sending email with SendGrid:", error);
    // Log error details for debugging while keeping sensitive info secure
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { code?: number; response?: { body?: { errors?: any[] } } };
      console.error(`Status code: ${err.code || 'unknown'}`);
      
      if (err.response?.body?.errors) {
        console.error('Error details:', err.response.body.errors);
      }
    }
    
    throw new Error("Failed to send email.");
  }
}
