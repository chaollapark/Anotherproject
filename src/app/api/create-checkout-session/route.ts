import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const { jobId, plan, price } = await req.json(); // Accept `price` from the client
    console.log("Job ID:", jobId);
    console.log("Plan:", plan);
    console.log("Price (with discount if applicable):", price);

    // Define default prices for each plan
    const defaultPrices = {
      basic: 9999, // €99.99
      pro: 19999, // €199.99
      recruiter: 99999, // €999.99
    };

    // Ensure the provided plan is valid
    if (!defaultPrices[plan as keyof typeof defaultPrices]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Use the passed price or fallback to default price
    const finalPrice = price ? Math.round(price * 100) : defaultPrices[plan as keyof typeof defaultPrices]; // Convert to cents

    if (finalPrice <= 0) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
    }

    // Create a Stripe Checkout session
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
        discountedPrice: finalPrice / 100, // Store the discounted price for later use (optional)
      },
    });

    console.log("Stripe session created:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
