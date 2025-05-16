import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import HeadhunterRequest from '@/models/HeadhunterRequest';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tier, name, companyName, role, email, phone, notes } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', receivedData: body },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Save headhunter request to database
    const headhunterRequest = await HeadhunterRequest.create({
      tier,
      name,
      companyName,
      role,
      email,
      phone,
      notes,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Define tier prices (in cents)
    const tierPrices = {
      tier1: 0, // €0
      tier2: 50000, // €500
      tier3: 150000, // €1500
    };

    // Validate tier
    if (!tierPrices[tier as keyof typeof tierPrices]) {
      return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 });
    }

    const price = tierPrices[tier as keyof typeof tierPrices];
    const tierNames = {
      tier1: "Tier 1 - Single Role",
      tier2: "Tier 2 - Priority Sourcing",
      tier3: "Tier 3 - Unlimited Hires"
    };

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Headhunter Service - ${tierNames[tier as keyof typeof tierNames]}`,
              description: `Recruiting service for ${role} at ${companyName}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        headhunterId: headhunterRequest._id.toString(),
        tier,
        companyName,
        role,
        email,
      },
      success_url: 'https://www.eujobs.co/headhunter/success',
      cancel_url: 'https://www.eujobs.co/headhunter',
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Error creating headhunter checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
