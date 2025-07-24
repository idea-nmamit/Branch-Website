'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { ErrorBoundary, LoadingSpinner } from '@/components/admin/AdminComponents'
import EventForm from '@/components/admin/Events/EventForm'
import EventList from '@/components/admin/Events/EventList'
import AchievementsForm from '@/components/admin/Achievements/achievements_form'
import TeamForm from '@/components/admin/Team/TeamForm'
import GalleryAdmin from '@/components/admin/Gallery/GalleryAdmin'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Trophy, Users, Image } from "lucide-react"

const AdminPage = () => {
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth()
  const [events, setEvents] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [achievements, setAchievements] = useState([])
  const [gallery, setGallery] = useState([])
  const [activeTab, setActiveTab] = useState('events')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    events: 0,
    achievements: 0,
    team: 0,
    gallery: 0
  })  // Fetch functions with better error handling
  const fetchWithErrorHandling = async (url, setter, dataKey) => {
    try {
      setError('')
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataKey}: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setter(data)
      return data
    } catch (error) {
      console.error(`Error fetching ${dataKey}:`, error)
      setError(`Failed to load ${dataKey}. ${error.message}`)
      toast.error(`Failed to load ${dataKey}`)
      return []
    }
  }

  const fetchEvents = useCallback(() => fetchWithErrorHandling('/api/events', setEvents, 'events'), [])
  const fetchTeamMembers = useCallback(() => fetchWithErrorHandling('/api/Team', setTeamMembers, 'team members'), [])
  const fetchAchievements = useCallback(() => fetchWithErrorHandling('/api/achievements', setAchievements, 'achievements'), [])
  const fetchGallery = useCallback(() => fetchWithErrorHandling('/api/gallery', setGallery, 'gallery items'), [])
  
  const fetchDataForTab = useCallback(async (tab) => {
    setLoading(true)
    try {
      switch (tab) {
        case 'events':
          await fetchEvents()
          break
        case 'team':
          await fetchTeamMembers()
          break
        case 'achievements':
          await fetchAchievements()
          break
        case 'gallery':
          await fetchGallery()
          break
        default:
          break
      }
    } finally {
      setLoading(false)
    }
  }, [fetchEvents, fetchTeamMembers, fetchAchievements, fetchGallery])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDataForTab(activeTab)
    }
  }, [activeTab, isAuthenticated, fetchDataForTab])

  // Update stats when data changes
  useEffect(() => {
    setStats({
      events: events.length,
      achievements: achievements.length,
      team: teamMembers.length,
      gallery: gallery.length
    })
  }, [events, achievements, teamMembers, gallery])

  const handleEventAdded = () => {
    fetchEvents()
    toast.success('Event added successfully!')
  }

  const handleTeamMemberAdded = () => {
    fetchTeamMembers()
    toast.success('Team member added successfully!')
  }

  const handleAchievementAdded = () => {
    fetchAchievements()
    toast.success('Achievement added successfully!')
  }

  const handleGalleryUpdated = () => {
    fetchGallery()
    toast.success('Gallery updated successfully!')
  }

  const handleLogin = (password) => {
    const success = login(password)
    if (success) {
      toast.success('Welcome to Admin Dashboard!')
    }
    return success
  }

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully')
  }
  const handleRetry = () => {
    setError('')
    fetchDataForTab(activeTab)
  }
  const renderContent = () => {
    if (error) {
      return (
        <ErrorBoundary 
          error={{ message: error }}
          onRetry={handleRetry}
          onBack={() => setActiveTab('events')}
        />
      )
    }

    if (loading) {
      return <LoadingSpinner message={`Loading ${activeTab}...`} />
    }

    switch (activeTab) {
      case 'events':        return (
          <div className="space-y-8">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Calendar className="h-6 w-6" />
                  Add New Event
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <EventForm onEventAdded={handleEventAdded} />
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Calendar className="h-6 w-6" />
                  Events List ({events.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <EventList events={events} />
              </CardContent>
            </Card>
          </div>
        )
      case 'achievements':
        return (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <Trophy className="h-6 w-6" />
                Add New Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <AchievementsForm onAchievementAdded={handleAchievementAdded} />
            </CardContent>
          </Card>
        )
      case 'team':
        return (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <Users className="h-6 w-6" />
                Add Team Member
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <TeamForm onTeamMemberAdded={handleTeamMemberAdded} />
            </CardContent>
          </Card>
        )
      case 'gallery':
        return (
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-6 w-6" />
                Gallery Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <GalleryAdmin onGalleryUpdated={handleGalleryUpdated} />
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }
  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17003A] to-[#370069]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AdminDashboard 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          stats={stats}
        />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
