#!/usr/bin/env tsx

/**
 * Debug Brevo API Connection
 * 
 * This script tests the Brevo API connection and provides detailed error information.
 */

import * as Brevo from '@getbrevo/brevo';

async function debugBrevoConnection() {
  console.log('🔍 Debugging Brevo API Connection...');
  console.log('================================');
  
  // Check environment variables
  console.log('\n📋 Environment Variables:');
  console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`BREVO_NEWSLETTER_LIST_ID: ${process.env.BREVO_NEWSLETTER_LIST_ID || '❌ Not set'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ Not set'}`);
  
  if (!process.env.BREVO_API_KEY) {
    console.log('\n❌ BREVO_API_KEY is not set!');
    return;
  }
  
  try {
    // Initialize Brevo API
    const apiKey = process.env.BREVO_API_KEY.replace(/["']/g, '').trim();
    const contactsApiInstance = new Brevo.ContactsApi();
    contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    console.log('\n🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    
    // Test 1: Get account information
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
      if (error.response?.data) {
        console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 2: Get all lists
    console.log('\n📋 Test 2: Getting all lists...');
    try {
      const listsApiInstance = new Brevo.ListsApi();
      listsApiInstance.setApiKey(Brevo.ListsApiApiKeys.apiKey, apiKey);
      const lists = await listsApiInstance.getLists();
      console.log('✅ Lists retrieved successfully');
      console.log(`   Total lists: ${lists.count}`);
      if (lists.lists && lists.lists.length > 0) {
        console.log('   Available lists:');
        lists.lists.forEach((list: any) => {
          console.log(`     - ID: ${list.id}, Name: ${list.name}, Contacts: ${list.contactsCount}`);
        });
      }
    } catch (error: any) {
      console.log('❌ Failed to get lists:', error.message);
      if (error.response?.data) {
        console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 3: Try to get contacts from specific list
    const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0');
    if (listId > 0) {
      console.log(`\n👥 Test 3: Getting contacts from list ID ${listId}...`);
      try {
        const contactsResponse = await contactsApiInstance.getContactsFromList(listId, {
          limit: 10,
          offset: 0
        });
        console.log('✅ Contacts retrieved successfully');
        console.log(`   Total contacts: ${contactsResponse.contacts?.length || 0}`);
        if (contactsResponse.contacts && contactsResponse.contacts.length > 0) {
          console.log('   Sample contacts:');
          contactsResponse.contacts.slice(0, 3).forEach((contact: any) => {
            console.log(`     - ${contact.email} (${contact.attributes?.FIRSTNAME || 'No name'})`);
          });
        }
      } catch (error: any) {
        console.log('❌ Failed to get contacts from list:', error.message);
        if (error.response?.data) {
          console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.response?.status) {
          console.log('   Status code:', error.response.status);
        }
      }
    }
    
  } catch (error: any) {
    console.error('\n💥 Fatal error:', error);
  }
}

debugBrevoConnection(); 