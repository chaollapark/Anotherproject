import { NextResponse } from 'next/server';
import { sendNewsletter } from '@/lib/newsletter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.NEWSLETTER_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendNewsletter();
    if (result?.success) {
      return NextResponse.json({ message: 'Newsletter sent successfully.' });
    } else {
      throw new Error(result?.error?.toString() || 'Unknown error');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send newsletter';
    return NextResponse.json({ message: 'Error sending newsletter', error: errorMessage }, { status: 500 });
  }
}
