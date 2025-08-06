
import { NextResponse } from 'next/server';
import { sendDailyJobNewsletter } from '@/lib/newsletter';

export async function GET(request: Request) {
  // Secure the endpoint with a secret key
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await sendDailyJobNewsletter();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
