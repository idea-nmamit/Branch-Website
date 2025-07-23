"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";


const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState(null);
  const [complete, setComplete] = useState(null);


  useEffect(() => {
    setLoading(true);
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        
        const today = new Date().toISOString().split("T")[0];
        const upcomingEvents = data.filter((event) => event.date >= today);
        
        if (upcomingEvents.length > 0) {
          setSelectedCategory('Upcoming');
          setUpcoming(true);
          setComplete(false);
        } else {
          setSelectedCategory('Completed');
          setUpcoming(false);
          setComplete(true);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, []);


  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events
    .filter((event) => event.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const completedEvents = events
    .filter((event) => event.date < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));


  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h2 className="pl-4 text-5xl font-extrabold text-white justify-center flex items-center">
          Events</h2>
        </div>

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden h-[520px]"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
            {upcoming
              ? upcomingEvents.length > 0
                ? upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
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
                    className="h-full"
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
      className="group relative w-full h-[520px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
      
      <div className="relative h-full bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-purple-500/25 group-hover:border-purple-400/50 flex flex-col">
        
        <div className="relative h-64 overflow-hidden rounded-t-2xl flex-shrink-0">
          <div className="relative w-full h-full">
            <img
              src={event?.image || "/placeholder.jpg"}
              alt={event?.name || "Event Image"}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter group-hover:brightness-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
          
          {event.type && (
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 backdrop-blur-sm shadow-lg text-xs font-semibold px-3 py-1.5">
                {formatEventType(event.type)}
              </Badge>
            </motion.div>
          )}
          
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm rounded-xl p-3 text-center min-w-[4rem] shadow-lg border border-white/20 group-hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-pink-600">{dateInfo.day}</div>
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{dateInfo.month}</div>
            <div className="text-[8px] font-medium text-gray-500">{dateInfo.year}</div>
          </motion.div>
        </div>


        <div className="relative p-6 flex flex-col flex-grow">
          <div className="relative z-10 flex-grow">
            <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-purple-200 transition-colors duration-300 line-clamp-2">
              {event?.name || "Event Name"}
            </h3>
            
            <div className="space-y-3 mb-6">
              {event.venue && (
                <div className="flex items-start text-white/90 text-sm group-hover:text-purple-200 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mr-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium line-clamp-2">{event.venue}</span>
                </div>
              )}
              
              <div className="flex items-center text-white/90 text-sm group-hover:text-purple-200 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mr-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>


          <Link href={`/Events/${event.id}`} className="block relative z-10 mt-auto">
            <motion.button
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2 font-bold tracking-wide">View Details</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </motion.button>
          </Link>
        </div>


        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:via-pink-600/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};


const NoEvents = (message) => (
  <div className="col-span-full text-center py-20 px-6 sm:px-12 bg-white/5 backdrop-blur-sm rounded-lg max-w-full overflow-hidden">
    <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
  </div>
);



export default Page;
