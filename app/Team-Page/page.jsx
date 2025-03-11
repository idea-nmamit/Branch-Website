'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/repcard'; // Adjust path if different

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('Branch Representatives');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example dataset (temporary)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Simulating fetch delay
        setLoading(true);
        const data = [
          {
            id: 1,
            name: 'Alice Johnson',
            designation: 'CSE Rep',
            category: 'Branch Representatives',
            year: '2024',
            bio: 'Leading the branch initiatives.',
            photoUrl: '/images/alice.jpg',
            linkedinUrl: 'https://linkedin.com/in/alice',
            githubUrl: '',
            instagramUrl: 'https://instagram.com/alice',
          },
          {
            id: 2,
            name: 'Bob Smith',
            designation: 'ECE Rep',
            category: 'Branch Representatives',
            year: '2023',
            bio: 'Organizing events and managing team.',
            photoUrl: '/images/bob.jpg',
            linkedinUrl: '',
            githubUrl: 'https://github.com/bob',
            instagramUrl: '',
          },
          {
            id: 3,
            name: 'Charlie Dev',
            designation: 'Frontend Developer',
            category: 'Tech-team',
            year: '2024',
            techTeamLink: 'https://github.com/charlie/project',
          },
          {
            id: 4,
            name: 'Dana Dev',
            designation: 'Backend Developer',
            category: 'Tech-team',
            year: '2023',
            techTeamLink: 'https://github.com/dana/api-project',
          }
        ];
        setTeamMembers(data);
      } catch (err) {
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const years = [...new Set(teamMembers.map((member) => member.year))].sort().reverse();

  const filteredMembers = teamMembers.filter(
    (member) => member.category === selectedCategory && member.year === selectedYear
  );

  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4] min-h-screen p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Our Team</h1>

        {/* Category Switch */}
        <div className="flex justify-center gap-6 mb-4">
          <button
            className={`text-lg font-medium ${selectedCategory === 'Branch Representatives' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('Branch Representatives')}
          >
            Branch Representatives
          </button>
          <button
            className={`text-lg font-medium ${selectedCategory === 'Tech-team' ? 'underline text-white' : 'text-gray-400'}`}
            onClick={() => setSelectedCategory('Tech-team')}
          >
            Tech-team
          </button>
        </div>

        {/* Year Switch */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {years.map((year) => (
            <button
              key={year}
              className={`text-sm px-3 py-1 rounded-full border ${
                selectedYear === year ? 'bg-white text-black' : 'border-white text-white'
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
          <p className="text-white">No members found for this year and category.</p>
        ) : selectedCategory === 'Branch Representatives' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                name={member.name}
                designation={member.designation}
                bio={member.bio}
                photoUrl={member.photoUrl}
                linkedinUrl={member.linkedinUrl}
                githubUrl={member.githubUrl}
                instagramUrl={member.instagramUrl}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white text-black rounded-xl shadow-lg p-4 text-left"
              >
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm mb-2">{member.designation}</p>
                {member.techTeamLink && (
                  <a
                    href={member.techTeamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
