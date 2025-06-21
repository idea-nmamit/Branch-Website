'use client'
import React, { useState, useEffect } from 'react'
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

  const fetchEvents = () => fetchWithErrorHandling('/api/events', setEvents, 'events')
  const fetchTeamMembers = () => fetchWithErrorHandling('/api/Team', setTeamMembers, 'team members')
  const fetchAchievements = () => fetchWithErrorHandling('/api/achievements', setAchievements, 'achievements')
  const fetchGallery = () => fetchWithErrorHandling('/api/gallery', setGallery, 'gallery items')
  const fetchDataForTab = async (tab) => {
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
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDataForTab(activeTab)
    }
  }, [activeTab, isAuthenticated])

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
          <div className="space-y-6">
            <Card className="bg-white shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Add New Event
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EventForm onEventAdded={handleEventAdded} />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Events List ({events.length})
                </CardTitle>              </CardHeader>
              <CardContent className="p-6">
                <EventList events={events} />
              </CardContent>
            </Card>
          </div>
        )
      case 'achievements':
        return (
          <Card className="bg-white shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Add New Achievement
              </CardTitle>
            </CardHeader>            <CardContent className="p-6">
              <AchievementsForm onAchievementAdded={handleAchievementAdded} />
            </CardContent>
          </Card>
        )
      case 'team':
        return (
          <Card className="bg-white shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Add Team Member
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TeamForm onTeamMemberAdded={handleTeamMemberAdded} />
            </CardContent>
          </Card>
        )
      case 'gallery':
        return (
          <Card className="bg-white shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Image className="h-5 w-5 text-purple-600" />
                Gallery Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
