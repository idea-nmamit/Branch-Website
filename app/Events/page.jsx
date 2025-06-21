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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="w-full h-60 bg-white/10 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {upcoming
              ? upcomingEvents.length > 0
                ? upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                : NoEvents("No Upcoming Events")
              : completedEvents.length > 0
              ? completedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              : NoEvents("No Completed Events")}
          </div>
        )}
      </div>
    </div>
  );
};

// Event Card Component - Hover Glow + Zoom Animation
const EventCard = ({ event }) => (
  <div className="relative group h-[22em] w-[20em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex flex-col backdrop-blur-[12px] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(147,51,234,0.7)]">
    
    {/* Event Image with Smooth Expansion */}
    <div className="relative w-full h-[65%] rounded-2xl">
      <img
        src={event?.image || "/placeholder.jpg"}
        alt={event?.name || "Event Image"}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-2xl"
      />
    </div>

    {/* Event Title & Description */}
    <div className="flex flex-col items-center flex-grow mt-3">
      <h1 className="text-[1.5em] font-medium text-center">{event?.name || "Event Name"}</h1>

      {/* Next Button */}
      <div className="flex justify-center mt-3">
      <Link href={`/Events/${event.id}`}>
          <div className="btn-content flex items-center px-6 py-2 text-white text-lg md:text-xl font-semibold bg-purple-600 rounded-full shadow-sm shadow-purple-600/50 transition duration-500 hover:shadow-md hover:shadow-purple-600/50 group">
          <span className="font-medium">View Details</span>
          <span className="relative ml-4 transition-all duration-500 group-hover:ml-6">
            <svg width="66" height="43" viewBox="0 0 66 43" xmlns="http://www.w3.org/2000/svg" className="w-8 h-5 scale-75">
              <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path
                  id="arrow-icon-one"
                  d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                  fill="#FFFFFF"
                ></path>
                <path
                  id="arrow-icon-two"
                  d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                  fill="#FFFFFF"
                ></path>
                <path
                  id="arrow-icon-three"
                  d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                  fill="#FFFFFF"
                ></path>
              </g>
            </svg>
          </span>
        </div>
        </Link>
      </div>
    </div>
  </div>
);

// No Events Message
const NoEvents = (message) => (
  <div className="col-span-full text-center py-20 px-50 bg-white/5 backdrop-blur-sm rounded-lg">
    <h3 className="text-2xl font-bold text-white mb-2">{message}</h3>
  </div>
);

export default Page;
