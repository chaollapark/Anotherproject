import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const { jobId, plan, price } = await req.json(); 
    console.log("Job ID:", jobId);
    console.log("Plan:", plan);
    console.log("Price (with discount if applicable):", price);

    // Define fixed default prices (in cents)
    const defaultPrices = {
      basic: 9999, // €99.99
      pro: 20000, // €200
      recruiter: 50000, // €500
    };

    // Validate plan
    if (!defaultPrices[plan as keyof typeof defaultPrices]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Ensure price is a valid number
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
    }

    // Use the lower price (discounted if valid, otherwise default price)
    const finalPrice =
      parsedPrice * 100 <= defaultPrices[plan as keyof typeof defaultPrices]
        ? Math.round(parsedPrice * 100) 
        : defaultPrices[plan as keyof typeof defaultPrices];

    console.log("Final Price (cents):", finalPrice);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Job Posting - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            unit_amount: finalPrice,
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
        discountedPrice: (finalPrice / 100).toFixed(2), // Ensure correct cents-to-euros conversion
      },
    });

    console.log("Stripe session created:", session.id);
    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
