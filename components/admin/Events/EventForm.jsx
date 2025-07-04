'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const EventForm = ({ onEventAdded }) => {
  const [name, setName] = useState('')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('TECHNICAL')
  const [attendees, setAttendees] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'))
    }
  }, [selectedDate])

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      let uploadedImageURL = ''

      if (selectedImage) {
        uploadedImageURL = await uploadToCloudinary(selectedImage)
        if (!uploadedImageURL) {
          setError("Image upload failed. Please try again.")
          setLoading(false)
          return
        }
      }

      const eventData = {
        name,
        venue,
        date,
        time,
        description,
        imageURL: uploadedImageURL,
        type,
        attendees,
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      const responseText = await response.text()

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to save event. Status: ${response.status}`)
      }

      setSuccessMessage('Event Submitted Successfully!')

      // Reset form fields
      setName('')
      setVenue('')
      setDate('')
      setSelectedDate(null)
      setTime('')
      setDescription('')
      setSelectedImage(null)
      setType('TECHNICAL')
      setAttendees('')

      // Notify parent component that an event was added
      if (onEventAdded) {
        onEventAdded()
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setError(error.message || 'Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Event</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-green-600">
            <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={setType}
              required
              defaultValue="TECHNICAL"
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECHNICAL">TECHNICAL</SelectItem>
                <SelectItem value="NON_TECHNICAL">NON-TECHNICAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(new Date(date), "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setIsCalendarOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Number of Attendees</Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendees"
                type="number"
                min="0"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="pl-10"
                placeholder="Enter expected number of attendees"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              required
            />
            {selectedImage && (
              <p className="text-sm text-primary">Image ready to upload on submit.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default EventForm