#!/usr/bin/env tsx

/**
 * Send Daily Emails - Final Working Version
 * 
 * This script sends daily job emails to all contacts in your Brevo newsletter list.
 * Uses the working API call without parameters.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as Brevo from '@getbrevo/brevo';
import { sendDailyJobEmails } from './src/lib/dailyEmailService';

// Load .env file manually
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const envVars: Record<string, string> = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^"|"$/g, '');
        envVars[key] = value;
      }
    }
  });
  
  return envVars;
}

async function sendDailyEmailsFinal() {
  console.log('🚀 Sending Daily Emails Now...');
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('================================');
  
  // Load environment variables
  const envVars = loadEnvFile();
  
  console.log('\n📋 Environment Check:');
  console.log(`BREVO_API_KEY: ${envVars.BREVO_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`BREVO_NEWSLETTER_LIST_ID: ${envVars.BREVO_NEWSLETTER_LIST_ID || '❌ Not set'}`);
  console.log(`EMAIL_FROM: ${envVars.EMAIL_FROM || '❌ Not set'}`);
  
  if (!envVars.BREVO_API_KEY) {
    console.log('\n❌ ERROR: BREVO_API_KEY is required!');
    process.exit(1);
  }
  
  // Set environment variables for the daily email service
  process.env.BREVO_API_KEY = envVars.BREVO_API_KEY;
  process.env.BREVO_NEWSLETTER_LIST_ID = envVars.BREVO_NEWSLETTER_LIST_ID;
  process.env.EMAIL_FROM = envVars.EMAIL_FROM;
  
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
    } else if (stats.totalSubscribers === 0) {
      console.log('\n⚠️  No emails were sent because there are no contacts in your newsletter list.');
      console.log('To test the daily emails, you need to:');
      console.log('1. Add some contacts to your Brevo newsletter list (ID: 7)');
      console.log('2. Run this script again');
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
sendDailyEmailsFinal(); 