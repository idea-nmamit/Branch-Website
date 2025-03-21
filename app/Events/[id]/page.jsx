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
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#3b0086] to-[#8e24aa] text-white p-10 rounded-xl shadow-[0px_0px_30px_5px_rgba(208,139,255,0.4)] border-2 border-[#E0AFFF] transform transition duration-500 hover:scale-105">
        <h3 className="text-center text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#E0AFFF] to-[#FFC0CB] uppercase tracking-wide transition duration-300 hover:text-[#E0AFFF]  rounded-lg">
         {event.name}
        </h3>

 
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Info Box */}
<div className="w-full aspect-square rounded-lg border-2 border-[#E0AFFF] backdrop-blur-md bg-white/20 shadow-md p-6 transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_10px_5px_rgba(226,196,63,0.5)] flex flex-col justify-center items-start gap-4 text-left overflow-hidden">
  <p className="text-2xl sm:text-3xl font-bold leading-snug pl-3">
    {event.type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())}
  </p>

  <p className="text-lg sm:text-xl leading-snug pl-3">
    <strong>Venue:</strong> {event.venue}
  </p>

  <p className="text-lg sm:text-xl leading-snug pl-3">
    <strong>Date:</strong>{" "}
    {new Date(event.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </p>

  <p className="text-lg sm:text-xl leading-snug pl-3">
    <strong>Time:</strong>{" "}
    {new Date(event.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
  </p>
</div>

        {/* Event Image Box */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full aspect-square rounded-lg border-2 border-[#E0AFFF] backdrop-blur-md bg-white/20 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_10px_5px_rgba(226,196,63,0.5)]">
            <div className="w-full h-full relative">
              <Image
                src={event?.image || "/placeholder-image.jpg"}
                layout="fill"
                objectFit="cover"
                alt={event?.title ? `Image of ${event.title}` : "Event Image"}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
        
        {/* Event Description Box */}
        <div className="border-2 border-[#E0AFFF] p-6 rounded-lg mt-8 backdrop-blur-md bg-white/20 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0px_0px_10px_5px_rgba(226,196,63,0.5)]">
          <h4 className="text-2xl font-bold mb-4 text-[#E0AFFF]">Event Details</h4>
          <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      </div>
    </div>
  );
}