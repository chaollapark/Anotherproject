import { Job } from '@/models/Job';

export function dailyJobsEmailTemplate(jobs: Job[], subscriberEmail: string) {
  const jobsHtml = jobs.map(job => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: #ffffff;">
      <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 18px;">
        <a href="https://eujobs.co/jobs/${job.slug}" style="color: #2563eb; text-decoration: none;">
          ${job.title}
        </a>
      </h3>
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
        <strong>${job.companyName}</strong>
        ${job.city && job.country ? ` • ${job.city}, ${job.country}` : ''}
        ${job.salary ? ` • €${job.salary.toLocaleString()}` : ''}
      </p>
      <p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">
        ${job.description.length > 200 ? job.description.substring(0, 200) + '...' : job.description}
      </p>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="background-color: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${job.type || 'Full-time'}
        </span>
        <span style="background-color: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
          ${job.seniority}
        </span>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Latest EU Jobs - Apply First, Get Hired Faster!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
            🚀 Latest EU Jobs
          </h1>
          <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">
            Apply first, get hired faster!
          </p>
        </div>

        <!-- Hero Section -->
        <div style="padding: 32px 24px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
          <h2 style="margin: 0 0 16px 0; color: #92400e; font-size: 20px;">
            ⚡ The First Applicants Have a 13x Better Chance!
          </h2>
          <p style="margin: 0 0 16px 0; color: #92400e; font-size: 16px; line-height: 1.5;">
            Research shows that the first 10 applicants to a job posting have a 13x higher chance of getting hired. 
            Don't wait - apply now and beat the competition!
          </p>
          <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px;">
              ✨ Try Our CV Writing Tool - Apply Faster!
            </h3>
            <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px;">
              Create a professional CV in minutes and apply to these jobs faster than your competition.
            </p>
            <a href="https://eujobs.co/fairpay" 
               style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Create Your CV Now - Free!
            </a>
          </div>
        </div>

        <!-- Jobs Section -->
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px; text-align: center;">
            Today's Latest Opportunities
          </h2>
          ${jobsHtml}
        </div>

        <!-- CTA Section -->
        <div style="padding: 32px 24px; background-color: #f8fafc; text-align: center;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">
            Ready to Apply?
          </h3>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px;">
            Don't let these opportunities slip away. Apply now and increase your chances!
          </p>
          <a href="https://eujobs.co/all-jobs" 
             style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            View All Jobs
          </a>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; background-color: #1f2937; color: #9ca3af; text-align: center; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">
            You're receiving this email because you subscribed to EUJobs daily updates.
          </p>
          <p style="margin: 0 0 16px 0;">
            <a href="https://eujobs.co/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" 
               style="color: #60a5fa; text-decoration: none;">
              Unsubscribe
            </a>
          </p>
          <p style="margin: 0; font-size: 12px;">
            © 2024 EUJobs.co - Your gateway to European Union opportunities
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
} 