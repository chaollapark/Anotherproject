#!/usr/bin/env tsx

/**
 * Send Daily Emails Now - Test Script
 * 
 * This script sends daily job emails to all contacts in your Brevo newsletter list.
 * Run this to test the daily email functionality immediately.
 * 
 * Usage: npx tsx send-daily-emails-now.ts
 */

import { sendDailyJobEmails } from './src/lib/dailyEmailService';

async function sendDailyEmailsNow() {
  console.log('🚀 Sending Daily Emails Now...');
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('================================');
  
  // Check environment variables
  console.log('\n📋 Environment Check:');
  console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`BREVO_NEWSLETTER_LIST_ID: ${process.env.BREVO_NEWSLETTER_LIST_ID || '❌ Not set'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ Not set'}`);
  
  if (!process.env.BREVO_API_KEY) {
    console.log('\n❌ ERROR: BREVO_API_KEY is required!');
    console.log('Please set your Brevo API key:');
    console.log('export BREVO_API_KEY="your_api_key_here"');
    process.exit(1);
  }
  
  if (!process.env.BREVO_NEWSLETTER_LIST_ID) {
    console.log('\n❌ ERROR: BREVO_NEWSLETTER_LIST_ID is required!');
    console.log('Please set your newsletter list ID:');
    console.log('export BREVO_NEWSLETTER_LIST_ID="your_list_id"');
    process.exit(1);
  }
  
  try {
    console.log('\n📧 Starting daily email campaign...');
    const stats = await sendDailyJobEmails();
    
    console.log('\n📊 Daily Email Campaign Results:');
    console.log(`📧 Total Contacts in List: ${stats.totalSubscribers}`);
    console.log(`✅ Emails Sent: ${stats.emailsSent}`);
    console.log(`❌ Emails Failed: ${stats.emailsFailed}`);
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      stats.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log(`\n⏰ Completed at: ${new Date().toISOString()}`);
    
    if (stats.emailsSent > 0) {
      console.log('\n🎉 Success! Daily emails have been sent to your subscribers.');
      console.log('Check your Brevo dashboard to see the email campaign results.');
    } else {
      console.log('\n⚠️  No emails were sent. Check the errors above.');
    }
    
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
sendDailyEmailsNow(); 