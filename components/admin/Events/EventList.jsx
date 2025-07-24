import React from 'react'
import Image from 'next/image'
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EventList = ({ events }) => {
  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      return dateString
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No events have been submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                {event.image && (
                  <div className="w-full h-40 relative">
                    <Image 
                      src={event.image} 
                      alt={event.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                  {/* Display the event type */}
                  {event.type && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Type:</span>{" "}                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.type === "TECHNICAL" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {event.type}
                      </span>
                    </p>
                  )}
                  <p className="text-sm mb-1"><span className="font-medium">Venue:</span> {event.venue}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Date:</span> {formatEventDate(event.date)}</p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Time:</span>{" "}
                    {event.date ? format(new Date(event.date), "h:mm a") : ""}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EventList
