'use client'
import React, { useState, useEffect } from 'react'
import EventForm from '@/components/admin/Events/EventForm'
import EventList from '@/components/admin/Events/EventList'
import AchievementsForm from '@/components/admin/Achievements/achievements_form'
import TeamForm from '@/components/admin/Team/TeamForm'

const AdminPage = () => {
  const [events, setEvents] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [activeTab, setActiveTab] = useState('events')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        setError('Failed to fetch events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to fetch events: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamMembers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/Team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        setError('Failed to fetch team members')
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
      setError('Failed to fetch team members: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch the appropriate data based on the active tab
    if (activeTab === 'events') {
      fetchEvents()
    } else if (activeTab === 'team') {
      fetchTeamMembers()
    }
  }, [activeTab])

  const handleEventAdded = () => {
    fetchEvents()
  }

  const handleTeamMemberAdded = () => {
    fetchTeamMembers()
  }

  const renderNavigation = () => {
    return (
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'events'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600 hover:text-blue-500'
            }`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'achievements'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600 hover:text-blue-500'
            }`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'team'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600 hover:text-blue-500'
            }`}
          onClick={() => setActiveTab('team')}
        >
          Team
        </button>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <p className="text-center py-4">Loading...</p>
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'events':
        return (
          <>
            <EventForm onEventAdded={handleEventAdded} />
            <EventList events={events} />
          </>
        )
      case 'achievements':
        return (
          <>
            <AchievementsForm />
            {/* onAchievementAdded={handleEventAdded} */}
          </>
        )
      case 'team':
        return <TeamForm />
      default:
        return null
    }
  }

  return (
    <div className="container p-6 mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {renderNavigation()}
      {renderContent()}
    </div>
  )
}

export default AdminPage