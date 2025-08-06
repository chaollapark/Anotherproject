#!/usr/bin/env tsx

/**
 * Test to get all lists and find the correct one
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

async function testLists() {
  console.log('🔍 Testing Brevo Lists...');
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
    const listsApiInstance = new Brevo.ListsApi();
    listsApiInstance.setApiKey(Brevo.ListsApiApiKeys.apiKey, apiKey);
    
    console.log('\n📋 Getting all lists...');
    
    // Get all lists
    const lists = await listsApiInstance.getLists();
    console.log('✅ Lists retrieved successfully');
    console.log(`   Total lists: ${lists.count}`);
    
    if (lists.lists && lists.lists.length > 0) {
      console.log('\n📋 Available lists:');
      lists.lists.forEach((list: any) => {
        console.log(`   - ID: ${list.id}, Name: "${list.name}", Contacts: ${list.contactsCount}`);
      });
      
      // Check if our target list exists
      const targetListId = parseInt(envVars.BREVO_NEWSLETTER_LIST_ID || '0');
      const targetList = lists.lists.find((list: any) => list.id === targetListId);
      
      if (targetList) {
        console.log(`\n✅ Found target list: "${targetList.name}" (ID: ${targetList.id})`);
        console.log(`   Contacts in list: ${targetList.contactsCount}`);
        
        // Try to get contacts from this list
        console.log('\n👥 Trying to get contacts from target list...');
        const contactsApiInstance = new Brevo.ContactsApi();
        contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
        
        try {
          const contactsResponse = await contactsApiInstance.getContactsFromList(targetListId, {
            limit: 10,
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
          console.log('❌ Error getting contacts:', error.message);
          if (error.response?.data) {
            console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
          }
        }
        
      } else {
        console.log(`\n❌ Target list ID ${targetListId} not found!`);
        console.log('Please update BREVO_NEWSLETTER_LIST_ID in your .env file with one of the available list IDs above.');
      }
      
    } else {
      console.log('⚠️  No lists found in your Brevo account');
    }
    
  } catch (error: any) {
    console.log('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testLists(); 