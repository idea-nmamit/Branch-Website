'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const sampleNews = [
  {
    id: 1,
    title: 'AI Revolutionizes Healthcare',
    description: 'AI is assisting doctors in diagnosing and treating complex illnesses with increased accuracy.',
    image: '/news1.jpg',
    link: 'https://example.com/news1',
  },
  {
    id: 2,
    title: 'Breakthrough in Neural Networks',
    description: 'Researchers propose a more efficient architecture for training deep learning models.',
    image: '/news2.jpg',
    link: 'https://example.com/news2',
  },
  {
    id: 3,
    title: 'Quantum Computing Meets AI',
    description: 'The integration of quantum computing and AI opens new doors in computing power.',
    image: '/news3.jpg',
    link: 'https://example.com/news3',
  },
];

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNewsItems(sampleNews);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] min-h-screen p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-10 tracking-tight">Latest News</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading
            ? Array(3)
                .fill()
                .map((_, index) => (
                  <div key={index} className="glass-card h-96">
                    <Skeleton className="w-full h-40 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-6" />
                    <Skeleton className="h-24 w-full rounded-md mb-6" />
                  </div>
                ))
            : newsItems.map((item) => (
                <div
                  key={item.id}
                  className="group glass-card transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden"
                >
                  {/* News Image */}
                  {item.image && (
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="mt-4 text-xl font-bold text-white group-hover:text-purple-200 transition-all duration-300">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mt-2 line-clamp-4">{item.description}</p>

                  {/* Read More */}
                  {item.link && (
                    <div className="flex justify-center mt-6">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-300 hover:text-green-100 transition-all text-sm"
                      >
                        Read More <ExternalLink size={16} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>

      {/* Glass Card Style */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1.5rem;
          transition: all 0.4s ease-in-out;
        }

        .glass-card:hover {
          box-shadow: 0 10px 25px rgba(175, 95, 255, 0.25);
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsPage;
