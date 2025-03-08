'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  // Simulated branches data (should be objects)
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="bg-[#17003A] dark:bg-[#8617C0] p-10">
      <div className="text-2xl text-white mb-5">Events</div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4 ">
        {events.map((event) => (
          <Card key={event.id} className="w-[350px] bg-secondary text-primary shadow-md">
            <CardHeader>
              <CardTitle className="">  
              <div className="w-full h-90 relative">
                      <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
              </CardTitle>
              <hr />
            </CardHeader>
            <CardContent>
              <div className="text-xl flex justify-center flex-col">
                <div className="flex w-full justify-center">
                  <div>{event.name}</div>
                </div>
                <div className="flex w-full justify-center mt-4">
                  <Button>View Event</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
