
import { JobModel, Job } from '@/models/Job';
import dbConnect from '@/lib/dbConnect';
import { sendEmail } from '@/lib/sendEmail';
import * as Brevo from '@getbrevo/brevo';

// Brevo API setup
const apiKey = (process.env.BREVO_API_KEY || '').replace(/["']/g, '').trim();
const apiInstance = new Brevo.ContactsApi();
apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, apiKey);

function formatJobsToHtml(jobs: Job[]): string {
  if (jobs.length === 0) {
    return '<p>No new jobs posted today. Check back tomorrow!</p>';
  }

  const jobListings = jobs
    .map(
      (job) => `
    <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
      <h3 style="margin: 0 0 10px 0;">
        <a href="https://www.eujobs.online/jobs/${job.slug}" style="color: #007bff; text-decoration: none;">
          ${job.title} at ${job.companyName}
        </a>
      </h3>
      <p style="margin: 0 0 10px 0; color: #555;">
        <strong>Location:</strong> ${job.city || 'Not specified'} | <strong>Seniority:</strong> ${job.seniority}
      </p>
      <a href="https://www.eujobs.online/jobs/${job.slug}" style="background-color: #007bff; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View & Apply
      </a>
    </div>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #007bff;">Here are the latest EU jobs</h1>
      <p>The first applicant is 13x more likely to get the job.</p>
      <p>try our cover letter generator - it's free<p>
      ${jobListings}
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        You are receiving this email because you subscribed to the EUJobs.online newsletter. You can unsubscribe at any time.
      </p>
    </div>
  `;
}

export async function sendDailyJobNewsletter() {
  await dbConnect();

  // 1. Fetch jobs from the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentJobs = await JobModel.find({ 
    createdAt: { $gte: twentyFourHoursAgo },
    plan: { $nin: ['pending'] } // Exclude jobs that are not yet active
  }).sort({ createdAt: -1 });

  if (recentJobs.length === 0) {
    console.log('No new jobs in the last 24 hours. Newsletter not sent.');
    return { success: true, message: 'No new jobs to send.' };
  }

  // 2. Fetch contacts from Brevo
  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);
  if (!listId) {
    throw new Error('BREVO_NEWSLETTER_LIST_ID is not defined.');
  }

  const contacts = await apiInstance.getContactsFromList(listId, undefined, 50, 0);
  
  if (!contacts.body.contacts || contacts.body.contacts.length === 0) {
    console.log('No contacts found in the Brevo list.');
    return { success: true, message: 'No contacts to send to.' };
  }

  // 3. Format email and send
  const emailHtml = formatJobsToHtml(recentJobs);
  const subject = 'Your Daily Digest of EU Jobs';

  for (const contact of contacts.body.contacts) {
    if (contact.email) {
      try {
        await sendEmail(contact.email, subject, emailHtml);
        console.log(`Newsletter sent to ${contact.email}`);
      } catch (error) {
        console.error(`Failed to send newsletter to ${contact.email}:`, error);
      }
    }
  }

  return { success: true, message: `Newsletter sent to ${contacts.body.contacts.length} contacts.` };
}
