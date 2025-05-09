import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendEmail';
import { findJobBySlug } from '@/models/Job';

export async function POST(request: NextRequest) {
  try {
    const { email, slug } = await request.json();

    if (!email || !slug) {
      return NextResponse.json(
        { error: 'Email and job slug are required' },
        { status: 400 }
      );
    }

    // Find the job
    const job = await findJobBySlug(slug);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Create email content with job details
    const subject = `Job: ${job.title} at ${job.companyName}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Job Details</h2>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">${job.title}</h3>
          <p style="margin: 4px 0;"><strong>Company:</strong> ${job.companyName}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${job.city || 'Brussels'}, ${job.country || 'Belgium'}</p>
          <p style="margin: 4px 0;"><strong>Type:</strong> ${job.type}-time</p>
          <p style="margin: 4px 0;"><strong>Seniority:</strong> ${job.seniority}</p>
          ${job.salary ? `<p style="margin: 4px 0;"><strong>Salary:</strong> ${job.salary}</p>` : ''}
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Job Description</h3>
          ${job.description}
        </div>

        ${job.applyLink ? `
          <div style="margin-top: 24px; text-align: center;">
            <a href="${job.applyLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">Apply for this position</a>
          </div>
        ` : ''}

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://eujobs.co'}/jobs/${job.slug}" style="color: #3b82f6; text-decoration: none;">View on EUJobs.co</a>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 24px; text-align: center;">
          This email was sent because you requested it from EUJobs.co
        </p>
      </div>
    `;

    // Send the email using SendGrid
    const response = await sendEmail(email, subject, message);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending job via email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
