"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('Upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/events")
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

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((event) => event.date >= today);
  const completedEvents = events.filter((event) => event.date < today);

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h2 className="pl-4 text-5xl font-extrabold text-white justify-center flex items-center">
          Events</h2>
        </div>

        {/* Category Selection Tabs */}
                <motion.div
                  className="flex justify-center mb-10 md:mb-14"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-black/30 backdrop-blur-md rounded-full p-1.5 flex shadow-xl">
                    <motion.button
                      className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'Upcoming'
                        ? 'bg-white text-purple-900 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      onClick={() => {setUpcoming(true); setComplete(false); setSelectedCategory('Upcoming')}}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Upcoming
                    </motion.button>
                    <motion.button
                      className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'Completed'
                        ? 'bg-white text-purple-900 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      onClick={() => {setComplete(true); setUpcoming(false); setSelectedCategory('Completed')}}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Completed
                    </motion.button>
                  </div>
                </motion.div>

        {/* Toggle Buttons for Upcoming & Completed
        <div className="flex flex-row gap-2 sm:gap-5 justify-center text-white mb-6 sm:mb-10">
          <Button
            variant="ghost"
            className={`text-lg sm:text-xl md:text-2xl px-2 ${
              upcoming ? "text-purple-400" : "text-gray-300"
            }`}
            onClick={() => {setUpcoming(true); setComplete(false);}}
          >
            Upcoming ({upcomingEvents.length})
          </Button>
          <Button
            variant="ghost"
            className={`text-lg sm:text-xl md:text-2xl px-2 ${
              complete ? "text-purple-400" : "text-gray-300"
            }`}
            onClick={() => {setComplete(true); setUpcoming(false);}}
          >
            Completed ({completedEvents.length})
          </Button>
        </div>*/}

        {/* Events Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: item * 0.1 }}
              >
                <Skeleton className="w-full h-56 bg-white/20 rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-white/20" />
                  <Skeleton className="h-4 w-full bg-white/20" />
                  <Skeleton className="h-4 w-2/3 bg-white/20" />
                  <Skeleton className="h-10 w-full bg-white/20 rounded-xl mt-4" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {upcoming
              ? upcomingEvents.length > 0
                ? upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))
                : NoEvents("No Upcoming Events")
              : completedEvents.length > 0
              ? completedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))
              : NoEvents("No Completed Events")}
          </div>
        )}
      </div>
    </div>
  );
};

// Event Card Component - Modern Glass Design with Perfect Image Fitting
const EventCard = ({ event }) => {
  const formatEventType = (type) => {
    if (!type) return "";
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear()
    };
  };

  const dateInfo = formatDate(event.date);

  return (
    <motion.div 
      className="group relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      {/* Main Card Container */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-purple-500/25 group-hover:border-purple-400/50">
        
        {/* Image Container with Perfect Fitting */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={event?.image || "/placeholder.jpg"}
            alt={event?.name || "Event Image"}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Event Type Badge */}
          {event.type && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-purple-600/90 hover:bg-purple-600 text-white border-0 backdrop-blur-sm">
                {formatEventType(event.type)}
              </Badge>
            </div>
          )}
          
          {/* Date Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[3rem] shadow-lg">
            <div className="text-2xl font-bold text-purple-900">{dateInfo.day}</div>
            <div className="text-xs font-medium text-purple-700 uppercase">{dateInfo.month}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Event Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-200 transition-colors duration-300 min-h-[3.5rem] flex items-center">
            {event?.name || "Event Name"}
          </h3>
          
          {/* Event Info */}
          <div className="space-y-2 mb-4">
            {event.venue && (
              <div className="flex items-center text-white/80 text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{event.venue}</span>
              </div>
            )}
            
            <div className="flex items-center text-white/80 text-sm">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <Link href={`/Events/${event.id}`} className="block">
            <motion.button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">View Details</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </motion.button>
          </Link>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

// No Events Message
const NoEvents = (message) => (
  <div className="col-span-full text-center py-20 px-50 bg-white/5 backdrop-blur-sm rounded-lg">
    <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
  </div>
);

export default Page;
