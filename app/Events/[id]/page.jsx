"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch event details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8 font-roboto">
        <div className="mt-10">
          {/* Event skeleton */}
          <div className="mt-10 flex justify-center">
             <div className="h-16 w-3/4 bg-gradient-to-r from-[#3b0086]/30 to-[#8e24aa]/30 rounded-lg border-l-8 border-[#E0AFFF]/40 pl-4 flex items-center animate-pulse"></div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#3b0086]/70 to-[#8e24aa]/70 text-white p-10 rounded-xl mt-10 shadow-[0px_0px_30px_5px_rgba(208,139,255,0.2)] border-2 border-[#E0AFFF]/40">
          {/* Title skeleton */}
          <div className="h-12 w-2/3 mx-auto bg-gradient-to-r from-[#E0AFFF]/30 to-[#FFC0CB]/30 rounded-lg animate-pulse mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Info Box skeleton */}
            <div className="p-6 min-h-[200px] rounded-lg border-2 border-[#E0AFFF]/40 backdrop-blur-md bg-white/10 shadow-md flex flex-col justify-center space-y-4">
              <div className="h-6 w-1/2 bg-white/20 rounded animate-pulse"></div>
              <div className="h-6 w-3/4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-6 w-2/3 bg-white/20 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-white/20 rounded animate-pulse"></div>
            </div>
            
            {/* Event Image Box skeleton */}
            <div className="flex justify-center">
              <div className="w-[350px] h-[240px] rounded-lg border-2 border-[#E0AFFF]/40 bg-gradient-to-r from-[#3b0086]/30 to-[#8e24aa]/30 animate-pulse"></div>
            </div>
          </div>
          
          {/* Event Description Box skeleton */}
          <div className="border-2 border-[#E0AFFF]/40 p-6 rounded-lg mt-8 backdrop-blur-md bg-white/10 shadow-md">
            <div className="h-8 w-1/3 bg-[#E0AFFF]/30 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          
         
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8 font-roboto">
     <div className="mt-10 flex justify-center">
  <h2 className="h-16 w-3/4 bg-gradient-to-r from-[#3b0086]/30 to-[#8e24aa]/30 rounded-lg border-l-8 border-[#E0AFFF]/40 pl-4 text-5xl font-extrabold text-[#EDB7EA] text-left uppercase tracking-widest shadow-md transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(224,175,255,0.6)] hover:scale-105 flex items-center">
    Event
  </h2>
</div>

      <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#3b0086] to-[#8e24aa] text-white p-10 rounded-xl shadow-[0px_0px_30px_5px_rgba(208,139,255,0.4)] border-2 border-[#E0AFFF] transform transition duration-500 hover:scale-105">
        <h3 className="text-center text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#E0AFFF] to-[#FFC0CB] uppercase tracking-wide transition duration-300 hover:text-[#E0AFFF] hover:shadow-[0px_0px_25px_rgba(255,255,255,0.8)] rounded-lg">
           {event.name}
        </h3>
 
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Info Box */}
          <div className="p-6 min-h-[200px] rounded-lg border-2 border-[#E0AFFF] backdrop-blur-md bg-white/20 shadow-md flex flex-col justify-center text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_50px_5px_rgba(226,196,63,0.5)]">
          <p className="text-xl font-semibold"><strong>{event.type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</strong></p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</p>
          </div>
          
          {/* Event Image Box */}
          <div className="transition-transform duration-300 hover:scale-110 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,0.4)] flex justify-center">
            <Image
              alt={event.title}
              src={event.image}
              width={350}
              height={240}
              className="rounded-lg border-2 border-[#E0AFFF] shadow-md"
            />
          </div>
        </div>
        
        {/* Event Description Box */}
        <div className="border-2 border-[#E0AFFF] p-6 rounded-lg mt-8 backdrop-blur-md bg-white/20 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_50px_5px_rgba(226,196,63,0.5)]">
          <h4 className="text-2xl font-bold mb-4 text-[#E0AFFF]">Event Details</h4>
          <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      </div>
    </div>
  );
}