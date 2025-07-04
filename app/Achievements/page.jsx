'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  NotebookText,
} from 'lucide-react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('COMPETITION');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievements(data);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filtered = achievements.filter(
    (achievement) => achievement.category === selectedCategory
  );

  const rankBadges = {
    1: '/First.png',
    2: '/Second.png',
    3: '/Third.png',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17003A] to-[#370069] px-6 py-12">
      <div className="max-w-6xl mx-auto">        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Achievements
        </h1>

        {/* Category Switch */}
        <motion.div
          className="flex justify-center mb-10 md:mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-full p-1.5 flex shadow-xl">
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${
                selectedCategory === 'COMPETITION'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setSelectedCategory('COMPETITION')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              COMPETITION
            </motion.button>
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${
                selectedCategory === 'RESEARCH'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setSelectedCategory('RESEARCH')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              RESEARCH
            </motion.button>
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(6)
                .fill(null)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-72 rounded-xl bg-white/10 backdrop-blur"
                  />
                ))
            : filtered.length === 0
            ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No Achievements Found
                    </h3>
                    <p className="text-white/60 text-lg">
                      No achievements available in the {selectedCategory.toLowerCase()} category yet.
                    </p>
                  </motion.div>
                </div>
              )
            : filtered.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{
                    scale: 1.02,
                    background:
                      'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(255,255,255,0.05))',
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl overflow-hidden relative group border border-white/10 bg-white/10 backdrop-blur-md shadow-lg transition-all"
                >
                  {/* Image Background */}
                  <div
                    className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${achievement.photoUrl || '/default.jpg'})`,
                    }}
                  >
                    <div className="h-full w-full bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  {/* Animated Rank Badge */}
                  {rankBadges[achievement.rank] && (
                    <motion.img
                      src={rankBadges[achievement.rank]}
                      alt={`Rank ${achievement.rank}`}
                      className="absolute top-2 right-2 w-12 h-12"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-purple-300 mb-1">
                      {achievement.name}
                    </p>
                    <p className="text-sm text-white/80 line-clamp-3">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Social / External Links */}
                  {(achievement.linkedinUrl ||
                    achievement.githubUrl ||
                    achievement.instagramUrl ||
                    achievement.researchLink) && (
                    <div className="flex justify-center gap-4 px-4 pb-4 pt-2 border-t border-white/10">
                      {achievement.linkedinUrl && (
                        <a
                          href={achievement.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        >
                          <LinkedinIcon size={18} className="text-blue-400" />
                        </a>
                      )}
                      {achievement.githubUrl && (
                        <a
                          href={achievement.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        >
                          <GithubIcon size={18} className="text-white" />
                        </a>
                      )}
                      {achievement.instagramUrl && (
                        <a
                          href={achievement.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        >
                          <InstagramIcon
                            size={18}
                            className="text-pink-400"
                          />
                        </a>
                      )}
                      {achievement.researchLink && (
                        <a
                          href={achievement.researchLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        >
                          <NotebookText
                            size={18}
                            className="text-green-400"
                          />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
