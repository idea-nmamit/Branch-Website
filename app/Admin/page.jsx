'use client'
import React, { useState, useEffect } from 'react'
import EventForm from '@/components/admin/Events/EventForm'
import EventList from '@/components/admin/Events/EventList'
import AchievementsForm from '@/components/admin/Achievements/achievements_form'

const AdminPage = () => {
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState('events')

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEventAdded = () => {
    fetchEvents()
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
            <AchievementsForm onAchievementAdded={handleEventAdded} />
          </>
        )

      case 'team':
        return <div className="p-4 bg-gray-100 rounded">Team Tab coming soon</div>
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