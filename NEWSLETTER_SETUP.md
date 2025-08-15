# Newsletter Setup Guide

## Overview
The newsletter signup feature integrates with Brevo (formerly Sendinblue) to manage email subscriptions. The newsletter popup appears after 3 seconds on the website and can be dismissed with an X button.

## Environment Variables Required

Add these to your `.env` file:

```env
# Brevo API Key (already configured for email sending)
BREVO_API_KEY=your_brevo_api_key_here

# Brevo List ID for newsletter subscribers
BREVO_NEWSLETTER_LIST_ID=your_list_id_here
```

## Setting up Brevo List

1. **Create a Contact List in Brevo:**
   - Log into your Brevo account
   - Go to Contacts → Lists
   - Click "Create a new list"
   - Name it "Newsletter Subscribers" or similar
   - Copy the List ID (you'll find it in the list URL or list settings)

2. **Configure the List ID:**
   - Add the List ID to your `.env` file as `BREVO_NEWSLETTER_LIST_ID`

## Features

- **Auto-appear:** Newsletter signup appears after 3 seconds
- **Dismissible:** Users can close it with the X button
- **Persistent dismissal:** Uses localStorage to remember if user dismissed it
- **Form validation:** Validates email format
- **Error handling:** Shows appropriate error messages
- **Success feedback:** Confirms successful subscription
- **Auto-close:** Closes automatically after successful signup

## Component Location

- **Component:** `src/app/components/NewsletterSignup.tsx`
- **API Route:** `src/app/api/newsletter/signup/route.ts`
- **Integration:** Added to `src/app/layout.tsx`

## Styling

The newsletter signup matches the website's design:
- Uses Tailwind CSS classes consistent with the site
- Blue color scheme matching the site's branding
- Responsive design that works on mobile and desktop
- Positioned in bottom-right corner with proper z-index

## Testing

To test the newsletter signup:

1. Ensure your environment variables are set
2. Start the development server
3. Visit any page on the site
4. Wait 3 seconds for the newsletter to appear
5. Try subscribing with a valid email
6. Check your Brevo contacts list for the new subscriber

## Troubleshooting

- **"Newsletter service not configured"**: Check that `BREVO_NEWSLETTER_LIST_ID` is set
- **"Contact already exists"**: User is already subscribed (this is handled gracefully)
- **API errors**: Check your Brevo API key and list ID
- **Component not appearing**: Check browser console for errors, ensure localStorage is available
