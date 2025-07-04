'use client'

import React, { useState } from 'react'
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
import { Github, Linkedin, Instagram, Globe } from "lucide-react"

const TeamForm = ({ onTeamMemberAdded }) => {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [category, setCategory] = useState('OFFICE_BEARERS')
  const [index, setIndex] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [year, setYear] = useState('2024-25')
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
      console.error('Photo upload failed:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      let uploadedPhotoURL = ''

      if (selectedPhoto) {
        uploadedPhotoURL = await uploadToCloudinary(selectedPhoto)
        if (!uploadedPhotoURL) {
          setError("Photo upload failed. Please try again.")
          setLoading(false)
          return
        }
      } else {
        setError("Team member photo is required.")
        setLoading(false)
        return
      }
//team 
      const teamMemberData = {
        name,
        role,
        category,
        index,
        photoUrl: uploadedPhotoURL,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        instagramUrl: instagramUrl || null,
        portfolioUrl: portfolioUrl || null,
        year,
        quote: quote || null,
      }

      const response = await fetch('/api/Team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Clone the response before attempting to read it
        const responseClone = response.clone();
        
        // First try to get error as JSON
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Failed to save team member. Status: ${response.status}`;
        } catch (e) {
          // If JSON parsing fails, use text response from the cloned response
          const errorText = await responseClone.text();
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is OK
      const responseData = await response.json();

      setSuccessMessage('Team Member Added Successfully!')

      // Reset form fields
      setName('')
      setRole('')
      setIndex(null)
      setCategory('OFFICE_BEARERS')
      setSelectedPhoto(null)
      setLinkedinUrl('')
      setGithubUrl('')
      setInstagramUrl('')
      setPortfolioUrl('')
      setYear('2024-25')
      setQuote('')

      // Notify parent component that a team member was added
      if (onTeamMemberAdded) {
        onTeamMemberAdded()
      }
    } catch (error) {
      console.error('Error saving team member:', error)
      setError(error.message || 'Failed to save team member. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (          <Alert className="mb-6 border-green-600">
            <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. President, Web Developer, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Index</Label>
            <Input
              id="index"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="e.g. 1, 2, 3, etc."
              type="number"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
              defaultValue="OFFICE_BEARERS"
            >
          
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select team category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OFFICE_BEARERS">OFFICE BEARERS</SelectItem>
                <SelectItem value="DEV_TEAM">DEV TEAM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedPhoto(e.target.files[0])}
              required
            />
            {selectedPhoto && (
              <p className="text-sm text-primary">Photo ready to upload on submit.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Academic Year</Label>
            <Select
              value={year}
              onValueChange={setYear}
              required
              defaultValue="2024-25"
            >
              <SelectTrigger id="year" className="w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Social Media URLs */}
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">
              <Linkedin className="inline mr-2 h-4 w-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedinUrl"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">
              <Github className="inline mr-2 h-4 w-4" />
              GitHub URL
            </Label>
            <Input
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramUrl">
              <Instagram className="inline mr-2 h-4 w-4" />
              Instagram URL
            </Label>
            <Input
              id="instagramUrl"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/username (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">
              <Globe className="inline mr-2 h-4 w-4" />
              Portfolio URL
            </Label>
            <Input
              id="portfolioUrl"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Personal Quote</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="A short, inspiring quote (optional)"
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Team Member"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default TeamForm