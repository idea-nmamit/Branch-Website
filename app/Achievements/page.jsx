'use client';

import React, { useState } from 'react';
import { LinkedinIcon, GithubIcon, InstagramIcon, Award } from 'lucide-react';


const achievementsData = [
  {
    name: 'John',
    description: 'Won first place in Google Hackfest.',
    category: 'Competition',
  },
  {
    name: 'Riya',
    description: 'Won first place in Google Hackfest.',
    category: 'Competition',
  },
  {
    name: 'Kareena',
    description: 'Won first place in Google Hackfest.',
    category: 'Research',
  },
  {
    name: 'Kajol',
    description: 'Won first place in Google Hackfest.',
    category: 'Research',
  },
];

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('Competition');

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Achievements</h1>
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`text-lg font-medium ${selectedCategory === 'Competition' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('Competition')}
          >
            Competition
          </button>
          <button
            className={`text-lg font-medium ${selectedCategory === 'Research' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('Research')}
          >
            Research
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievementsData
            .filter((achievement) => achievement.category === selectedCategory)
            .map((achievement, index) => (
              <div
                key={index}
                className="relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 overflow-hidden"
              >
                <div className="absolute top-4 right-4 flex items-center">
                  <Award className="text-yellow-400 animate-pulse" size={20} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-2" />
                  <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                </div>
                <div className="text-center bg-white/20 p-3 rounded-md text-white text-sm font-medium mt-4 shadow-md">
                  <p>Description</p>
                  <p className="font-bold">{achievement.description}</p>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <LinkedinIcon size={20} className="cursor-pointer hover:text-blue-500 transition-all" />
                  <GithubIcon size={20} className="cursor-pointer hover:text-gray-400 transition-all" />
                  <InstagramIcon size={20} className="cursor-pointer hover:text-pink-500 transition-all" />
                </div>

              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
