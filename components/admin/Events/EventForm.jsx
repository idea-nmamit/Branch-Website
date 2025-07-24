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
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-gray-700 font-medium">Event Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="type" className="text-gray-700 font-medium">Type</Label>
            <Select
              value={type}
              onValueChange={setType}
              required
              defaultValue="TECHNICAL"
            >
              <SelectTrigger id="type" className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="TECHNICAL">TECHNICAL</SelectItem>
                <SelectItem value="NON_TECHNICAL">NON-TECHNICAL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="venue" className="text-gray-700 font-medium">Venue</Label>
          <Input
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
            className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-gray-700 font-medium">Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-gray-200 hover:border-[#34006e] rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {date ? format(new Date(date), "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl">
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

          <div className="space-y-3">
            <Label htmlFor="time" className="text-gray-700 font-medium">Time</Label>
            <div className="relative">
              <Clock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-12 pl-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="attendees" className="text-gray-700 font-medium">Number of Attendees</Label>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              id="attendees"
              type="number"
              min="0"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="h-12 pl-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
              placeholder="Enter expected number of attendees"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="image" className="text-gray-700 font-medium">Event Image</Label>
          <Input
            id="image"
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            required
            className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#34006e]/10 file:text-[#34006e] hover:file:bg-[#34006e]/20"
          />
          {selectedImage && (
            <p className="text-sm text-[#34006e] bg-[#34006e]/10 p-3 rounded-lg">Image ready to upload on submit.</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#17003A] to-[#34006e] hover:from-[#1a0040] hover:to-[#3a0077] text-white font-medium shadow-lg h-12 rounded-xl text-lg transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            'Submit Event'
          )}
        </Button>
      </form>
    </div>
  )
}

export default EventForm