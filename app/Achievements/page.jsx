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
            className={`text-xl font-medium transition-all duration-300 relative px-4 py-2 ${selectedCategory === 'COMPETITION'
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
            className={`text-xl font-medium transition-all duration-300 relative px-4 py-2 ${selectedCategory === 'RESEARCH'
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg overflow-hidden h-96">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-6" />
                <Skeleton className="h-32 w-full rounded-md mb-6" />
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
                {/* Profile Section with Larger Image */}
                <div className="w-full h-40 bg-gradient-to-r from-purple-400 to-blue-400 rounded-t-2xl overflow-hidden" 
                  style={achievement.photoUrl ? { backgroundImage: `url(${achievement.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                </div>
                
                {/* Achievement Badge in Front of Name */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="relative">
                    <Award className="text-yellow-400 animate-pulse" size={24} />
                    {achievement.rank && selectedCategory === 'COMPETITION' && (
                      <span className="absolute -top-2 right-4 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded-full">
                        #{achievement.rank}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{achievement.name}</h3>
                </div>
                <p className="text-base text-gray-300 text-center mb-2">{achievement.title}</p>
                
                {/* Description Card */}
                <div className="text-center bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-xl text-white shadow-lg border border-white/10 mt-6">
                  <p className="text-sm uppercase tracking-wider mb-2 text-purple-300">Description</p>
                  <p className="font-medium">{achievement.description}</p>
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
