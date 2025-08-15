import { NextRequest, NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Brevo client
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
const apiInstance = new Brevo.ContactsApi();
apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get the list ID from environment variable
    const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0');
    if (!listId) {
      console.error('BREVO_NEWSLETTER_LIST_ID not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Create contact data
    const createContact = new Brevo.CreateContact();
    createContact.email = email;
    createContact.listIds = [listId];
    createContact.updateEnabled = true; // Allow updating existing contacts

    // Add to Brevo list
    const response = await apiInstance.createContact(createContact);

    console.log('✅ Newsletter signup successful:', email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Newsletter signup error:', error);

    // Handle specific Brevo errors
    if (error.code === 400 && error.message?.includes('Contact already exists')) {
      return NextResponse.json(
        { error: 'You are already subscribed to our newsletter' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
