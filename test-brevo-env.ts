#!/usr/bin/env tsx

/**
 * Test Brevo API with .env file loading
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

async function testBrevoWithEnv() {
  console.log('🔍 Testing Brevo API with .env file...');
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
    // Initialize Brevo API with loaded key
    const apiKey = envVars.BREVO_API_KEY.replace(/["']/g, '').trim();
    const contactsApiInstance = new Brevo.ContactsApi();
    contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    console.log('\n🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    // Test getting contacts from list
    const listId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
    console.log(`\n👥 Testing: Getting contacts from list ID ${listId}...`);
    
    const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
      limit: 10,
      offset: 0
    });
    
    console.log('✅ Success! Contacts retrieved successfully');
    console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    
    if (contactsResponse.contacts && contactsResponse.contacts.length > 0) {
      console.log('   Sample contacts:');
      contactsResponse.contacts.slice(0, 3).forEach((contact: any) => {
        console.log(`     - ${contact.email} (${contact.attributes?.FIRSTNAME || 'No name'})`);
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

testBrevoWithEnv(); 