#!/usr/bin/env tsx

/**
 * Test to get list information and verify access
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

async function testListInfo() {
  console.log('🔍 Testing List Information...');
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
    
    // Try to get list information
    console.log('\n📋 Getting list information...');
    
    try {
      // Try using ListsApi if available
      const listsApiInstance = new Brevo.ListsApi();
      listsApiInstance.setApiKey(Brevo.ListsApiApiKeys.apiKey, apiKey);
      
      const listId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
      console.log(`\n📋 Getting details for list ID ${listId}...`);
      
      const listInfo = await listsApiInstance.getList(listId);
      console.log('✅ List information retrieved:');
      console.log(`   Name: ${listInfo.name}`);
      console.log(`   ID: ${listInfo.id}`);
      console.log(`   Contacts: ${listInfo.contactsCount}`);
      console.log(`   Created: ${listInfo.createdAt}`);
      
    } catch (error: any) {
      console.log('❌ Failed to get list info:', error.message);
      if (error.response?.data) {
        console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Try to get all lists to see what's available
    console.log('\n📋 Getting all available lists...');
    try {
      const listsApiInstance = new Brevo.ListsApi();
      listsApiInstance.setApiKey(Brevo.ListsApiApiKeys.apiKey, apiKey);
      
      const allLists = await listsApiInstance.getLists();
      console.log('✅ Available lists:');
      allLists.lists?.forEach((list: any) => {
        console.log(`   - ID: ${list.id}, Name: "${list.name}", Contacts: ${list.contactsCount}`);
      });
      
    } catch (error: any) {
      console.log('❌ Failed to get all lists:', error.message);
    }
    
    // Try to get contacts using a different approach
    console.log('\n👥 Trying to get contacts using different approach...');
    try {
      const contactsApiInstance = new Brevo.ContactsApi();
      contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
      
      // Try getting all contacts first
      const allContacts = await contactsApiInstance.getContacts();
      console.log('✅ All contacts retrieved:');
      console.log(`   Total contacts in account: ${allContacts.contacts?.length || 0}`);
      
      if (allContacts.contacts && allContacts.contacts.length > 0) {
        console.log('   Sample contacts:');
        allContacts.contacts.slice(0, 3).forEach((contact: any) => {
          console.log(`     - ${contact.email}`);
        });
      }
      
    } catch (error: any) {
      console.log('❌ Failed to get all contacts:', error.message);
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testListInfo(); 