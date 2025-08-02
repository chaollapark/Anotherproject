import { NextResponse } from 'next/server';
import { SubscriberModel } from '@/models/Subscriber';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const existingSubscriber = await SubscriberModel.findOne({ email });

    if (existingSubscriber) {
      if (!existingSubscriber.isSubscribed) {
        existingSubscriber.isSubscribed = true;
        await existingSubscriber.save();
        return NextResponse.json({ message: 'You have been resubscribed!' }, { status: 200 });
      }
      return NextResponse.json({ message: 'You are already subscribed.' }, { status: 200 });
    }

    await SubscriberModel.create({ email });
    return NextResponse.json({ message: 'Thanks for subscribing to eujobs.co!' }, { status: 201 });

  } catch (error) {
    console.error('Subscription Error:', error);
    if (error.code === 11000) {
        return NextResponse.json({ message: 'You are already subscribed.' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
