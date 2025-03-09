'use client'
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="bg-[#17003A] dark:bg-[#8617C0] p-10 min-h-screen">
      <div className="text-3xl font-bold text-white mb-8">Upcoming Events</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="w-full bg-secondary text-primary shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 border-transparent hover:border-primary/20"
          >
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
              {event.date && (
                <p className="text-sm text-gray-600">
                  <span className="inline-block mr-2">📅</span>
                  {new Date(event.date).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
              )}
              <div className="flex justify-end mt-2">
                <Button 
                  className="bg-primary hover:bg-primary/80 text-white transition-colors duration-300"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="text-center text-white py-20">
          <p className="text-xl">No events found</p>
        </div>
      )}
    </div>
  );
};

export default Page;
