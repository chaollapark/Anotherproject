import { SubscriberModel } from '@/models/Subscriber';
import { fetchJobs } from '@/models/Job';
import { render } from '@react-email/render';
import { NewsletterEmail } from '@/emails/NewsletterEmail';
import * as Brevo from '@getbrevo/brevo';

export async function sendNewsletter() {
  console.log('Starting newsletter process for eujobs.co...');

  const subscribers = await SubscriberModel.find({ isSubscribed: true });
  if (subscribers.length === 0) {
    console.log('No subscribers to send to.');
    return;
  }

  const jobs = await fetchJobs(20);
  if (jobs.length === 0) {
    console.log('No jobs to send in the newsletter.');
    return;
  }

  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY as string
  );

  const emailHtml = render(<NewsletterEmail jobs={jobs} />);

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = 'Your Weekly EU Job Digest from eujobs.co';
  sendSmtpEmail.htmlContent = emailHtml;
  sendSmtpEmail.sender = { name: 'eujobs.co', email: 'newsletter@eujobs.online' };
  sendSmtpEmail.to = subscribers.map(sub => ({ email: sub.email }));

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Successfully sent newsletter:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error };
  }
}
