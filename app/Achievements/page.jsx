'use client';

import React, { useState, useEffect } from 'react';
import { LinkedinIcon, GithubIcon, InstagramIcon, Award } from 'lucide-react';


// const achievementsData = [
//   {
//     name: 'John',
//     description: 'Won first place in Google Hackfest.',
//     category: 'Competition',
//   },
//   {
//     name: 'Riya',
//     description: 'Won first place in Google Hackfest.',
//     category: 'Competition',
//   },
//   {
//     name: 'Kareena',
//     description: 'Won first place in Google Hackfest.',
//     category: 'Research',
//   },
//   {
//     name: 'Kajol',
//     description: 'Won first place in Google Hackfest.',
//     category: 'Research',
//   },
// ];

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

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-[#17003A] to-[#370069] flex items-center justify-center"><p className="text-white">Loading achievements...</p></div>;

  if (error) return <div className="min-h-screen bg-gradient-to-br from-[#17003A] to-[#370069] flex items-center justify-center"><p className="text-white">Error: {error}</p></div>;



  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Achievements</h1>
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`text-lg font-medium ${selectedCategory === 'COMPETITION' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('COMPETITION')}
          >
            Competition
          </button>
          <button
            className={`text-lg font-medium ${selectedCategory === 'RESEARCH' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('RESEARCH')}
          >
            Research
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 overflow-hidden"
            >
              <div className="absolute top-4 right-4 flex items-center">
                <Award className="text-yellow-400 animate-pulse" size={20} />
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-2"
                  style={achievement.photoUrl ? { backgroundImage: `url(${achievement.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                />
                <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                <p className="text-sm text-gray-300">{achievement.title}</p>
                {achievement.rank && selectedCategory === 'COMPETITION' && (
                  <p className="text-xs text-yellow-400 mt-1">Rank: {achievement.rank}</p>
                )}
              </div>

              <div className="text-center bg-white/20 p-3 rounded-md text-white text-sm font-medium mt-4 shadow-md">
                <p>Description</p>
                <p className="font-bold">{achievement.description}</p>
              </div>
              {selectedCategory === 'RESEARCH' && achievement.researchLink && (
                <div className="mt-2 text-center">
                  <a
                    href={achievement.researchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    View Research
                  </a>
                </div>
              )}
              <div className="flex justify-center gap-3 mt-4">
                {achievement.linkedinUrl && (
                  <a href={achievement.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon size={20} className="cursor-pointer hover:text-blue-500 transition-all" />
                  </a>
                )}
                {achievement.githubUrl && (
                  <a href={achievement.githubUrl} target="_blank" rel="noopener noreferrer">
                    <GithubIcon size={20} className="cursor-pointer hover:text-gray-400 transition-all" />
                  </a>
                )}
                {achievement.instagramUrl && (
                  <a href={achievement.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon size={20} className="cursor-pointer hover:text-pink-500 transition-all" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
