#!/usr/bin/env tsx

/**
 * Test to fix the API call issue
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

async function testFixAPI() {
  console.log('🔧 Testing API Fix...');
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
    console.log(`\n👥 Testing with list ID ${listId}...`);
    
    // Try different approaches to get contacts
    console.log('\n1. Trying with explicit empty options...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {});
      console.log('✅ Success with empty options!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with empty options:', error.message);
    }
    
    console.log('\n2. Trying with null options...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, null as any);
      console.log('✅ Success with null options!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with null options:', error.message);
    }
    
    console.log('\n3. Trying with undefined options...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, undefined as any);
      console.log('✅ Success with undefined options!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with undefined options:', error.message);
    }
    
    console.log('\n4. Trying with explicit limit only...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
        limit: 50
      });
      console.log('✅ Success with limit only!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with limit only:', error.message);
    }
    
    console.log('\n5. Trying with explicit offset only...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
        offset: 0
      });
      console.log('✅ Success with offset only!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with offset only:', error.message);
    }
    
    console.log('\n6. Trying with both limit and offset...');
    try {
      const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
        limit: 50,
        offset: 0
      });
      console.log('✅ Success with both limit and offset!');
      console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed with both limit and offset:', error.message);
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFixAPI(); 