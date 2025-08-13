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
    const { package: packageType, cvFileUrl } = body;

    // Validate required fields
    if (!packageType || !cvFileUrl) {
      return NextResponse.json(
        { error: 'Package type and CV file URL are required', receivedData: body },
        { status: 400 }
      );
    }

    // Validate package type
    const validPackages = ['trial', 'full'];
    if (!validPackages.includes(packageType)) {
      return NextResponse.json(
        { error: 'Invalid package type. Must be "trial" or "full"' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Define package prices and applications
    const packageConfig = {
      trial: { price: 5000, applications: 25, name: 'Trial Package' }, // €50
      full: { price: 10000, applications: 100, name: 'Full Package' }   // €100
    };

    const selectedPackage = packageConfig[packageType as keyof typeof packageConfig];

    // Save AI apply request to database
    const aiApplyRequest = await AIApplyRequest.create({
      cvFileUrl,
      packageType,
      applicationsRequested: selectedPackage.applications,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `AI Application ${selectedPackage.name}`,
              description: `${selectedPackage.applications} AI-powered job applications with 7-day turnaround`,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        aiApplyId: aiApplyRequest._id.toString(),
        service: 'ai-apply',
        packageType,
        cvFileUrl,
        applicationsRequested: selectedPackage.applications.toString(),
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
