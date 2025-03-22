'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const REFRESH_INTERVAL = 30 * 60 * 1000;

  const fetchNewsFromAPI = async (forceRefresh = false) => {
    try {
      setLoading(true);

      const cachedData = localStorage.getItem('newsCache');
      const cachedTimestamp = localStorage.getItem('newsCacheTimestamp');

      if (
        !forceRefresh &&
        cachedData &&
        cachedTimestamp &&
        (Date.now() - parseInt(cachedTimestamp)) < REFRESH_INTERVAL
      ) {
        console.log('Using cached news data');
        setNewsItems(JSON.parse(cachedData));
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const dbResponse = await fetch('/api/news');

        if (dbResponse.ok) {
          const dbNews = await dbResponse.json();


          if (dbNews.length > 0 && dbNews[0].date) {

            const newestArticleDate = new Date(Math.max(...dbNews.map(item => new Date(item.date))));

            if ((Date.now() - newestArticleDate.getTime()) < REFRESH_INTERVAL && !forceRefresh) {
              console.log('Using database news data');
              setNewsItems(dbNews);

              localStorage.setItem('newsCache', JSON.stringify(dbNews));
              localStorage.setItem('newsCacheTimestamp', Date.now().toString());

              setError(null);
              setLoading(false);
              return;
            }
          }
        }
      } catch (dbErr) {
        console.error('Error checking database for news:', dbErr);
      }


      console.log('Fetching fresh news data');

      // Step 1: Fetch new data from GNews API
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const response = await fetch(`https://gnews.io/api/v4/search?q=education&lang=en&country=in&max=10&apikey=${apiKey}`);

      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }

      const data = await response.json();

      if (!data.articles) {
        throw new Error('API returned an error or invalid data format');
      }

      // Map the GNews data structure to our format
      const mappedResults = data.articles.map(item => ({
        title: item.title,
        description: item.description,
        photoUrl: item.image,
        link: item.url,
        date: item.publishedAt
      }));

      // Step 2: Clear existing news data from the database
      try {
        const deleteResponse = await fetch('/api/news', {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          console.warn('Failed to delete existing news items:', deleteResponse.statusText);
        } else {
          console.log('Successfully deleted existing news items');
        }
      } catch (deleteErr) {
        console.error('Error deleting existing news:', deleteErr);
      }

      // Step 3: Save new items to database
      const savedItems = await Promise.all(mappedResults.map(async (newsItem) => {
        try {
          const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsItem),
          });

          if (!response.ok) {
            throw new Error('Failed to save news item');
          }

          return await response.json();
        } catch (err) {
          console.error('Error saving news item:', err);
          return null;
        }
      }));

      // Filter out any failed saves
      const validSavedItems = savedItems.filter(item => item !== null);
      console.log('Items saved to DB:', validSavedItems.length);

      // Update local cache
      localStorage.setItem('newsCache', JSON.stringify(validSavedItems));
      localStorage.setItem('newsCacheTimestamp', Date.now().toString());

      // Update state with new items
      setNewsItems(validSavedItems);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error in news refresh cycle:', err);
      setError('Failed to load news. Please try again later.');
      setLoading(false);

      // Fallback to existing database content if API fetch fails
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const dbNews = await response.json();
          if (dbNews.length > 0) {
            setNewsItems(dbNews);
            setError('Could not fetch fresh news. Showing existing content.');
          }
        }
      } catch (dbErr) {
        console.error('Error fetching from database:', dbErr);
      }
    }
  };

  useEffect(() => {
    fetchNewsFromAPI();

    // Set up refresh interval
    const interval = setInterval(() => fetchNewsFromAPI(true), REFRESH_INTERVAL);

    // Clean up on component unmount
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] min-h-screen p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Latest Education News</h1>


        {error && (
          <div className="bg-red-500/20 text-red-100 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

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
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={item.photoUrl || '/placeholder-news.jpg'}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/placeholder-news.jpg'; // Fallback image on error
                    }}
                  />
                </div>

                {/* Published Date */}
                <div className="mt-4 text-xs text-purple-300">
                  {formatDate(item.date)}
                </div>

                {/* Title */}
                <h2 className="mt-2 text-xl font-bold text-white group-hover:text-purple-200 transition-all duration-300">
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
                      className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-all text-sm"
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