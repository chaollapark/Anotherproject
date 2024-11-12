'use client';
import React, { useState, useEffect } from 'react';
import EventRow from "@/app/components/EventRow";
import type { Event } from "@/models/Event";
import { Button } from '@radix-ui/themes';

interface EventsProps {
  header: string;
  initialEvents: Event[];
  isSearchResult?: boolean;
}

export default function Events({ header, initialEvents, isSearchResult = false }: EventsProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const loadMoreEvents = async () => {
    if (isSearchResult) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/events?count=${events.length}`);
      const newEvents = await response.json();
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
    } catch (error) {
      console.error('Error loading more events:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-200 py-6 rounded-3xl">
      <div className="container">
        <h2 className="font-bold mb-4">{header}</h2>
        <div className="flex flex-col gap-4">
          {events.length === 0 ? (
            <div>No events found</div>
          ) : (
            events.map(event => (
              <EventRow key={event._id} eventDoc={event} />
            ))
          )}
        </div>
        {!isSearchResult && events.length >= 10 && (
          <div className="mt-6 text-center">
            <Button 
              onClick={loadMoreEvents} 
              disabled={loading}
              className="!text-white !rounded-md !py-1 !px-2 sm:py-2 sm:px-4 !bg-gray-500 text-white hover:!bg-gray-600 !transition-colors cursor-pointer"
            >
              {loading ? 'Loading...' : 'Load More Events'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

