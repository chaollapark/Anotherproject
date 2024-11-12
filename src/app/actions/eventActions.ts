// app/actions/eventActions.ts
import { EventModel } from '@/models/Event';
import dbConnect from '@/lib/dbConnect';

export async function searchEvents(searchPhrase: string) {
  await dbConnect();
  
  const events = await EventModel.find({
    $or: [
      { title: { $regex: searchPhrase, $options: 'i' } },
      { description: { $regex: searchPhrase, $options: 'i' } },
      { location: { $regex: searchPhrase, $options: 'i' } },
    ]
  }).sort('-date');
  
  return JSON.parse(JSON.stringify(events));
}
