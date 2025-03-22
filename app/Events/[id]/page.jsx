"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 100]);
  
  const [descriptionRef, descriptionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fixed shimmer animation - using a proper animation pattern with framer-motion
  const shimmerVariants = {
    initial: {
      backgroundPosition: "0% 0%",
    },
    animate: {
      backgroundPosition: "100% 0%",
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.5,
        ease: "linear",
      },
    },
  };

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
      <div className="bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen p-4 md:p-8 font-roboto flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] -top-[250px] -left-[100px]"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full bg-pink-600/20 blur-[120px] -bottom-[300px] -right-[200px]"></div>
        </div>
        
        <div className="w-full max-w-4xl relative z-10">
          <div className="w-full bg-white/5 backdrop-filter backdrop-blur-lg rounded-2xl p-6 md:p-10 border border-white/10 shadow-xl">
            {/* Title skeleton */}
            <motion.div 
              className="h-10 w-2/3 mx-auto bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-lg mb-8"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ backgroundSize: "200% 100%" }}
            ></motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Info Box skeleton */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 min-h-[200px] flex flex-col justify-center space-y-4 backdrop-blur-md">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    className="h-6 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded" 
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{ 
                      backgroundSize: "200% 100%", 
                      width: `${Math.random() * 30 + 50}%` 
                    }}
                  ></motion.div>
                ))}
              </div>
              
              {/* Event Image Box skeleton */}
              <motion.div 
                className="aspect-square rounded-xl border border-white/10 bg-gradient-to-r from-white/5 via-white/15 to-white/5"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ backgroundSize: "200% 100%" }}
              ></motion.div>
            </div>
            
            {/* Event Description Box skeleton */}
            <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
              <motion.div 
                className="h-7 w-1/4 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded mb-6"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ backgroundSize: "200% 100%" }}
              ></motion.div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i} 
                    className="h-4 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{ 
                      backgroundSize: "200% 100%", 
                      width: `${Math.random() * 40 + 60}%` 
                    }}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen overflow-hidden">
      {/* Fixed position background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-[120px] -top-[250px] -left-[200px]"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-[150px] top-[20%] -right-[400px]"></div>
        <div className="absolute w-[700px] h-[700px] rounded-full bg-pink-600/20 blur-[130px] -bottom-[300px] -left-[300px]"></div>
      </div>
      
      {/* Fixed mesh gradient background */}
      <div className="fixed inset-0 opacity-30 bg-[url('/mesh-gradient.webp')] bg-cover mix-blend-overlay pointer-events-none"></div>

      {/* Main content wrapper */}
      <div className="relative z-10 p-4 md:p-8 font-roboto flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.div
            ref={headerRef}
            className="w-full mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-center text-4xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#E0AFFF] to-[#FFC0CB] tracking-wider"
              style={{ 
                textShadow: "0 0 20px rgba(224, 175, 255, 0.3), 0 0 40px rgba(255, 192, 203, 0.2)" 
              }}
            >
              {event.name}
            </motion.h1>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 mb-8 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          {/* Main content cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Image card - larger on desktop */}
            <motion.div 
              className="lg:col-span-7 rounded-2xl overflow-hidden relative aspect-video lg:aspect-auto lg:min-h-[400px] group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={event?.image || "/placeholder-image.jpg"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                alt={event?.name ? `Image of ${event.name}` : "Event Image"}
                className="transition-all duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent opacity-60"></div>
              
              {/* Event type label */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 z-10">
                <span className="text-white/90 font-medium text-sm">
                  {formatEventType(event.type)}
                </span>
              </div>
            </motion.div>

            {/* Event Info Card */}
            <motion.div 
              className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Event Information</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Date and Time */}
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/70 font-medium">Date & Time</p>
                    <p className="text-xl font-bold text-white mt-1">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-lg text-white/90">
                      {new Date(event.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/70 font-medium">Venue</p>
                    <p className="text-xl font-bold text-white mt-1">{event.venue}</p>
                  </div>
                </motion.div>

                {/* Attendance */}
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/70 font-medium">Attendance</p>
                    <p className="text-xl font-bold text-white mt-1">
                      {event.attendees || "0"} Attending
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Event Description Box */}
          <motion.div 
            ref={descriptionRef}
            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={descriptionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.07)" }}
          >
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Event Details</h2>
            </div>
            
            <div 
              className="text-white/90 text-lg leading-relaxed prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-headings:text-purple-200 prose-strong:text-white prose-strong:font-bold max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }} 
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}