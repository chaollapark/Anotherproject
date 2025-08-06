# Daily Email System for EUJobs

This system sends daily job alerts to subscribers using Brevo (formerly Sendinblue) with the latest job opportunities from EUJobs.

## Features

- ✅ Daily email campaigns with latest jobs
- ✅ Beautiful HTML email templates
- ✅ Uses existing Brevo newsletter list
- ✅ "First applicants have 13x better chance" messaging
- ✅ CV writing tool promotion
- ✅ Rate limiting and error handling
- ✅ Comprehensive logging and statistics

## Setup

### 1. Environment Variables

Make sure you have these environment variables set:

```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_NEWSLETTER_LIST_ID=your_newsletter_list_id_here
EMAIL_FROM=noreply@eujobs.online
```

### 2. Brevo Newsletter List

The system uses your existing Brevo newsletter list. Make sure:
- Your newsletter list ID is set in `BREVO_NEWSLETTER_LIST_ID`
- The list contains contacts who want daily job alerts
- Your Brevo API key has permissions to read contacts and send emails

## Usage

### Manual Testing

1. **Test the API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/daily-emails \
     -H "Content-Type: application/json" \
     -d '{"action": "send_daily_emails"}'
   ```

2. **Add a test subscriber to your Brevo list:**
   ```bash
   curl -X POST http://localhost:3000/api/daily-emails \
     -H "Content-Type: application/json" \
     -d '{"action": "add_subscriber", "email": "test@example.com"}'
   ```

3. **Get subscriber count:**
   ```bash
   curl http://localhost:3000/api/daily-emails?action=get_subscriber_count
   ```

### Automated Daily Sending

#### Option 1: Cron Job (Recommended)

Add this to your crontab:

```bash
# Send daily emails at 9 AM every day
0 9 * * * /usr/bin/node /path/to/your/project/scripts/send-daily-emails.js
```

#### Option 2: Vercel Cron Jobs

Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/daily-emails?action=send_daily_emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

#### Option 3: External Cron Service

Use services like:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [SetCronJob](https://www.setcronjob.com)

Set the URL to: `https://yourdomain.com/api/daily-emails?action=send_daily_emails`

## Components

### Email Template (`src/emails/dailyJobsEmailTemplate.ts`)

Creates beautiful HTML emails with:
- Latest job listings
- "13x better chance" messaging
- CV writing tool promotion
- Unsubscribe links

### Email Service (`src/lib/dailyEmailService.ts`)

Handles:
- Fetching contacts from Brevo newsletter list
- Sending emails to all contacts
- Adding/removing contacts from list
- Error handling and statistics

### API Routes (`src/app/api/daily-emails/route.ts`)

Provides endpoints for:
- `POST /api/daily-emails` - Add subscribers, unsubscribe, send emails
- `GET /api/daily-emails?action=send_daily_emails` - Trigger daily emails

### React Components

- `EmailSubscription` - Subscription form component
- `UnsubscribePage` - Unsubscribe page

## Email Content

Each daily email includes:

1. **Header** - "Latest EU Jobs - Apply First, Get Hired Faster!"
2. **Hero Section** - "The First Applicants Have a 13x Better Chance!"
3. **CV Tool Promotion** - "Try Our CV Writing Tool - Apply Faster!"
4. **Job Listings** - Latest 10 jobs with details
5. **CTA** - "View All Jobs" button
6. **Footer** - Unsubscribe link and branding

## Brevo Integration

### Adding Subscribers

The system adds contacts to your existing Brevo newsletter list:

```javascript
import { addSubscriber } from '@/lib/dailyEmailService';

await addSubscriber('user@example.com', {
  jobTypes: ['full-time', 'part-time'],
  locations: ['Brussels', 'Luxembourg'],
  seniority: ['junior', 'mid-level']
});
```

### Unsubscribing

Removes contacts from the Brevo list:

```javascript
import { unsubscribe } from '@/lib/dailyEmailService';

await unsubscribe('user@example.com');
```

### Contact Attributes

The system stores additional information as contact attributes:
- `SUBSCRIBED_AT` - When they subscribed
- `JOB_TYPES` - Preferred job types (if provided)
- `LOCATIONS` - Preferred locations (if provided)
- `SENIORITY` - Preferred seniority levels (if provided)

## Monitoring

### Logs

The system logs:
- Number of contacts in list
- Emails sent/failed
- Error details
- Campaign statistics

### Statistics

Each email campaign returns:
```javascript
{
  totalSubscribers: 150,
  emailsSent: 148,
  emailsFailed: 2,
  errors: ["Failed to send to invalid@email.com"]
}
```

## Troubleshooting

### Common Issues

1. **Brevo API Key Issues**
   - Verify your API key is correct
   - Check if you have sufficient credits
   - Ensure sender email is verified

2. **Newsletter List Issues**
   - Verify `BREVO_NEWSLETTER_LIST_ID` is correct
   - Check if the list exists in your Brevo account
   - Ensure API key has permissions to access the list

3. **No Emails Sent**
   - Check if there are contacts in your newsletter list
   - Verify latest jobs exist
   - Check Brevo API permissions

4. **Rate Limiting**
   - System includes 100ms delays between emails
   - Brevo has rate limits (check your plan)

### Debug Mode

Add this to your environment:
```env
DEBUG_EMAILS=true
```

This will log detailed information about email sending.

## Security

- Email addresses are stored in Brevo (not in your database)
- Unsubscribe links include email verification
- Rate limiting prevents abuse
- Error messages don't expose sensitive data

## Performance

- Fetches latest 10 jobs only
- Processes emails in parallel with delays
- Uses Brevo's infrastructure for contact management
- Memory efficient for large contact lists

## Customization

### Email Template

Modify `src/emails/dailyJobsEmailTemplate.ts` to:
- Change styling
- Add more job details
- Modify messaging
- Include different CTAs

### Job Filtering

Modify `src/lib/dailyEmailService.ts` to:
- Filter by job type
- Filter by location
- Filter by salary range
- Use contact attributes for personalization

### Timing

Change the cron schedule to send at different times:
```bash
# Send at 8 AM instead of 9 AM
0 8 * * * /usr/bin/node /path/to/scripts/send-daily-emails.js

# Send twice daily
0 9,17 * * * /usr/bin/node /path/to/scripts/send-daily-emails.js
```

## Brevo Setup

### 1. Create a Newsletter List

1. Go to your Brevo dashboard
2. Navigate to Contacts → Lists
3. Create a new list for daily job alerts
4. Copy the list ID and add it to `BREVO_NEWSLETTER_LIST_ID`

### 2. API Permissions

Ensure your Brevo API key has permissions for:
- Reading contacts from lists
- Creating contacts
- Removing contacts from lists
- Sending transactional emails

### 3. Sender Verification

Make sure your sender email (`EMAIL_FROM`) is verified in Brevo.

## Support

For issues or questions:
1. Check the logs for error details
2. Verify environment variables
3. Test with a single contact first
4. Check Brevo dashboard for API usage and errors
5. Contact the development team 