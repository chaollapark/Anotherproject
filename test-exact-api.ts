#!/usr/bin/env tsx

/**
 * Test exact API call that works with your list
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

async function testExactAPI() {
  console.log('🔍 Testing Exact API Call...');
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
    console.log(`\n👥 Testing with list ID ${listId} (should have 136 contacts)...`);
    
    // Try different API call variations
    console.log('\n1. Trying getContactsFromList without parameters...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId);
      console.log('✅ Success!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
      if (contactsResponse.contacts && contactsResponse.contacts.length > 0) {
        console.log('   Sample contacts:');
        contactsResponse.contacts.slice(0, 3).forEach((contact: any) => {
          console.log(`     - ${contact.email}`);
        });
      }
    } catch (error: any) {
      console.log('❌ Failed:', error.message);
    }
    
    console.log('\n2. Trying getContactsFromList with string ID...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId.toString());
      console.log('✅ Success!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed:', error.message);
    }
    
    console.log('\n3. Trying getContactsFromList with minimal options...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {});
      console.log('✅ Success!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed:', error.message);
    }
    
    console.log('\n4. Trying getContactsFromList with limit only...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
        limit: 50
      });
      console.log('✅ Success!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed:', error.message);
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testExactAPI(); 