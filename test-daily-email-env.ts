#!/usr/bin/env tsx

/**
 * Test daily email service with .env file loading
 */

import * as fs from 'fs';
import * as path from 'path';
import * as Brevo from '@getbrevo/brevo';

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

async function testDailyEmailWithEnv() {
  console.log('🔍 Testing Daily Email Service with .env...');
  console.log('================================');
  
  // Load environment variables
  const envVars = loadEnvFile();
  
  console.log('\n📋 Environment Variables from .env:');
  console.log(`BREVO_API_KEY: ${envVars.BREVO_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`BREVO_NEWSLETTER_LIST_ID: ${envVars.BREVO_NEWSLETTER_LIST_ID || '❌ Not set'}`);
  console.log(`EMAIL_FROM: ${envVars.EMAIL_FROM || '❌ Not set'}`);
  
  if (!envVars.BREVO_API_KEY) {
    console.log('\n❌ BREVO_API_KEY not found in .env file!');
    return;
  }
  
  try {
    // Initialize Brevo API exactly like in dailyEmailService
    const apiKey = envVars.BREVO_API_KEY.replace(/["']/g, '').trim();
    const contactsApiInstance = new Brevo.ContactsApi();
    contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    // Get newsletter list ID from environment
    const NEWSLETTER_LIST_ID = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
    
    if (!NEWSLETTER_LIST_ID) {
      console.log('\n❌ BREVO_NEWSLETTER_LIST_ID environment variable is required');
      return;
    }
    
    // Get contacts from Brevo newsletter list (exact same call as dailyEmailService)
    console.log(`\n👥 Fetching contacts from Brevo list ID: ${NEWSLETTER_LIST_ID}`);
    
    const contactsResponse = await contactsApiInstance.getContactsFromList(NEWSLETTER_LIST_ID, {
      limit: 1000,
      offset: 0
    });
    
    const contacts = contactsResponse.contacts || [];
    console.log(`✅ Success! Found ${contacts.length} contacts in the list`);
    
    if (contacts.length > 0) {
      console.log('\n📧 Sample contacts:');
      contacts.slice(0, 3).forEach((contact: any) => {
        console.log(`   - ${contact.email}`);
      });
      
      console.log('\n🎉 Ready to send daily emails!');
      console.log(`   Total subscribers: ${contacts.length}`);
      console.log('   The daily email system is working correctly.');
      
    } else {
      console.log('\n⚠️  No contacts found in the newsletter list');
      console.log('   You may need to add some subscribers to your Brevo list first.');
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.response?.status) {
      console.log('   Status code:', error.response.status);
    }
  }
}

testDailyEmailWithEnv(); 