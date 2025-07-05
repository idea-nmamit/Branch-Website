'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  NotebookText,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  Users,
  Calendar,
  MapPin,
  Award,
  ExternalLink,
} from 'lucide-react';

const Page = () => {
  const [selectedType, setSelectedType] = useState('ALL');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMemberIndex, setCurrentMemberIndex] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        const data = await response.json();
        setAchievements(data);
        
        const initialIndexes = {};
        data.forEach(achievement => {
          initialIndexes[achievement.id] = 0;
        });
        setCurrentMemberIndex(initialIndexes);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filtered = achievements.filter((achievement) => {
    const typeMatch = selectedType === 'ALL' || achievement.type === selectedType;
    return typeMatch;
  });

  const nextMember = (achievementId, membersLength) => {
    setCurrentMemberIndex(prev => ({
      ...prev,
      [achievementId]: (prev[achievementId] + 1) % membersLength
    }));
  };

  const prevMember = (achievementId, membersLength) => {
    setCurrentMemberIndex(prev => ({
      ...prev,
      [achievementId]: prev[achievementId] === 0 ? membersLength - 1 : prev[achievementId] - 1
    }));
  };

  const toggleDescription = (achievementId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [achievementId]: !prev[achievementId]
    }));
  };

  const getDefaultAvatar = (memberName, index) => {
    const hash = memberName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarNumber = ((hash + index) % 3) + 1; // Will give us 1, 2, or 3
    return `/Avatar/A${avatarNumber}.png`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      COMPETITION: 'from-yellow-400/20 to-orange-500/20 border-yellow-400/40 text-yellow-200',
      RESEARCH: 'from-emerald-400/20 to-green-500/20 border-emerald-400/40 text-emerald-200',
      SPORTS: 'from-orange-400/20 to-red-500/20 border-orange-400/40 text-orange-200',
      CULTURAL: 'from-pink-400/20 to-purple-500/20 border-pink-400/40 text-pink-200',
      TECHNICAL: 'from-blue-400/20 to-indigo-500/20 border-blue-400/40 text-blue-200',
      ACADEMIC: 'from-purple-400/20 to-violet-500/20 border-purple-400/40 text-purple-200',
    };
    return colors[category] || 'from-gray-400/20 to-gray-500/20 border-gray-400/40 text-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17003A] via-[#2A0055] to-[#370069] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-20 md:mb-16 text-center tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Our <span className="text-purple-300">Achievements</span>
        </motion.h1>

        {/* Type Filter */}
        <motion.div
          className="flex justify-center mb-10 md:mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-full p-1.5 flex shadow-xl">
            {['ALL', 'SOLO', 'TEAM'].map((type) => (
              <motion.button
                key={type}
                className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setSelectedType(type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {loading
            ? Array(4)
                .fill(null)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[580px] rounded-3xl bg-white/10 backdrop-blur"
                  />
                ))
            : filtered.length === 0
            ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-9xl mb-8">🏆</div>
                    <h3 className="text-4xl font-bold text-white mb-6">
                      No Achievements Found
                    </h3>
                    <p className="text-white/60 text-xl max-w-lg leading-relaxed">
                      No achievements available in the selected filters yet. Check back soon!
                    </p>
                  </motion.div>
                </div>
              )
            : filtered.map((achievement, index) => {
                const currentMember = achievement.members?.[currentMemberIndex[achievement.id] || 0];
                const hasMultipleMembers = achievement.members?.length > 1;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-3xl overflow-hidden relative group border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40 transition-all duration-300"
                  >
                    {/* Achievement Image */}
                    <div className="relative h-80 overflow-hidden">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${achievement.photoUrl || '/default.jpg'})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Position Badge - Top Center */}
                      {achievement.position && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <div className={`relative px-4 py-2 rounded-full text-sm font-black border-2 backdrop-blur-xl shadow-2xl ${
                            achievement.position === '1st' || achievement.position === 'Winner' || achievement.position === 'First' 
                              ? 'bg-gradient-to-r from-yellow-400/90 to-yellow-600/90 border-yellow-300 text-yellow-900'
                              : achievement.position === '2nd' || achievement.position === 'Second'
                              ? 'bg-gradient-to-r from-gray-300/90 to-gray-500/90 border-gray-200 text-gray-900'
                              : achievement.position === '3rd' || achievement.position === 'Third'
                              ? 'bg-gradient-to-r from-amber-600/90 to-amber-800/90 border-amber-400 text-amber-100'
                              : 'bg-gradient-to-r from-purple-500/90 to-purple-700/90 border-purple-300 text-white'
                          }`}>
                            <div className="flex items-center gap-2">
                              {(achievement.position === '1st' || achievement.position === 'Winner' || achievement.position === 'First') && (
                                <span className="text-lg">🥇</span>
                              )}
                              {(achievement.position === '2nd' || achievement.position === 'Second') && (
                                <span className="text-lg">🥈</span>
                              )}
                              {(achievement.position === '3rd' || achievement.position === 'Third') && (
                                <span className="text-lg">🥉</span>
                              )}
                              <span className="tracking-wide">{achievement.position}</span>
                            </div>
                            {/* Glow effect for winners */}
                            {(achievement.position === '1st' || achievement.position === 'Winner' || achievement.position === 'First') && (
                              <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-lg -z-10 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Category Tag */}
                      <div className={`absolute top-4 left-4 px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-xl ${getCategoryColor(achievement.category)} shadow-xl`}>
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3 h-3" />
                          {achievement.category}
                        </div>
                      </div>
                      
                      {/* Enhanced Type Badge */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl rounded-xl px-3 py-2 flex items-center gap-1.5 border border-white/20 shadow-xl">
                        {achievement.type === 'SOLO' ? (
                          <UserIcon className="w-3 h-3 text-white" />
                        ) : (
                          <Users className="w-3 h-3 text-white" />
                        )}
                        <span className="text-xs font-bold text-white">
                          {achievement.type}
                        </span>
                      </div>

                      {/* Achievement Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-2xl">
                          {achievement.title}
                        </h3>
                        {achievement.event && (
                          <div className="flex items-center gap-2 text-purple-200 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 w-fit">
                            <MapPin className="w-3 h-3" />
                            <p className="text-xs font-medium">{achievement.event}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-6 space-y-5">
                      {/* Achievement Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {achievement.date && (
                          <div className="bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-semibold text-purple-300">Date</span>
                            </div>
                            <p className="text-sm text-white font-medium">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {achievement.location && (
                          <div className="bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span className="text-xs font-semibold text-blue-300">Location</span>
                            </div>
                            <p className="text-sm text-white font-medium line-clamp-1">
                              {achievement.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Description with better styling */}
                      <div className="bg-gradient-to-r from-black/15 to-black/25 rounded-2xl p-4 border border-white/15 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Description</span>
                          </div>
                          {achievement.description && achievement.description.length > 150 && (
                            <button
                              onClick={() => toggleDescription(achievement.id)}
                              className="text-xs text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200 bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-400/30 hover:bg-purple-500/30"
                            >
                              {expandedDescriptions[achievement.id] ? 'Show Less' : 'Show More'}
                            </button>
                          )}
                        </div>
                        <p className={`text-white/90 text-sm leading-relaxed transition-all duration-300 ${
                          expandedDescriptions[achievement.id] ? '' : 'line-clamp-3'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>

                      {/* Enhanced Member Carousel with better styling */}
                      {currentMember && (
                        <div className="bg-gradient-to-br from-white/8 to-white/15 rounded-2xl p-5 border border-white/20 backdrop-blur-sm shadow-inner">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30">
                                <UserIcon className="w-4 h-4 text-purple-300" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">
                                  {hasMultipleMembers ? 'Team Member' : 'Achiever'}
                                </h4>
                                <p className="text-xs text-white/60">
                                  {hasMultipleMembers ? `${achievement.members.length} members` : 'Individual'}
                                </p>
                              </div>
                            </div>
                            {hasMultipleMembers && (
                              <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2 border border-white/15">
                                <button
                                  onClick={() => prevMember(achievement.id, achievement.members.length)}
                                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-all duration-200 border border-white/20"
                                >
                                  <ChevronLeftIcon className="w-3 h-3 text-white" />
                                </button>
                                <span className="text-xs font-bold text-white/90 mx-2 min-w-[2.5rem] text-center">
                                  {(currentMemberIndex[achievement.id] || 0) + 1} / {achievement.members.length}
                                </span>
                                <button
                                  onClick={() => nextMember(achievement.id, achievement.members.length)}
                                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-all duration-200 border border-white/20"
                                >
                                  <ChevronRightIcon className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${achievement.id}-${currentMemberIndex[achievement.id] || 0}`}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -30 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                  <img 
                                    src={getDefaultAvatar(currentMember.name, currentMemberIndex[achievement.id] || 0)} 
                                    alt={currentMember.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-xl"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-bold text-white mb-1">
                                    {currentMember.name}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {currentMember.role && (
                                      <span className="text-xs text-purple-200 font-semibold bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-400/30">
                                        {currentMember.role}
                                      </span>
                                    )}
                                    {currentMember.branch && (
                                      <span className="text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-400/30">
                                        {currentMember.branch}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Enhanced Social Links Grid */}
                              <div className="grid grid-cols-4 gap-2">
                                {currentMember.linkedinUrl && (
                                  <a
                                    href={currentMember.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all duration-200 border border-blue-400/30 shadow-lg group flex items-center justify-center"
                                  >
                                    <LinkedinIcon size={16} className="text-blue-300 group-hover:scale-110 transition-transform" />
                                  </a>
                                )}
                                {currentMember.githubUrl && (
                                  <a
                                    href={currentMember.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-gray-500/20 rounded-xl hover:bg-gray-500/30 transition-all duration-200 border border-gray-400/30 shadow-lg group flex items-center justify-center"
                                  >
                                    <GithubIcon size={16} className="text-white group-hover:scale-110 transition-transform" />
                                  </a>
                                )}
                                {currentMember.instagramUrl && (
                                  <a
                                    href={currentMember.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-pink-500/20 rounded-xl hover:bg-pink-500/30 transition-all duration-200 border border-pink-400/30 shadow-lg group flex items-center justify-center"
                                  >
                                    <InstagramIcon size={16} className="text-pink-300 group-hover:scale-110 transition-transform" />
                                  </a>
                                )}
                                {currentMember.portfolioUrl && (
                                  <a
                                    href={currentMember.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-green-500/20 rounded-xl hover:bg-green-500/30 transition-all duration-200 border border-green-400/30 shadow-lg group flex items-center justify-center"
                                  >
                                    <ExternalLink size={16} className="text-green-300 group-hover:scale-110 transition-transform" />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Enhanced Achievement Links */}
                      {(achievement.githubUrl || achievement.researchLink || achievement.projectUrl || achievement.certificateUrl) && (
                        <div className="border-t border-white/20 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Links & Resources</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {achievement.githubUrl && (
                              <a
                                href={achievement.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-gray-500/20 rounded-xl hover:bg-gray-500/30 transition-all duration-200 border border-gray-400/30 shadow-lg"
                                title="GitHub Repository"
                              >
                                <div className="flex items-center gap-3">
                                  <GithubIcon size={18} className="text-white group-hover:text-gray-300" />
                                  <span className="text-sm font-medium text-white">Code</span>
                                </div>
                              </a>
                            )}
                            {achievement.researchLink && (
                              <a
                                href={achievement.researchLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-green-500/20 rounded-xl hover:bg-green-500/30 transition-all duration-200 border border-green-400/30 shadow-lg"
                                title="Research Paper"
                              >
                                <div className="flex items-center gap-3">
                                  <NotebookText size={18} className="text-green-400 group-hover:text-green-300" />
                                  <span className="text-sm font-medium text-white">Paper</span>
                                </div>
                              </a>
                            )}
                            {achievement.projectUrl && (
                              <a
                                href={achievement.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all duration-200 border border-blue-400/30 shadow-lg"
                                title="Project Demo"
                              >
                                <div className="flex items-center gap-3">
                                  <ExternalLink size={18} className="text-blue-400 group-hover:text-blue-300" />
                                  <span className="text-sm font-medium text-white">Demo</span>
                                </div>
                              </a>
                            )}
                            {achievement.certificateUrl && (
                              <a
                                href={achievement.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-4 bg-yellow-500/20 rounded-xl hover:bg-yellow-500/30 transition-all duration-200 border border-yellow-400/30 shadow-lg"
                                title="Certificate"
                              >
                                <div className="flex items-center gap-3">
                                  <Award size={18} className="text-yellow-400 group-hover:text-yellow-300" />
                                  <span className="text-sm font-medium text-white">Certificate</span>
                                </div>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Subtle Decorative Elements */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Page;
