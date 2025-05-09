/**
 * Test script for the 'send job to myself' feature using SendGrid
 * Run with: pnpm tsx src/tests/test-email-job.ts
 */

import { sendEmail } from '../lib/sendEmail';

// Configuration
const TEST_EMAIL = 'chaollapark@gmail.com'; // Replace with your test email

async function testSendJobEmail() {
  console.log('🧪 Testing Send Job Email with SendGrid...');
  
  try {
    // Use a mock job instead of accessing the database
    console.log('📋 Creating a mock job for testing');
    const job = {
      title: 'Senior Policy Officer',
      companyName: 'European Commission',
      slug: 'senior-policy-officer-ec-123456',
      city: 'Brussels',
      country: 'Belgium',
      type: 'full',
      seniority: 'senior',
      salary: '80,000 - 100,000 EUR',
      description: '<p>This is a test job description for testing the SendGrid email functionality.</p>',
      applyLink: 'https://eujobs.co/apply/test'
    };
    
    console.log('✅ Job found:', job.title);
    
    // Step 2: Create email content
    const subject = `Job: ${job.title} at ${job.companyName}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Job Details</h2>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">${job.title}</h3>
          <p style="margin: 4px 0;"><strong>Company:</strong> ${job.companyName}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${job.city || 'Brussels'}, ${job.country || 'Belgium'}</p>
          <p style="margin: 4px 0;"><strong>Type:</strong> ${job.type}-time</p>
          <p style="margin: 4px 0;"><strong>Seniority:</strong> ${job.seniority}</p>
          ${job.salary ? `<p style="margin: 4px 0;"><strong>Salary:</strong> ${job.salary}</p>` : ''}
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Job Description</h3>
          ${job.description}
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://eujobs.co/jobs/${job.slug}" style="color: #3b82f6; text-decoration: none;">View on EUJobs.co</a>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 24px; text-align: center;">
          This is a test email sent from the SendGrid test script
        </p>
      </div>
    `;
    
    // Step 3: Send email using SendGrid
    console.log(`📨 Sending test email to: ${TEST_EMAIL}`);
    const response = await sendEmail(TEST_EMAIL, subject, message);
    
    console.log('✅ Email sent successfully with SendGrid!');
    console.log('📊 Response:', response);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSendJobEmail();
