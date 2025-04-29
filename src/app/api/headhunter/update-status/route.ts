import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HeadhunterRequest from '@/models/HeadhunterRequest';

export async function POST(req: Request) {
  try {
    const { headhunterId, status, email } = await req.json();

    // Connect to MongoDB
    await dbConnect();

    // Update headhunter request status
    await HeadhunterRequest.findByIdAndUpdate(headhunterId, { status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating headhunter request status:', err);
    return NextResponse.json(
      { error: 'Error updating headhunter request status' },
      { status: 500 }
    );
  }
}
