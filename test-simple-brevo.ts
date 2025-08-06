#!/usr/bin/env tsx

/**
 * Simple Brevo API test - mimics daily email service
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

async function testSimpleBrevo() {
  console.log('🔍 Testing Simple Brevo API Call...');
  console.log('================================');
  
  // Load environment variables
  const envVars = loadEnvFile();
  
  if (!envVars.BREVO_API_KEY) {
    console.log('\n❌ BREVO_API_KEY not found in .env file!');
    return;
  }
  
  try {
    // Initialize Brevo API exactly like in dailyEmailService
    const apiKey = envVars.BREVO_API_KEY.replace(/["']/g, '').trim();
    const contactsApiInstance = new Brevo.ContactsApi();
    contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    const listId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
    console.log(`\n👥 Testing getContactsFromList with list ID ${listId}...`);
    
    // Try the exact same call as dailyEmailService
    const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
      limit: 1000,
      offset: 0
    });
    
    console.log('✅ Success! Contacts retrieved successfully');
    console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    
    if (contactsResponse.contacts && contactsResponse.contacts.length > 0) {
      console.log('   Sample contacts:');
      contactsResponse.contacts.slice(0, 3).forEach((contact: any) => {
        console.log(`     - ${contact.email}`);
      });
    } else {
      console.log('   ⚠️  No contacts found in the list');
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

testSimpleBrevo(); 