'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TeamList = ({ teamMembers }) => {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No team members found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={member.photoUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="text-xs mt-1">Category: {member.category}</p>
                <p className="text-xs">Year: {member.year}</p>
                {member.quote && (
                  <p className="text-sm italic mt-2">"{member.quote}"</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
//export
export default TeamList