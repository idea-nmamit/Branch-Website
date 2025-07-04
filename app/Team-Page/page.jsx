'use client';

import React, { useState, useEffect, useRef } from 'react';
import Card from '@/components/repcard';
import TCard from '@/components/devcard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('OFFICE_BEARERS');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/Team');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const years = [...new Set(teamMembers.map((member) => member.year))].sort().reverse();

  const filteredMembers = (() => {
    const filtered = teamMembers.filter((member) => member.category === selectedCategory && member.year === selectedYear);
    
    if (selectedCategory === 'DEV_TEAM') {
      const fixedMembers = filtered.filter(member => member.index === 1 || member.index === 2).sort((a, b) => a.index - b.index);
      const shuffleableMembers = filtered.filter(member => member.index !== 1 && member.index !== 2);

      const shuffled = [...shuffleableMembers].sort(() => Math.random() - 0.5);
      
      return [...fixedMembers, ...shuffled];
    } else {
      return filtered.sort((a, b) => a.index - b.index);
    }
  })(); 
  const renderOfficeBearerSkeleton = (index) => (
    <motion.div
      key={`office-skeleton-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full flex justify-center"
    >
      <div className="relative w-full max-w-sm mx-auto">
        <div className="h-96 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
          {/* Role badge skeleton */}
          <Skeleton className="h-6 w-24 rounded-full mb-4" />
            {/* Profile image skeleton */}
          <div className="relative mx-auto mb-6" style={{ width: '120px', height: '120px' }}>
            <Skeleton className="w-full h-full rounded-full" />
            <div className="absolute -bottom-1 -right-1">
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
          
          {/* Content skeletons */}
          <div className="text-center">
            <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
            
            {/* Social links skeleton */}
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
          
          {/* Bottom accent line skeleton */}
          <div className="absolute bottom-0 left-0 right-0">
            <Skeleton className="h-1 w-full rounded-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderDevTeamSkeleton = (index) => (
    <motion.div
      key={`dev-skeleton-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full flex justify-center"
    >
      <div className="relative w-full max-w-sm mx-auto" style={{ minHeight: '380px', height: 'auto' }}>
        <div className="w-full h-full rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-600/30 p-4 sm:p-6">          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded" />
              <Skeleton className="h-3 w-12 sm:h-4 sm:w-16" />
            </div>
            {/* Variable social icons skeleton */}
            <div className="flex space-x-1 sm:space-x-2">
              <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded" />
              <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded" />
            </div>
          </div>{/* Profile section skeleton */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl mb-3 sm:mb-4" />
            <div className="text-center">
              <Skeleton className="h-4 w-28 sm:h-5 sm:w-32 mb-1 mx-auto" />
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24 mx-auto" />
            </div>
          </div>
          
          {/* Quote section skeleton */}
          <div className="bg-black/20 rounded-lg p-3 sm:p-4 border-l-4 border-cyan-400/30 mb-4 sm:mb-6">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <Skeleton className="h-3 w-full sm:h-4 mb-2" />
                <Skeleton className="h-3 w-3/4 sm:h-4" />
              </div>
            </div>
          </div>
          
          {/* Social links skeleton */}
          <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
          </div>
          
          {/* Bottom section skeleton */}
          <div className="absolute bottom-0 left-0 right-0 h-12 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSkeletons = () => {
    if (selectedCategory === 'OFFICE_BEARERS') {
      return Array(6).fill(0).map((_, index) => renderOfficeBearerSkeleton(index));
    } else {
      // For DEV_TEAM, show 2 skeletons on desktop, 6 on mobile/tablet
      return (
        <>
          {/* Desktop view - show only 2 skeletons */}
          <div className="hidden lg:flex lg:justify-center lg:space-x-8 lg:w-full lg:max-w-6xl">
            {Array(2).fill(0).map((_, index) => (
              <div key={`desktop-skeleton-${index}`} className="w-full max-w-sm">
                {renderDevTeamSkeleton(index)}
              </div>
            ))}
          </div>
          
          {/* Mobile/Tablet view - show 6 skeletons */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
            {Array(6).fill(0).map((_, index) => (
              <div key={`mobile-skeleton-${index}`} className="flex justify-center">
                {renderDevTeamSkeleton(index)}
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen pt-20 pb-24 px-4 sm:px-8 font-sans">
      <motion.div
        className="max-w-6xl mx-auto relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Year Dropdown in Top Right */}
        <div className="absolute top-12 sm:top-0 right-1/4 sm:right-0 z-10" ref={dropdownRef}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-purple-900/60 hover:bg-purple-900/80 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-purple-500/30 transition-all duration-300"
            >
              <Calendar size={18} className="text-purple-300" />
              <span className="font-medium">{selectedYear}</span>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} className="text-purple-300" />
              </motion.div>
            </button>

            <AnimatePresence>
              {dropdownOpen && years.length > 0 && (
                <motion.div
                  className="absolute right-0  mt-2 w-48 bg-purple-900/80 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-purple-500/30"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                >
                  {years.map((year, index) => (
                    <motion.button
                      key={year}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className={`w-full text-left px-4 py-3 ${selectedYear === year
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/80 hover:bg-white/10'
                        } transition-colors duration-200`}
                      onClick={() => {
                        setSelectedYear(year);
                        setDropdownOpen(false);
                      }}
                    >
                      {year}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-20 md:mb-16 text-center tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Our <span className="text-purple-300">Team</span>
        </motion.h1>

        {/* Category Switch */}
        <motion.div
          className="flex justify-center mb-10 md:mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-full p-1.5 flex shadow-xl">
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'OFFICE_BEARERS'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              onClick={() => setSelectedCategory('OFFICE_BEARERS')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              OFFICE BEARERS
            </motion.button>
            <motion.button
              className={`text-base md:text-lg font-medium px-5 md:px-8 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === 'DEV_TEAM'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              onClick={() => setSelectedCategory('DEV_TEAM')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              DEV TEAM
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className={`${
                selectedCategory === 'OFFICE_BEARERS' 
                  ? 'grid gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'flex flex-col items-center space-y-12'
              }`}
              style={{
                gridTemplateColumns: selectedCategory === 'OFFICE_BEARERS' 
                  ? 'repeat(auto-fit, minmax(280px, 1fr))'
                  : undefined,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
            >
              {renderSkeletons()}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="bg-red-500/20 border border-red-400 rounded-lg p-6 max-w-md mx-auto backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-red-200 text-center font-medium text-lg">
                {error}
              </p>
              <motion.button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-500/30 hover:bg-red-500/50 text-white py-2.5 px-6 rounded-lg text-base block mx-auto transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : filteredMembers.length === 0 ? (
            <motion.div
              key="empty"
              className="bg-purple-500/20 border border-purple-400 rounded-lg p-8 max-w-md mx-auto text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-white text-lg">No members found for this year and category.</p>
            </motion.div>
          ) : (            <motion.div
              key={`${selectedCategory}-${selectedYear}`}
              className={`${
                selectedCategory === 'OFFICE_BEARERS' 
                  ? 'grid gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'flex flex-col items-center space-y-12'
              }`}
              style={{
                gridTemplateColumns: selectedCategory === 'OFFICE_BEARERS' 
                  ? 'repeat(auto-fit, minmax(280px, 1fr))'
                  : undefined,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
            >
              {selectedCategory === 'OFFICE_BEARERS'
                ? filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                  >
                    <Card
                      name={member.name}
                      imageUrl={member.photoUrl}
                      designation={member.role}
                      linkedin={member.linkedinUrl}
                      github={member.githubUrl}
                      instagram={member.instagramUrl}
                      portfolio={member.portfolioUrl}
                    />
                  </motion.div>
                ))
                : (
                  <>
                    {/* Desktop view - show only 2 cards */}
                    <div className="hidden lg:block w-full max-w-6xl">
                      <div className="grid grid-cols-2 gap-8 justify-items-center">
                        {filteredMembers.slice(0, 2).map((member) => (
                          <motion.div
                            key={member.id}
                            variants={itemVariants}
                            className="w-full max-w-sm"
                          >
                            <TCard
                              name={member.name}
                              role={member.role}
                              quote={member.quote || ''}
                              imageUrl={member.photoUrl}
                              linkedinUrl={member.linkedinUrl}
                              githubUrl={member.githubUrl}
                              instagramUrl={member.instagramUrl}
                              portfolioUrl={member.portfolioUrl}
                            />
                          </motion.div>
                        ))}
                      </div>
                      {filteredMembers.length > 2 && (
                        <motion.div
                          className="mt-8 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <p className="text-white/60 text-sm">
                            Showing 2 of {filteredMembers.length} team members
                          </p>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Mobile/Tablet view - show all cards in single column */}
                    <div className="lg:hidden w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        {filteredMembers.map((member) => (
                          <motion.div
                            key={member.id}
                            variants={itemVariants}
                            className="flex justify-center"
                          >
                            <TCard
                              name={member.name}
                              role={member.role}
                              quote={member.quote || ''}
                              imageUrl={member.photoUrl}
                              linkedinUrl={member.linkedinUrl}
                              githubUrl={member.githubUrl}
                              instagramUrl={member.instagramUrl}
                              portfolioUrl={member.portfolioUrl}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )
              }
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Page;