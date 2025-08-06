import { sendEmail } from './sendEmail';
import { fetchJobs } from '@/models/Job';
import { dailyJobsEmailTemplate } from '@/emails/dailyJobsEmailTemplate';
import * as Brevo from '@getbrevo/brevo';

export interface DailyEmailStats {
  totalSubscribers: number;
  emailsSent: number;
  emailsFailed: number;
  errors: string[];
}

// Initialize Brevo API for contacts
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
const contactsApiInstance = new Brevo.ContactsApi();
contactsApiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

// Get newsletter list ID from environment
const NEWSLETTER_LIST_ID = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0');

export async function sendDailyJobEmails(): Promise<DailyEmailStats> {
  const stats: DailyEmailStats = {
    totalSubscribers: 0,
    emailsSent: 0,
    emailsFailed: 0,
    errors: []
  };

  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    // Get contacts from Brevo newsletter list
    console.log(`Fetching contacts from Brevo list ID: ${NEWSLETTER_LIST_ID}`);
    
    const contactsResponse = await contactsApiInstance.getContactsFromList(NEWSLETTER_LIST_ID);

    const contacts = contactsResponse.body.contacts || [];
    stats.totalSubscribers = contacts.length;

    if (contacts.length === 0) {
      console.log('No contacts found in newsletter list');
      return stats;
    }

    // Fetch latest jobs (last 24 hours, limit to 10)
    const latestJobs = await fetchJobs(10);
    
    if (latestJobs.length === 0) {
      console.log('No recent jobs found for daily email');
      return stats;
    }

    console.log(`Sending daily emails to ${contacts.length} contacts with ${latestJobs.length} jobs`);

    // Send emails to each contact
    const emailPromises = contacts.map(async (contact) => {
      try {
        const emailHtml = dailyJobsEmailTemplate(latestJobs, contact.email || '');
        
        await sendEmail(
          contact.email || '',
          '🚀 Latest EU Jobs - Apply First, Get Hired Faster!',
          emailHtml
        );

        stats.emailsSent++;
        console.log(`✅ Email sent to ${contact.email}`);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        stats.emailsFailed++;
        const errorMsg = `Failed to send email to ${contact.email}: ${error}`;
        stats.errors.push(errorMsg);
        console.error(errorMsg);
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    console.log(`Daily email campaign completed:`, stats);
    return stats;

  } catch (error) {
    const errorMsg = `Daily email service error: ${error}`;
    stats.errors.push(errorMsg);
    console.error(errorMsg);
    return stats;
  }
}

// Function to add a new contact to the newsletter list
export async function addSubscriber(email: string, preferences?: {
  jobTypes?: string[];
  locations?: string[];
  seniority?: string[];
}) {
  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    // Create contact attributes
    const attributes: any = {
      EMAIL: email,
      SUBSCRIBED_AT: new Date().toISOString()
    };

    // Add preferences as attributes if provided
    if (preferences) {
      if (preferences.jobTypes) {
        attributes.JOB_TYPES = preferences.jobTypes.join(',');
      }
      if (preferences.locations) {
        attributes.LOCATIONS = preferences.locations.join(',');
      }
      if (preferences.seniority) {
        attributes.SENIORITY = preferences.seniority.join(',');
      }
    }

    // Create contact
    const createContact = new Brevo.CreateContact();
    createContact.email = email.toLowerCase().trim();
    createContact.attributes = attributes;
    createContact.listIds = [NEWSLETTER_LIST_ID];

    await contactsApiInstance.createContact(createContact);
    console.log(`New subscriber added to Brevo list: ${email}`);
    
    return { email, success: true };
  } catch (error: any) {
    if (error.code === 'duplicate_parameter') {
      console.log(`Contact already exists in list: ${email}`);
      return { email, success: true, alreadyExists: true };
    }
    throw error;
  }
}

// Function to unsubscribe (remove from list)
export async function unsubscribe(email: string) {
  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    // Remove contact from list
    await contactsApiInstance.removeContactFromList(NEWSLETTER_LIST_ID, {
      emails: [email.toLowerCase().trim()]
    });
    
    console.log(`Subscriber removed from Brevo list: ${email}`);
    return true;
  } catch (error) {
    console.error(`Error unsubscribing ${email}:`, error);
    return false;
  }
}

// Function to get subscriber count
export async function getSubscriberCount(): Promise<number> {
  try {
    if (!NEWSLETTER_LIST_ID) {
      throw new Error('BREVO_NEWSLETTER_LIST_ID environment variable is required');
    }

    const contactsResponse = await contactsApiInstance.getContactsFromList(NEWSLETTER_LIST_ID);

    // Get total count from response
    return contactsResponse.body.contacts?.length || 0;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
} 