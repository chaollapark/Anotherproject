#!/usr/bin/env tsx

/**
 * Test API permissions and different approaches
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

async function testApiPermissions() {
  console.log('🔍 Testing API Permissions...');
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
    console.log(`\n🔑 API Key (first 10 chars): ${apiKey.substring(0, 10)}...`);
    
    // Test 1: Try to get account information
    console.log('\n📊 Test 1: Getting account information...');
    try {
      const accountApiInstance = new Brevo.AccountApi();
      accountApiInstance.setApiKey(Brevo.AccountApiApiKeys.apiKey, apiKey);
      const accountInfo = await accountApiInstance.getAccount();
      console.log('✅ Account info retrieved successfully');
      console.log(`   Account name: ${accountInfo.name}`);
      console.log(`   Email: ${accountInfo.email}`);
    } catch (error: any) {
      console.log('❌ Failed to get account info:', error.message);
    }
    
    // Test 2: Try to create a contact (write permission)
    console.log('\n📝 Test 2: Testing write permission (create contact)...');
    try {
      const contactsApiInstance = new Brevo.ContactsApi();
      contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
      
      const testContact = {
        email: 'test-permission@example.com',
        attributes: {
          FIRSTNAME: 'Test',
          LASTNAME: 'Permission'
        }
      };
      
      const createdContact = await contactsApiInstance.createContact(testContact);
      console.log('✅ Write permission works - contact created successfully');
      console.log(`   Contact ID: ${createdContact.id}`);
      
      // Clean up - delete the test contact
      try {
        await contactsApiInstance.deleteContact(createdContact.id);
        console.log('   ✅ Test contact cleaned up');
      } catch (cleanupError: any) {
        console.log('   ⚠️  Could not clean up test contact:', cleanupError.message);
      }
      
    } catch (error: any) {
      console.log('❌ Write permission failed:', error.message);
    }
    
    // Test 3: Try to get contacts (read permission)
    console.log('\n👥 Test 3: Testing read permission (get contacts)...');
    try {
      const contactsApiInstance = new Brevo.ContactsApi();
      contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
      
      const allContacts = await contactsApiInstance.getContacts();
      console.log('✅ Read permission works - contacts retrieved');
      console.log(`   Total contacts: ${allContacts.contacts?.length || 0}`);
      
    } catch (error: any) {
      console.log('❌ Read permission failed:', error.message);
      console.log('   This suggests the API key has write-only permissions');
    }
    
    // Test 4: Try to get contacts from specific list
    console.log('\n📋 Test 4: Testing list-specific read permission...');
    try {
      const contactsApiInstance = new Brevo.ContactsApi();
      contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
      
      const listId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
      const listContacts = await contactsApiInstance.getContactsFromList(listId);
      console.log('✅ List read permission works');
      console.log(`   Contacts in list ${listId}: ${listContacts.contacts?.length || 0}`);
      
    } catch (error: any) {
      console.log('❌ List read permission failed:', error.message);
      console.log('   This suggests the API key cannot read from this specific list');
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testApiPermissions(); 