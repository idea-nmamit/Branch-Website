'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  LogOut, 
  Calendar, 
  Trophy, 
  Users, 
  Image,
  Plus,
  Activity,
  Database
} from "lucide-react"

const AdminDashboard = ({ activeTab, setActiveTab, onLogout, stats = {} }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch current maintenance mode
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setMaintenance(data.maintenanceMode))
      .catch(() => setMaintenance(false));
  }, []);

  // Toggle maintenance mode
  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: !maintenance })
      });
      const data = await res.json();
      setMaintenance(data.maintenanceMode);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar, 
      color: 'bg-gradient-to-r from-[#17003A] to-[#34006e]',
      count: stats.events || 0
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy, 
      color: 'bg-gradient-to-r from-[#17003A] to-[#34006e]',
      count: stats.achievements || 0
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users, 
      color: 'bg-gradient-to-r from-[#17003A] to-[#34006e]',
      count: stats.team || 0
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: Image, 
      color: 'bg-gradient-to-r from-[#17003A] to-[#34006e]',
      count: stats.gallery || 0
    }
  ]
  const quickStats = [
    {
      label: 'Total Events',
      value: stats.events || 0,
      icon: Calendar,
      color: 'text-[#34006e] bg-[#34006e]/10 border-[#34006e]/20'
    },
    {
      label: 'Achievements',
      value: stats.achievements || 0,
      icon: Trophy,
      color: 'text-[#34006e] bg-[#34006e]/10 border-[#34006e]/20'
    },
    {
      label: 'Team Members',
      value: stats.team || 0,
      icon: Users,
      color: 'text-[#34006e] bg-[#34006e]/10 border-[#34006e]/20'
    },
    {
      label: 'Gallery Items',
      value: stats.gallery || 0,
      icon: Image,
      color: 'text-[#34006e] bg-[#34006e]/10 border-[#34006e]/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#17003A] to-[#34006e] bg-clip-text text-transparent mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your website content and data</p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <Button
            onClick={handleToggle}
            variant={maintenance ? 'destructive' : 'outline'}
            className={maintenance ? 'bg-red-600 text-white hover:bg-red-700 h-12 px-6' : 'border-[#34006e]/30 text-[#34006e] hover:bg-[#34006e]/10 h-12 px-6'}
            disabled={loading}
          >
            {maintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
            <Activity className="ml-2 h-5 w-5" />
          </Button>
          <span className={`text-sm font-semibold ${maintenance ? 'text-red-600' : 'text-green-600'}`}>
            Maintenance Mode: {maintenance ? 'ON' : 'OFF'}
          </span>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 h-12 px-6"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm rounded-2xl hover:scale-105`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Navigation Tabs */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#17003A] to-[#34006e] text-white py-6">
          <CardTitle className="text-2xl text-white font-bold">Content Management</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-8 flex flex-col items-center gap-4 transition-all duration-300 rounded-2xl ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#17003A] to-[#34006e] text-white hover:from-[#1a0040] hover:to-[#3a0077] shadow-xl transform scale-105' 
                      : 'hover:bg-[#34006e]/5 border-[#34006e]/20 hover:border-[#34006e]/40 hover:shadow-lg'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${
                    isActive ? 'bg-white/20' : 'bg-[#34006e]/10'
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      isActive ? 'text-white' : 'text-[#34006e]'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{tab.label}</div>
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={`mt-3 px-3 py-1 ${
                        isActive ? 'bg-white/20 text-white border-white/30' : 'border-[#34006e]/30 text-[#34006e]'
                      }`}
                    >
                      {tab.count} items
                    </Badge>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
