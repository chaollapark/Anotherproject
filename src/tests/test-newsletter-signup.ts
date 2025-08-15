/**
 * Test script for the newsletter signup feature using Brevo
 * Run with: pnpm tsx src/tests/test-newsletter-signup.ts
 */

import * as Brevo from '@getbrevo/brevo';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const TEST_EMAIL = 'test@example.com'; // Replace with your test email

async function testNewsletterSignup() {
  console.log('🧪 Testing Newsletter Signup with Brevo...');
  
  try {
    // Initialize Brevo client
    const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
    const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0');
    
    if (!apiKey) {
      throw new Error('BREVO_API_KEY not found in environment variables');
    }
    
    if (!listId) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID not found in environment variables');
    }
    
    console.log('✅ API Key and List ID configured');
    console.log(`📋 List ID: ${listId}`);
    
    const apiInstance = new Brevo.ContactsApi();
    apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);
    
    // Create contact data
    const createContact = new Brevo.CreateContact();
    createContact.email = TEST_EMAIL;
    createContact.listIds = [listId];
    createContact.updateEnabled = true;
    
    console.log(`📨 Attempting to add ${TEST_EMAIL} to list ${listId}`);
    
    // Add to Brevo list
    const response = await apiInstance.createContact(createContact);
    
    console.log('✅ Newsletter signup test successful!');
    console.log('📊 Response:', response);
    
  } catch (error: any) {
    console.error('❌ Newsletter signup test failed:', error);
    
    if (error.code === 400 && error.message?.includes('Contact already exists')) {
      console.log('ℹ️ Contact already exists (this is expected for repeated tests)');
    } else {
      console.error('Error details:', error.message || error);
    }
  }
}

// Run the test
testNewsletterSignup();
