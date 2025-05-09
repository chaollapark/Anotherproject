/**
 * Debug SendGrid API Key Script
 * This script checks if your SendGrid API key is correctly formatted and accessible
 * Run with: pnpm tsx src/tests/debug-sendgrid.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables directly from the file
dotenv.config();

function debugApiKey() {
  console.log('\n🔍 SendGrid API Key Debugging Tool');
  console.log('===================================');
  
  // Get the API key from environment
  const apiKey = process.env.SENDGRID_API_KEY || '';
  
  console.log(`\n1. Raw API key (first 5 chars): "${apiKey.substring(0, 5)}..."`);
  
  // Check for quotes in the API key
  const hasQuotes = apiKey.includes('"') || apiKey.includes('\'');
  console.log(`2. API key contains quotes: ${hasQuotes ? 'YES ⚠️' : 'NO ✅'}`);
  
  // Clean the API key
  const cleanApiKey = apiKey.replace(/["']/g, '');
  console.log(`3. Cleaned API key (first 5 chars): "${cleanApiKey.substring(0, 5)}..."`);
  
  // Validate API key format
  const isSgFormat = cleanApiKey.startsWith('SG.');
  console.log(`4. API key starts with "SG.": ${isSgFormat ? 'YES ✅' : 'NO ⚠️'}`);
  
  // Check for whitespace
  const hasWhitespace = /\s/.test(cleanApiKey);
  console.log(`5. API key contains whitespace: ${hasWhitespace ? 'YES ⚠️' : 'NO ✅'}`);
  
  console.log('\n📋 RECOMMENDATIONS:');
  
  if (!isSgFormat) {
    console.log('- Your API key does not start with "SG.", which is required by SendGrid');
    console.log('- Check that you have a valid SendGrid API key from your SendGrid account');
  }
  
  if (hasQuotes) {
    console.log('- Your API key contains quotes in the .env file. While we remove these programmatically,');
    console.log('  it\'s better to store the API key without quotes in your .env file');
  }
  
  if (hasWhitespace) {
    console.log('- Your API key contains whitespace characters which could cause issues');
    console.log('- Remove any spaces, tabs, or newlines from your API key in the .env file');
  }
  
  if (isSgFormat && !hasQuotes && !hasWhitespace) {
    console.log('✅ Your SendGrid API key format looks correct!');
  } else {
    console.log('\n⚠️ SUGGESTED .ENV ENTRY:');
    console.log('SENDGRID_API_KEY=SG.your_actual_key_here');
    console.log('(without quotes, spaces, or other characters)');
  }
  
  // Check the sender email
  const senderEmail = process.env.EMAIL_FROM || 'Not set';
  console.log(`\n6. Sender email: ${senderEmail}`);
  console.log('Make sure this email is verified in your SendGrid account');
}

debugApiKey();
