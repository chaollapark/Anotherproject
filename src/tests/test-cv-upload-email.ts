/**
 * Test script for the CV upload email feature using Brevo
 * Run with: pnpm tsx src/tests/test-cv-upload-email.ts
 */

import { sendEmail } from '../lib/sendEmail';
import { cvUploadEmailTemplate } from '../emails/cvUploadEmailTemplate';

// Configuration
const TEST_EMAIL = 'chaollapark@gmail.com'; // Replace with your test email
const TEST_FILE_URL = 'https://example.com/fake-cv-url.pdf'; // This is just a placeholder URL

async function testCvUploadEmail() {
  console.log('🧪 Testing CV Upload Email with Brevo...');
  
  try {
    // Step 1: Create email content using the template
    const subject = 'Your CV Has Been Successfully Uploaded!';
    const message = cvUploadEmailTemplate(TEST_FILE_URL);
    
    console.log('📋 Email Content Preview:');
    console.log('Subject:', subject);
    console.log('Template Generated');
    
    // Step 2: Send email using Brevo
    console.log(`📨 Sending test email to: ${TEST_EMAIL}`);
    const response = await sendEmail(TEST_EMAIL, subject, message);
    
    console.log('✅ Email sent successfully with Brevo!');
    console.log('📊 Response:', response);
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test
testCvUploadEmail();
