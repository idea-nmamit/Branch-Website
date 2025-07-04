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
import { CalendarIcon, PlusIcon, MinusIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns";
import { cn } from "@/lib/utils"

const AchievementsForm = ({ onAchievementAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [category, setCategory] = useState("COMPETITION");
  const [type, setType] = useState("SOLO");
  const [rank, setRank] = useState("");
  const [event, setEvent] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [githubUrl, setGithubUrl] = useState("");
  const [researchLink, setResearchLink] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("");
  
  // Members array state
  const [members, setMembers] = useState([{
    name: "",
    role: "",
    rollNumber: "",
    year: "",
    branch: "",
    linkedinUrl: "",
    githubUrl: "",
    instagramUrl: "",
    portfolioUrl: ""
  }]);

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

  const addMember = () => {
    setMembers([...members, {
      name: "",
      role: "",
      rollNumber: "",
      year: "",
      branch: "",
      linkedinUrl: "",
      githubUrl: "",
      instagramUrl: "",
      portfolioUrl: ""
    }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

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

      // Process members (no photo processing needed)
      const processedMembers = members.map((member) => ({
        ...member,
        photoUrl: null // Will use default avatars
      }));

      const achievementData = {
        title,
        description,
        photoUrl: uploadedImageURL,
        category,
        type,
        rank: rank ? parseInt(rank) : null,
        event: event || null,
        organizer: organizer || null,
        venue: venue || null,
        githubUrl: githubUrl || null,
        researchLink: researchLink || null,
        projectUrl: projectUrl || null,
        certificateUrl: certificateUrl || null,
        date: date || new Date().toISOString().split('T')[0],
        members: processedMembers.filter(member => member.name.trim() !== '')
      }

      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData),
      })

      const responseText = await response.text()

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to save achievement. Status: ${response.status}`)
      }
      
      setSuccessMessage('Achievement Submitted Successfully!')
      
      // Call the callback to refresh data
      if (onAchievementAdded) {
        onAchievementAdded()
      }
      
      // Reset form
      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setCategory("COMPETITION");
      setType("SOLO");
      setRank("");
      setEvent("");
      setOrganizer("");
      setVenue("");
      setDate("");
      setSelectedDate(null);
      setGithubUrl("");
      setResearchLink("");
      setProjectUrl("");
      setCertificateUrl("");
      setMembers([{
        name: "",
        role: "",
        rollNumber: "",
        year: "",
        branch: "",
        linkedinUrl: "",
        githubUrl: "",
        instagramUrl: "",
        portfolioUrl: ""
      }]);

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
          <Alert className="mb-6 border-green-600">
            <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Achievement Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Achievement Photo *</Label>
              <Input
                id="photoUrl"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoUrl(e.target.files[0])}
                required={!photoUrl || typeof photoUrl === 'string'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPETITION">Competition</SelectItem>
                    <SelectItem value="RESEARCH">Research</SelectItem>
                    <SelectItem value="SPORTS">Sports</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Achievement Type *</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLO">Solo</SelectItem>
                    <SelectItem value="TEAM">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event/Competition Name</Label>
                <Input id="event" value={event} onChange={(e) => setEvent(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organized By</Label>
                <Input id="organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rank">Rank (Optional)</Label>
                <Select value={rank} onValueChange={setRank}>
                  <SelectTrigger id="rank">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st</SelectItem>
                    <SelectItem value="2">2nd</SelectItem>
                    <SelectItem value="3">3rd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Achievement Date *</Label>
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
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links & Resources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository</Label>
                <Input id="githubUrl" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectUrl">Project Demo/Website</Label>
                <Input id="projectUrl" type="url" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category === "RESEARCH" && (
                <div className="space-y-2">
                  <Label htmlFor="researchLink">Research Paper Link</Label>
                  <Input id="researchLink" type="url" value={researchLink} onChange={(e) => setResearchLink(e.target.value)} />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="certificateUrl">Certificate URL</Label>
                <Input id="certificateUrl" type="url" value={certificateUrl} onChange={(e) => setCertificateUrl(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members *</h3>
              <Button type="button" onClick={addMember} variant="outline" size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {members.map((member, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  {members.length > 1 && (
                    <Button 
                      type="button" 
                      onClick={() => removeMember(index)} 
                      variant="outline" 
                      size="sm"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input 
                      value={member.name} 
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role/Position</Label>
                    <Input 
                      value={member.role} 
                      onChange={(e) => updateMember(index, 'role', e.target.value)}
                      placeholder="Team Lead, Developer, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Roll Number</Label>
                    <Input 
                      value={member.rollNumber} 
                      onChange={(e) => updateMember(index, 'rollNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Input 
                      value={member.year} 
                      onChange={(e) => updateMember(index, 'year', e.target.value)}
                      placeholder="2024-25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Branch/Department</Label>
                    <Input 
                      value={member.branch} 
                      onChange={(e) => updateMember(index, 'branch', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input 
                      type="url"
                      value={member.linkedinUrl} 
                      onChange={(e) => updateMember(index, 'linkedinUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input 
                      type="url"
                      value={member.githubUrl} 
                      onChange={(e) => updateMember(index, 'githubUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input 
                      type="url"
                      value={member.instagramUrl} 
                      onChange={(e) => updateMember(index, 'instagramUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Portfolio URL</Label>
                    <Input 
                      type="url"
                      value={member.portfolioUrl} 
                      onChange={(e) => updateMember(index, 'portfolioUrl', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Achievement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AchievementsForm;
