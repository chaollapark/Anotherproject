import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const { jobId, plan } = await req.json();
    console.log("Job ID:", jobId);
    console.log("Plan:", plan);
    
    // Define prices for each plan
    const prices = {
      basic: 9999, 
      pro: 19999, 
      recruiter: 99999, 
    };

    if (!prices[plan as keyof typeof prices]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Job Posting - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            unit_amount: prices[plan as keyof typeof prices],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/job-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/job-cancel`,
      metadata: {
        jobId: jobId,
        plan: plan,
      },
    });

    console.log("Stripe session created:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
