"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns";
import { cn } from "@/lib/utils"

const AchievementsForm = () => {
  // { onAchievementAdded }
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [category, setCategory] = useState("COMPETITION");
  const [rank, setRank] = useState("");
  const [date, setDate] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [githubUrl, setGithubUrl] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState(null);
  const [researchLink, setResearchLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("");

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

      if (photoUrl) {
        uploadedImageURL = await uploadToCloudinary(photoUrl)
        if (!uploadedImageURL) {
          setError("Image upload failed. Please try again.")
          setLoading(false)
          return
        }
      }

      const eventData = {
        name,
        title,
        description,
        photoUrl: uploadedImageURL,
        category,
        rank: rank ? parseInt(rank) : null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
        researchLink: researchLink || null,
        date: date || new Date().toISOString().split('T')[0],
      }


      const response = await fetch('/api/achievements', {
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

      setSuccessMessage('Achievement Submitted Successfully!')
      // Reset form
      setName("");
      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setCategory("COMPETITION");
      setRank("");
      setDate("");
      setSelectedDate(null);
      setGithubUrl("");
      setLinkedinUrl("");
      setInstagramUrl("");
      setResearchLink("");

  
    } catch (error) {
      console.error("Error submitting achievement:", error);
      setError(error.message || "Failed to submit achievement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Achievement</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-green-600 dark:border-green-400">
            <AlertDescription className="text-green-600 dark:text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL </Label>
            <Input
              id="photoUrl"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoUrl(e.target.files[0])}
              required={!photoUrl || typeof photoUrl === 'string'}
            />          </div>

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

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Category </Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPETITION">Competition</SelectItem>
                <SelectItem value="RESEARCH">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Rank (Optional)</Label>
            <Select
              value={rank}
              onValueChange={setRank}
            >
              <SelectTrigger id="rank" className="w-full">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
            <Input id="githubUrl" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
            <Input id="linkedinUrl" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL (Optional)</Label>
            <Input id="instagramUrl" type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
          </div>

          {category === "RESEARCH" && (
            <div className="space-y-2">
              <Label htmlFor="researchLink">Research Link(Optional)</Label>
              <Input id="researchLink" type="url" value={researchLink} onChange={(e) => setResearchLink(e.target.value)} />
            </div>
          )}


          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Achievement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AchievementsForm;
