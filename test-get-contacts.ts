#!/usr/bin/env tsx

/**
 * Test different methods to get contacts
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

async function testGetContacts() {
  console.log('🔍 Testing Different Contact Retrieval Methods...');
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
    
    // Method 1: Get all contacts first
    console.log('\n1. Getting all contacts in account...');
    try {
      const allContacts = await contactsApiInstance.getContacts();
      console.log('✅ All contacts retrieved');
      console.log(`   Total contacts in account: ${allContacts.body.contacts?.length || 0}`);
      
      if (allContacts.body.contacts && allContacts.body.contacts.length > 0) {
        console.log('   Sample contacts:');
        allContacts.body.contacts.slice(0, 3).forEach((contact: any) => {
          console.log(`     - ${contact.email} (Lists: ${contact.listIds?.join(', ') || 'none'})`);
        });
      }
    } catch (error: any) {
      console.log('❌ Failed to get all contacts:', error.message);
    }
    
    // Method 2: Get contacts from list (working method)
    console.log('\n2. Getting contacts from specific list...');
    try {
      const listContacts = await contactsApiInstance.getContactsFromList(listId);
      console.log('✅ List contacts retrieved');
      console.log(`   Total contacts in list ${listId}: ${listContacts.body.contacts?.length || 0}`);
      
      if (listContacts.body.contacts && listContacts.body.contacts.length > 0) {
        console.log('   Sample contacts:');
        listContacts.body.contacts.slice(0, 3).forEach((contact: any) => {
          console.log(`     - ${contact.email}`);
        });
      }
    } catch (error: any) {
      console.log('❌ Failed to get list contacts:', error.message);
    }
    
    // Method 3: Try to get a specific contact by email
    console.log('\n3. Trying to get specific contact by email...');
    try {
      const testEmail = 'test1@example.com';
      const specificContact = await contactsApiInstance.getContactInfo(testEmail);
      console.log('✅ Specific contact retrieved');
      console.log(`   Email: ${specificContact.body.email}`);
      console.log(`   Lists: ${specificContact.body.listIds?.join(', ') || 'none'}`);
    } catch (error: any) {
      console.log('❌ Failed to get specific contact:', error.message);
    }
    
    // Method 4: Try to get contacts with different list ID
    console.log('\n4. Trying with list ID 1...');
    try {
      const listContacts = await contactsApiInstance.getContactsFromList(1);
      console.log('✅ List 1 contacts retrieved');
      console.log(`   Total contacts in list 1: ${listContacts.body.contacts?.length || 0}`);
    } catch (error: any) {
      console.log('❌ Failed to get list 1 contacts:', error.message);
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGetContacts(); 