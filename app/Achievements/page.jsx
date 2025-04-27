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
    <div className="min-h-screen bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Achievements
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          {['COMPETITION', 'RESEARCH'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

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
