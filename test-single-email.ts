/**
 * Test script for sending a single email
 * Run with: npx tsx test-single-email.ts
 */

import { sendEmail } from './src/lib/sendEmail';
import { dailyJobsEmailTemplate } from './src/emails/dailyJobsEmailTemplate';
import { fetchJobs } from './src/models/Job';

async function testSingleEmail() {
  console.log('🧪 Testing Single Email...');
  console.log('==========================');
  
  try {
    // Fetch some test jobs
    console.log('\n1. Fetching latest jobs...');
    const jobs = await fetchJobs(5);
    console.log(`✅ Found ${jobs.length} jobs`);
    
    if (jobs.length === 0) {
      console.log('❌ No jobs found. Creating mock job...');
      // Create a mock job for testing
      const mockJob = {
        title: 'Senior Policy Officer',
        companyName: 'European Commission',
        slug: 'senior-policy-officer-ec-test',
        city: 'Brussels',
        country: 'Belgium',
        type: 'Full-time',
        seniority: 'senior',
        salary: 80000,
        description: 'This is a test job for testing the daily email functionality. The role involves policy development and implementation in the European context.'
      };
      jobs.push(mockJob as any);
    }

    // Create email content
    console.log('\n2. Creating email content...');
    const emailHtml = dailyJobsEmailTemplate(jobs, 'chaollapark@gmail.com');
    const subject = '🚀 Latest EU Jobs - Apply First, Get Hired Faster!';
    
    console.log('✅ Email content created');
    console.log(`   - Subject: ${subject}`);
    console.log(`   - Jobs included: ${jobs.length}`);
    
    // Send the email
    console.log('\n3. Sending email...');
    const response = await sendEmail('chaollapark@gmail.com', subject, emailHtml);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Check your inbox at chaollapark@gmail.com');
    console.log('📊 Response:', response);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testSingleEmail(); 