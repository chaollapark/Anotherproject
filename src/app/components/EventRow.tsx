'use client';
import TimeAgo from "@/app/components/TimeAgo";
import { Event } from "@/models/Event";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';

const EventDescription = ({ description }: { description: string }) => {
  return (
    <div 
      className="prose prose-sm sm:prose lg:prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
};

export default function EventRow({eventDoc}:{eventDoc:Event}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPremium = eventDoc.plan === "premium";
  
  // Format the date nicely
  const eventDate = new Date(eventDoc.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`rounded-lg shadow-sm relative`}>
      <div className={`bg-white p-4 rounded-lg relative ${isExpanded && 'shadow-md'}`}>
        {isPremium && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
            <FontAwesomeIcon 
              icon={faStar} 
              className="mr-1 inline-block align-middle w-3.5 h-3.5" 
            />
            <span className="align-middle">featured</span>
          </div>
        )}
        
        <div 
          className="flex grow gap-4 w-full hover:bg-gray-50 hover:cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="grow sm:flex pl-2">
            <div className="grow">
              <div>
                <div className="text-gray-600 text-sm font-medium">
                  {formattedDate}
                </div>
              </div>
              <div className="font-bold text-lg mb-1">
                <h2 className="text-gray-800">{eventDoc.title}</h2>
              </div>
              <div className="text-gray-500 text-sm capitalize flex flex-wrap gap-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                  {eventDoc.location}
                </span>
                {eventDoc.eventType && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                    {eventDoc.eventType}
                  </span>
                )}
                {eventDoc.isVirtual && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Virtual
                  </span>
                )}
              </div>
            </div>
            {eventDoc.createdAt && (
              <div className="content-end text-gray-500 text-xs mt-2 sm:mt-0">
                <TimeAgo createdAt={eventDoc.createdAt} />
              </div>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4 space-y-6 transition-all duration-200">
            {/* Event Description */}
            <div className="mt-4">
              <EventDescription description={eventDoc.description} />
            </div>

            {/* Event Details */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Event Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{eventDoc.location}</span>
                </div>
                {eventDoc.capacity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{eventDoc.capacity} attendees</span>
                  </div>
                )}
                {eventDoc.organizer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organizer:</span>
                    <span className="font-medium">{eventDoc.organizer}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Link */}
            {eventDoc.link && (
              <div className="text-center">
                <a
                  href={eventDoc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Register for Event
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
