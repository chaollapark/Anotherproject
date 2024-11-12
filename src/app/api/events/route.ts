import { NextResponse } from 'next/server';
import { fetchEvents } from '@/models/Event';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  //const count = parseInt(searchParams.get('count') || '0');
  
  //const events = await fetchEvents(10, count);
  const events = await fetchEvents(10);
  return NextResponse.json(events);
}
