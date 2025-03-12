'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/repcard';
import TCard from '@/components/devcard';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('OFFICE_BEARERS');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
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

  const years = [...new Set(teamMembers.map((member) => member.year))].sort().reverse();

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.category === selectedCategory && member.year === selectedYear
  );

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Our Team</h1>

        {/* Category Switch */}
        <div className="flex justify-center gap-6 mb-4">
          <button
            className={`text-lg font-medium ${
              selectedCategory === 'OFFICE_BEARERS'
                ? 'underline text-white'
                : 'text-gray-400'
            }`}
            onClick={() => setSelectedCategory('OFFICE_BEARERS')}
          >
            OFFICE BEARERS
          </button>
          <button
            className={`text-lg font-medium ${
              selectedCategory === 'DEV_TEAM'
                ? 'underline text-white'
                : 'text-gray-400'
            }`}
            onClick={() => setSelectedCategory('DEV_TEAM')}
          >
            DEV TEAM
          </button>
        </div>

        {/* Year Switch */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {years.map((year) => (
            <button
              key={year}
              className={`text-sm px-3 py-1 rounded-full border ${
                selectedYear === year
                  ? 'bg-white text-black'
                  : 'border-white text-white'
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-white text-lg">Loading team members...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : filteredMembers.length === 0 ? (
          <p className="text-white">
            No members found for this year and category.
          </p>
        ) : selectedCategory === 'OFFICE_BEARERS' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

            {filteredMembers.map((member) => (
             <Card
             key={member.id}
             name={member.name}
             imageUrl={member.photoUrl} 
             designation={member.role}
             linkedin={member.linkedinUrl} 
             github={member.githubUrl} 
             instagram={member.instagramUrl} 
           />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredMembers.map((member) => (
              <Card
              key={member.id}
              name={member.name}
              designation={member.role} 
              bio={member.quote || ''} 
              imageUrl={member.photoUrl}
              linkedinUrl={member.linkedinUrl}
              githubUrl={member.githubUrl}
              instagramUrl={member.instagramUrl}
            />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
