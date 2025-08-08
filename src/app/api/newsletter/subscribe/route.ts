import { NextRequest, NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import { sendEmail } from '@/lib/sendEmail';
import { newsletterConfirmationTemplate } from '@/emails/newsletterConfirmationTemplate';

// Brevo API setup
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
const apiInstance = new Brevo.ContactsApi();
apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);
    if (!listId) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID is not defined.');
    }

    const createContact = new Brevo.CreateContact();
    createContact.email = email;
    createContact.listIds = [listId];

    await apiInstance.createContact(createContact);

    // Send confirmation email
    try {
      const subject = 'Welcome to EUJobs.co Newsletter!';
      const message = newsletterConfirmationTemplate(email);
      await sendEmail(email, subject, message);
      console.log('✅ Newsletter confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Please check your email for confirmation.'
    });

  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    
    // Brevo might return a 400 if the contact already exists
    if (error.response?.body?.code === 'duplicate_parameter') {
      return NextResponse.json({
        success: false,
        message: 'You are already subscribed to our newsletter! Check your email for our latest updates.'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'An error occurred. Please try again later.'
    }, { status: 500 });
  }
} 