'use client';

import React, { useState, useEffect } from 'react';
import { LinkedinIcon, GithubIcon, InstagramIcon, Award, NotebookText, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

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
        <motion.div
          className="flex justify-center mb-10 md:mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-full p-1.5 flex shadow-xl">
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'COMPETITION'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              onClick={() => setSelectedCategory('COMPETITION')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Competition
            </motion.button>
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'RESEARCH'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              onClick={() => setSelectedCategory('RESEARCH')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Research
            </motion.button>
          </div>
        </motion.div>

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
                className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 overflow-hidden border border-white/10 group h-auto"
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
                      <span className="absolute -top-2 right-3 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded-full">
                        #{achievement.rank}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{achievement.title}</h3>
                </div>
                <p className="text-base text-gray-300 text-center mb-2">{achievement.name}</p>

                {/* Description Card */}
                <div className="text-center bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-xl text-white shadow-lg border border-white/10 mt-6">
                  <p className="text-sm uppercase tracking-wider mb-2 text-purple-300">Description</p>
                  <p className="font-medium">{achievement.description}</p>
                </div>

                {/* Social Media and Research Links */}
                {(achievement.linkedinUrl || achievement.githubUrl || achievement.instagramUrl || achievement.researchLink) && (
                  <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    {achievement.linkedinUrl && (
                      <a
                        href={achievement.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                        aria-label="LinkedIn Profile"
                      >
                        <LinkedinIcon size={20} className="text-blue-300" />
                      </a>
                    )}

                    {achievement.githubUrl && (
                      <a
                        href={achievement.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon size={20} className="text-gray-300" />
                      </a>
                    )}

                    {achievement.instagramUrl && (
                      <a
                        href={achievement.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                        aria-label="Instagram Profile"
                      >
                        <InstagramIcon size={20} className="text-pink-300" />
                      </a>
                    )}

                    {achievement.researchLink && (
                      <a
                        href={achievement.researchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
                        aria-label="Research Paper"
                      >
                        <NotebookText size={20} className="text-green-300" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;