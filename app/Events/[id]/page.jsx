"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8B5CF6, #A855F7);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7C3AED, #9333EA);
  }
`;

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

  const formatEventType = (type) => {
    if (!type) return "";
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen flex">
        {/* Left Side - Image Skeleton */}
        <div className="w-full lg:w-3/5 relative bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-4 lg:p-8">
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <div className="text-white/70 text-xl font-medium">Loading Event...</div>
                <div className="text-white/50 text-sm mt-2">Please wait while we fetch the details</div>
              </div>
            </div>
            
            {/* Decorative corners for loading state */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-3xl animate-pulse"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-bl-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-3xl animate-pulse"></div>
          </div>
          
          {/* Loading badge */}
          <div className="hidden lg:block absolute top-12 right-12 z-10">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-pulse">
              <div className="h-6 w-24 bg-white/20 rounded"></div>
            </div>
          </div>
          
          {/* Loading title */}
          <div className="hidden lg:block absolute bottom-12 left-12 right-12 z-10">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 animate-pulse">
              <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Content Skeleton */}
        <div className="hidden lg:flex lg:w-2/5 bg-white/8 backdrop-blur-xl border-l border-white/20">
          <div className="w-full p-8 space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-white/20 rounded-full"></div>
                <div className="h-8 bg-white/20 rounded-lg w-3/4 animate-pulse"></div>
              </div>
            </div>
            
            {/* Info cards skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-white/20 rounded w-1/3"></div>
                      <div className="h-6 bg-white/20 rounded w-2/3"></div>
                      <div className="h-5 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-white/20 rounded-full"></div>
                <div className="h-8 bg-white/20 rounded-lg w-1/2 animate-pulse"></div>
              </div>
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-white/20 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="w-full bg-white/8 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-40">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E0AFFF] to-[#FFC0CB] text-center mb-3 leading-tight px-2">
            {event.name}
          </h1>
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-purple-400/30">
              {formatEventType(event.type)}
            </div>
          </div>
        </div>

        {/* Mobile Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 p-3 sm:p-4">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-black/20 to-purple-900/20 backdrop-blur-sm">
            <Image
              src={event?.image || "/placeholder-image.jpg"}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
              style={{ objectFit: "contain" }}
              alt={event?.name ? `Image of ${event.name}` : "Event Image"}
              className="brightness-100 p-2 sm:p-3"
            />
            
            {/* Mobile corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/30 to-transparent rounded-br-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-bl from-pink-500/30 to-transparent rounded-bl-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-tr-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-tl from-purple-500/30 to-transparent rounded-tl-2xl"></div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 sm:p-6 space-y-6 pb-8">
          {/* Quick Info Cards */}
          <div className="space-y-3 sm:space-y-4">
            {/* Date */}
            <div className="p-4 sm:p-5 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-purple-200/70 font-medium mb-1">Date & Time</p>
                  <p className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: 'long',
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {event.time && (
                    <p className="text-sm text-purple-200/60 mt-1">{event.time}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="p-4 sm:p-5 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-purple-200/70 font-medium mb-1">Venue</p>
                  <p className="text-lg sm:text-xl font-bold text-white leading-tight">{event.venue}</p>
                </div>
              </div>
            </div>

            {/* Attendance */}
            {event.attendees && (
              <div className="p-4 sm:p-5 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-purple-200/70 font-medium mb-1">Attendance</p>
                    <p className="text-lg sm:text-xl font-bold text-white leading-tight">{event.attendees} People</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Event Description */}
          {event.description && (
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white border-b border-white/20 pb-3">About This Event</h3>
              <div className="p-4 sm:p-6 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm">
                <div 
                  className="text-white/90 leading-relaxed prose prose-invert prose-p:text-white/85 prose-headings:text-white prose-strong:text-white prose-sm sm:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Large Image */}
        <div className="w-3/5 relative bg-gradient-to-br from-purple-900/10 to-indigo-900/10 p-12">
          {/* Main Image Container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-black/20 to-purple-900/20 backdrop-blur-sm">
            <Image
              src={event?.image || "/placeholder-image.jpg"}
              fill
              priority
              sizes="60vw"
              style={{ objectFit: "contain" }}
              alt={event?.name ? `Image of ${event.name}` : "Event Image"}
              className="brightness-100 p-4 transition-all duration-500 hover:scale-[1.02]"
            />
            
            {/* Minimal gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* Simple corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent"></div>
          </div>
          
          {/* Clean Event Type Badge */}
          <div className="absolute top-10 right-10 z-10">
            <div className="px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
              <span className="text-white font-medium text-sm tracking-wide">
                {formatEventType(event.type)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Clean Content Panel */}
        <div className="w-2/5 bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
              
              {/* Event Title */}
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E0AFFF] to-[#FFC0CB] mb-3 leading-tight">{event.name}</h1>
                <div className="inline-block px-4 py-2 bg-purple-600/80 rounded-full text-white text-sm font-medium">
                  {formatEventType(event.type)}
                </div>
              </div>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Date */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200/60 font-medium">Date & Time</p>
                      <p className="text-lg font-bold text-white">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: 'long',
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200/60 font-medium">Venue</p>
                      <p className="text-lg font-bold text-white">{event.venue}</p>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                {event.attendees && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-purple-200/60 font-medium">Attendance</p>
                        <p className="text-lg font-bold text-white">{event.attendees} People</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Event Description */}
              {event.description && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white border-b border-white/20 pb-2">About This Event</h3>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div 
                      className="text-white/90 leading-relaxed prose prose-invert prose-p:text-white/85 prose-headings:text-white prose-strong:text-white max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}