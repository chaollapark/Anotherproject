import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        jobId: session.metadata?.jobId,
        plan: session.metadata?.plan,
      });
    } else {
      return NextResponse.json({ error: 'Payment not completed' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } });
  }
}
