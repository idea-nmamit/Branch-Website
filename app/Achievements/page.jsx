'use client';

import React, { useState, useEffect } from 'react';
import { LinkedinIcon, GithubIcon, InstagramIcon, Award, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('COMPETITION');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const data = await response.json();
        setAchievements(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter(
    (achievement) => achievement.category === selectedCategory
  );

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">Achievements</h1>
        
        {/* Category Selection Tabs */}
        <div className="flex justify-center gap-8 mb-10">
          <button
            className={`text-xl font-medium transition-all duration-300 relative px-4 py-2 ${
              selectedCategory === 'COMPETITION' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setSelectedCategory('COMPETITION')}
          >
            Competition
            {selectedCategory === 'COMPETITION' && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
            )}
          </button>
          
          <button
            className={`text-xl font-medium transition-all duration-300 relative px-4 py-2 ${
              selectedCategory === 'RESEARCH' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setSelectedCategory('RESEARCH')}
          >
            Research
            {selectedCategory === 'RESEARCH' && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
        
        {/* Cards Grid - Changed to 3 columns to make cards larger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg overflow-hidden h-96">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-20 h-20 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-6" />
                </div>
                <Skeleton className="h-32 w-full rounded-md mb-6" />
                <div className="flex justify-center gap-4 mt-6">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center p-8">
              <p className="text-white text-xl">Error: {error}</p>
            </div>
          ) : (
            filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 overflow-hidden border border-white/10 group"
              >
                {/* Achievement Badge */}
                <div className="absolute top-6 right-6 flex items-center">
                  <div className="bg-purple-900/50 p-2 rounded-full backdrop-blur-sm">
                    <Award className="text-yellow-400 animate-pulse" size={24} />
                  </div>
                </div>
                
                {/* Profile Section with Larger Image */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-4 ring-4 ring-purple-600/30 shadow-lg group-hover:ring-purple-500/50 transition-all duration-300"
                    style={achievement.photoUrl ? { backgroundImage: `url(${achievement.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  />
                  <h3 className="text-2xl font-bold text-white mb-1">{achievement.name}</h3>
                  <p className="text-base text-gray-300 mb-2">{achievement.title}</p>
                  {achievement.rank && selectedCategory === 'COMPETITION' && (
                    <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 text-sm font-medium mb-4">
                      Rank: {achievement.rank}
                    </div>
                  )}
                </div>

                {/* Description Card with Improved Design */}
                <div className="text-center bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-xl text-white shadow-lg border border-white/10 mt-6">
                  <p className="text-sm uppercase tracking-wider mb-2 text-purple-300">Description</p>
                  <p className="font-medium">{achievement.description}</p>
                </div>
                
                {/* Research Link with Better Styling */}
                {selectedCategory === 'RESEARCH' && achievement.researchLink && (
                  <div className="mt-4 text-center">
                    <a
                      href={achievement.researchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 bg-blue-900/20 px-4 py-2 rounded-full transition-all hover:bg-blue-800/30"
                    >
                      <ExternalLink size={16} />
                      View Research
                    </a>
                  </div>
                )}
                
                {/* Social Links with Enhanced Styling */}
                <div className="flex justify-center gap-6 mt-6">
                  {achievement.linkedinUrl && (
                    <a 
                      href={achievement.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 p-3 rounded-full hover:bg-blue-800/50 transition-all transform hover:scale-110"
                    >
                      <LinkedinIcon size={22} className="text-blue-300" />
                    </a>
                  )}
                  {achievement.githubUrl && (
                    <a 
                      href={achievement.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 p-3 rounded-full hover:bg-gray-800/50 transition-all transform hover:scale-110"
                    >
                      <GithubIcon size={22} className="text-gray-300" />
                    </a>
                  )}
                  {achievement.instagramUrl && (
                    <a 
                      href={achievement.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 p-3 rounded-full hover:bg-pink-800/50 transition-all transform hover:scale-110"
                    >
                      <InstagramIcon size={22} className="text-pink-300" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;