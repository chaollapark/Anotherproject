import { SubscriberModel } from '@/models/Subscriber';
import { fetchJobs } from '@/models/Job';
import { render } from '@react-email/render';
import { NewsletterEmail } from '@/emails/NewsletterEmail';
import * as Brevo from '@getbrevo/brevo';

export async function sendNewsletter() {
  console.log('Starting newsletter process...');

  // 1. Fetch subscribers
  const subscribers = await SubscriberModel.find({ isSubscribed: true });
  if (subscribers.length === 0) {
    console.log('No subscribers to send to.');
    return;
  }
  console.log(`Found ${subscribers.length} subscribers.`);

  // 2. Fetch jobs (prioritizing premium)
  const jobs = await fetchJobs(20); // Fetch top 20 jobs
  if (jobs.length === 0) {
    console.log('No jobs to send in the newsletter.');
    return;
  }
  console.log(`Found ${jobs.length} jobs to feature.`);

  // 3. Configure Brevo API
  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY as string
  );

  // 4. Render the email template
  const emailHtml = render(<NewsletterEmail jobs={jobs} />);

  // 5. Create and send the email campaign
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = 'Your Weekly EU Job Digest';
  sendSmtpEmail.htmlContent = emailHtml;
  sendSmtpEmail.sender = { name: 'Madan', email: 'noreply@eujobs.online' }; // Replace with your desired sender
  sendSmtpEmail.to = subscribers.map(sub => ({ email: sub.email }));

  try {
    console.log('Sending email to all subscribers...');
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Successfully sent newsletter:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error };
  }
}
