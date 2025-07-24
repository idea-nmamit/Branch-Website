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
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      count: stats.events || 0
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy, 
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      count: stats.achievements || 0
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users, 
      color: 'bg-gradient-to-r from-emerald-500 to-green-600',
      count: stats.team || 0
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: Image, 
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      count: stats.gallery || 0
    }
  ]
  const quickStats = [
    {
      label: 'Total Events',
      value: stats.events || 0,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      label: 'Achievements',
      value: stats.achievements || 0,
      icon: Trophy,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      label: 'Team Members',
      value: stats.team || 0,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Gallery Items',
      value: stats.gallery || 0,
      icon: Image,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    }
  ]

  return (
    <div className="space-y-6">      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your website content and data</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button
            onClick={handleToggle}
            variant={maintenance ? 'destructive' : 'outline'}
            className={maintenance ? 'bg-red-600 text-white hover:bg-red-700' : ''}
            disabled={loading}
          >
            {maintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
            <Activity className="ml-2 h-4 w-4" />
          </Button>
          <span className={`text-xs font-semibold ${maintenance ? 'text-red-600' : 'text-green-600'}`}>Maintenance Mode: {maintenance ? 'ON' : 'OFF'}</span>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 mt-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={`hover:shadow-lg transition-all duration-200 border ${stat.color.split(' ')[2]} bg-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>      {/* Navigation Tabs */}
      <Card className="bg-white shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <CardTitle className="text-xl text-slate-800">Content Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-6 flex flex-col items-center gap-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg transform scale-105' 
                      : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    isActive ? 'bg-white/20' : tab.color
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isActive ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{tab.label}</div>
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={`mt-2 ${
                        isActive ? 'bg-white/20 text-white border-white/30' : 'border-slate-300 text-slate-600'
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
