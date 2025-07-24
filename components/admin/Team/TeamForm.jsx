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
            <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. President, Web Developer, etc."
              required
              className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="index" className="text-gray-700 font-medium">Index</Label>
            <Input
              id="index"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="e.g. 1, 2, 3, etc."
              type="number"
              required
              className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
              defaultValue="OFFICE_BEARERS"
            >
              <SelectTrigger id="category" className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="OFFICE_BEARERS">Office Bearers</SelectItem>
                <SelectItem value="TECH_TEAM">Tech Team</SelectItem>
                <SelectItem value="DESIGN_TEAM">Design Team</SelectItem>
                <SelectItem value="CONTENT_TEAM">Content Team</SelectItem>
                <SelectItem value="MANAGEMENT_TEAM">Management Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="year" className="text-gray-700 font-medium">Year</Label>
            <Select
              value={year}
              onValueChange={setYear}
              required
              defaultValue="2024-25"
            >
              <SelectTrigger id="year" className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="photo" className="text-gray-700 font-medium">Team Member Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedPhoto(e.target.files[0])}
            required
            className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#34006e]/10 file:text-[#34006e] hover:file:bg-[#34006e]/20"
          />
          {selectedPhoto && (
            <p className="text-sm text-[#34006e] bg-[#34006e]/10 p-3 rounded-lg">Photo ready to upload on submit.</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Social Links (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="linkedinUrl" className="text-gray-700 font-medium flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="githubUrl" className="text-gray-700 font-medium flex items-center gap-2">
                <Github className="h-4 w-4 text-gray-800" />
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="instagramUrl" className="text-gray-700 font-medium flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram URL
              </Label>
              <Input
                id="instagramUrl"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/username"
                className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="portfolioUrl" className="text-gray-700 font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                Portfolio URL
              </Label>
              <Input
                id="portfolioUrl"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="h-12 border-gray-200 focus:border-[#34006e] focus:ring-[#34006e] rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="quote" className="text-gray-700 font-medium">Personal Quote</Label>
          <Textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="A short, inspiring quote (optional)"
            rows={3}
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
            'Add Team Member'
          )}
        </Button>
      </form>
    </div>
  )
}

export default TeamForm