import { model, models, Schema } from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export type Event = {
  _id: string;
  title: string;
  date: Date;
  location: string;
  link: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  plan?: string;
  userWorkosId?: string;
  // Additional optional fields that might be useful
  organizer?: string;
  capacity?: number;
  eventType?: string;
  isVirtual?: boolean;
};

const EventSchema = new Schema({
  title: { 
    type: String,
    required: true 
  },
  date: { 
    type: Date,
    required: true 
  },
  location: { 
    type: String,
    required: true 
  },
  link: { 
    type: String,
    required: true 
  },
  description: { 
    type: String,
    required: true 
  },
  organizer: { 
    type: String,
    required: false 
  },
  capacity: { 
    type: Number,
    required: false 
  },
  eventType: { 
    type: String,
    required: false 
  },
  isVirtual: { 
    type: Boolean,
    default: false 
  },
  userWorkosId: { 
    type: String, 
    required: false 
  },
  plan: {
    type: String, 
    enum: ['pending', 'basic', 'premium', 'unlimited'],
    required: false,
    default: 'pending'
  }
}, {
  timestamps: true
});

export const EventModel = models?.Event || model('Event', EventSchema);

// Utility function to fetch events, similar to fetchJobs
export async function fetchEvents(limit: number = 10) {
  try {
    await dbConnect();
    
    // First, fetch premium events
    const premiumEvents = await EventModel.find(
      { plan: 'premium' },
      {},
      { sort: '-date', limit }
    );
    
    // Then, fetch other events (excluding pending)
    const remainingLimit = limit - premiumEvents.length;
    const otherEvents = await EventModel.find(
      { 
        plan: { 
          $nin: ['premium', 'pending']
        }
      },
      {},
      { sort: '-date', limit: remainingLimit }
    );
    
    // Combine the results
    const allEvents = [...premiumEvents, ...otherEvents];
    return JSON.parse(JSON.stringify(allEvents));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
