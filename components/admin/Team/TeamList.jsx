'use client'
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Instagram, Globe } from "lucide-react"

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
                <Image 
                  src={member.photoUrl} 
                  alt={member.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="text-xs mt-1">Category: {member.category}</p>
                <p className="text-xs">Year: {member.year}</p>
                {member.quote && (
                  <p className="text-sm italic mt-2">&quot;{member.quote}&quot;</p>
                )}
                
                {/* Social Media Links */}
                <div className="flex gap-2 mt-3">
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {member.instagramUrl && (
                    <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {member.portfolioUrl && (
                    <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
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