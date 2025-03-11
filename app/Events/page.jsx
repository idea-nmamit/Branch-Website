'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowRight, Star } from "lucide-react";

const Page = () => {
  const [events, setEvents] = useState([]); // All events from API
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState(true); // Show Upcoming by default
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, []);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Separate upcoming and completed events
  const upcomingEvents = events.filter(event => event.date >= today);
  const completedEvents = events.filter(event => event.date < today);

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Events</h1>
          <Badge className="px-3 py-1 bg-purple-500 text-white">
            {loading ? "Loading..." : `${events.length} Events`}
          </Badge>
        </div>

        {/* Toggle Buttons for Upcoming & Completed */}
        <div className="flex flex-row gap-5 justify-center text-white mb-10">
          <Button 
            variant="ghost" 
            className={`text-2xl ${upcoming ? "text-purple-400" : "text-gray-300"}`} 
            onClick={() => (setUpcoming(true), setComplete(false))}
          >
            Upcoming ({upcomingEvents.length})
          </Button>
          <Button 
            variant="ghost" 
            className={`text-2xl ${complete ? "text-purple-400" : "text-gray-300"}`} 
            onClick={() => (setComplete(true), setUpcoming(false))}
          >
            Completed ({completedEvents.length})
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="w-full overflow-hidden bg-white/5 backdrop-blur-lg border-0">
                <div className="relative">
                  <Skeleton className="w-full h-48" />
                </div>
                <CardHeader className="pb-2">
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-1/2 h-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <div className="flex justify-end mt-4">
                    <Skeleton className="w-32 h-10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming
              ? upcomingEvents.length > 0
                ? upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                : <NoEvents message="No Upcoming Events" />
              : completedEvents.length > 0
                ? completedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                : <NoEvents message="No Completed Events" />
            }
          </div>
        )}
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => (
  <Card className="group w-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border-0 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 relative">
    <div className="relative w-full pt-[56.25%]">
      <img 
        src={event.image} 
        alt={event.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {event.featured && (
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full shadow-lg">
          <Star size={14} className="text-white animate-pulse" />
          <span className="text-white text-sm font-medium">Featured</span>
        </div>
      )}

      {event.date && (
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
          <div className="flex items-center text-sm text-white">
            <Calendar size={14} className="mr-1" />
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>

    <div className="relative z-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
          {event.name}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-300 space-x-4">
          {event.time && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {event.time}
            </div>
          )}
          {event.venue && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              <span className="truncate max-w-xs">{event.venue}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-gray-200">
        {event.description && <p className="text-sm mb-4 line-clamp-2">{event.description}</p>}
      </CardContent>

      <CardFooter className="flex justify-end pt-0 pb-6">
        <Link href={`/Events/${event.id}`}>
        <Button className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-6 transition-all duration-300 flex items-center group-hover:translate-y-0 group-hover:shadow-lg">
          <span className="mr-2">View Details</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button></Link>
      </CardFooter>
    </div>
  </Card>
);

// No Events Component
const NoEvents = ({ message }) => (
  <div className="col-span-full text-center py-20 bg-white/5 backdrop-blur-sm rounded-lg">
    <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
    <p className="text-gray-300">Check back later.</p>
  </div>
);

export default Page;