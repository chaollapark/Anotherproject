import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import AIApplyRequest from '@/models/AIApplyRequest';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, cv, preferences } = body;

    // Validate required fields
    if (!name || !email || !phone || !cv) {
      return NextResponse.json(
        { error: 'Name, email, phone, and CV link are required', receivedData: body },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Save AI apply request to database
    const aiApplyRequest = await AIApplyRequest.create({
      name,
      email,
      phone,
      cv,
      preferences,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // AI Application Package price: €100
    const price = 10000; // €100 in cents

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'AI Application Package',
              description: '100 AI-powered job applications with 7-day turnaround',
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        aiApplyId: aiApplyRequest._id.toString(),
        service: 'ai-apply',
        name,
        email,
        phone,
        cv,
        preferences: preferences || '',
      },
      success_url: 'https://www.eujobs.co/ai-apply/success',
      cancel_url: 'https://www.eujobs.co/ai-apply',
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Error creating AI apply checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
