#!/usr/bin/env tsx

/**
 * Test getting contacts without parameters
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

async function testSimpleContacts() {
  console.log('🔍 Testing Simple Contacts API...');
  console.log('================================');
  
  // Load environment variables
  const envVars = loadEnvFile();
  
  if (!envVars.BREVO_API_KEY) {
    console.log('\n❌ BREVO_API_KEY not found in .env file!');
    return;
  }
  
  try {
    // Initialize Brevo API
    const apiKey = envVars.BREVO_API_KEY.replace(/["']/g, '').trim();
    const contactsApiInstance = new Brevo.ContactsApi();
    contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    const listId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
    console.log(`\n👥 Testing getContactsFromList with list ID ${listId}...`);
    
    // Try without any parameters first
    console.log('   Trying without parameters...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId);
      console.log('✅ Success! Contacts retrieved without parameters');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed without parameters:', error.message);
    }
    
    // Try with minimal parameters
    console.log('\n   Trying with minimal parameters...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
        limit: 10
      });
      console.log('✅ Success! Contacts retrieved with minimal parameters');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with minimal parameters:', error.message);
    }
    
    // Try with different list ID (maybe the issue is with list ID 7)
    console.log('\n   Trying with list ID 1...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(1, {
        limit: 10
      });
      console.log('✅ Success! Contacts retrieved from list ID 1');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with list ID 1:', error.message);
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSimpleContacts(); 