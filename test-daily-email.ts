/**
 * Test script for daily email functionality
 * Run with: npx tsx test-daily-email.ts
 */

import { sendDailyJobEmails, addSubscriber } from './src/lib/dailyEmailService';

async function testDailyEmail() {
  console.log('🧪 Testing Daily Email System...');
  console.log('================================');
  
  try {
    // Test 1: Add subscriber
    console.log('\n1. Testing subscriber addition...');
    try {
      const result = await addSubscriber('chaollapark@gmail.com', {
        jobTypes: ['full-time', 'part-time'],
        locations: ['Brussels', 'Luxembourg'],
        seniority: ['junior', 'mid-level', 'senior']
      });
      console.log('✅ Subscriber added:', result);
    } catch (error: any) {
      console.log('❌ Error adding subscriber:', error.message);
      console.log('This might be due to missing BREVO_NEWSLETTER_LIST_ID environment variable');
    }

    // Test 2: Send daily emails
    console.log('\n2. Testing daily email sending...');
    try {
      const stats = await sendDailyJobEmails();
      console.log('✅ Daily email campaign completed:');
      console.log(`   - Total contacts: ${stats.totalSubscribers}`);
      console.log(`   - Emails sent: ${stats.emailsSent}`);
      console.log(`   - Emails failed: ${stats.emailsFailed}`);
      
      if (stats.errors.length > 0) {
        console.log('   - Errors:');
        stats.errors.forEach(error => console.log(`     * ${error}`));
      }
    } catch (error: any) {
      console.log('❌ Error sending daily emails:', error.message);
    }

  } catch (error: any) {
    console.error('💥 Fatal error:', error);
  }
}

// Run the test
testDailyEmail(); 