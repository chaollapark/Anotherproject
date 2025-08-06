#!/usr/bin/env node

/**
 * Daily Email Sending Script
 * 
 * This script sends daily job emails to all contacts in your Brevo newsletter list.
 * Can be run manually or via cron job.
 * 
 * Usage:
 * - Manual: node scripts/send-daily-emails.js
 * - Cron: 0 9 * * * /usr/bin/node /path/to/scripts/send-daily-emails.js
 */

const { sendDailyJobEmails } = require('../src/lib/dailyEmailService');

async function main() {
  console.log('🚀 Starting daily email campaign...');
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  
  try {
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
    
    // Exit with appropriate code
    process.exit(stats.emailsFailed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 Fatal error in daily email script:', error);
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
main(); 