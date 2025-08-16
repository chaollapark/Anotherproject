import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import AIApplyRequest from '@/models/AIApplyRequest';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { package: packageType, cvFileId } = body;
    
    console.log("=== AI APPLY CHECKOUT SESSION CREATION ===");
    console.log("Package Type:", packageType);
    console.log("CV File ID:", cvFileId);
    console.log("Service: AI Apply");

    // Validate required fields
    if (!packageType || !cvFileId) {
      return NextResponse.json(
        { error: 'Package type and CV file ID are required', receivedData: body },
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

    // Define package configuration with Stripe Price IDs
    const packageConfig = {
      trial: { 
        priceId: process.env.STRIPE_TRIAL_PRICE_ID || 'price_trial_placeholder',
        applications: 25, 
        name: 'Trial Package' 
      },
      full: { 
        priceId: process.env.STRIPE_FULL_PRICE_ID || 'price_full_placeholder',
        applications: 100, 
        name: 'Full Package' 
      }
    };

    const selectedPackage = packageConfig[packageType as keyof typeof packageConfig];
    
    // Validate CV ownership (in a real app, you'd check against user session)
    // For now, we'll just verify the CV exists
    const ResumeSchema = new mongoose.Schema({
      email: String,
      content: String,
      filename: String,
      uploadedAt: { type: Date, default: Date.now },
      fileUrl: String,
    });
    
    const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
    
    console.log('Searching for CV file with ID:', cvFileId);
    const cvFile = await Resume.findById(cvFileId);
    console.log('CV file query result:', cvFile ? 'Found' : 'Not found');
    
    if (!cvFile) {
      return NextResponse.json(
        { error: 'CV file not found' },
        { status: 404 }
      );
    }

    console.log('CV file found:', { 
      id: cvFile._id, 
      fileUrl: cvFile.fileUrl, 
      hasFileUrl: !!cvFile.fileUrl,
      fileUrlType: typeof cvFile.fileUrl 
    });

    if (!cvFile.fileUrl || cvFile.fileUrl.trim() === '') {
      return NextResponse.json(
        { error: 'CV file URL not found or is empty', cvFileData: { id: cvFile._id, fileUrl: cvFile.fileUrl } },
        { status: 400 }
      );
    }

    // Prepare the data for AIApplyRequest creation
    const aiApplyData = {
      cvFileUrl: cvFile.fileUrl.trim(), // Use the fileUrl from the CV file and ensure it's trimmed
      cvFileId,
      packageType,
      applicationsRequested: selectedPackage.applications,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Creating AIApplyRequest with data:', aiApplyData);

    // Additional validation before creating the record
    if (!aiApplyData.cvFileUrl || aiApplyData.cvFileUrl.trim() === '') {
      console.error('cvFileUrl is still empty after validation:', aiApplyData);
      return NextResponse.json(
        { error: 'CV file URL is required but was not found in the database record' },
        { status: 400 }
      );
    }

    // Save AI apply request to database
    const aiApplyRequest = await AIApplyRequest.create(aiApplyData);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPackage.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        aiApplyId: aiApplyRequest._id.toString(),
        service: 'ai-apply',
        packageType,
        cvFileId,
        applicationsRequested: selectedPackage.applications.toString(),
      },
      success_url: 'https://www.eujobs.co/ai-apply/success',
      cancel_url: 'https://www.eujobs.co/ai-apply',
    });

    console.log("=== AI APPLY CHECKOUT SESSION CREATION COMPLETE ===");
    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Error creating AI apply checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
