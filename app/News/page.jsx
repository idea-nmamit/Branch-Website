'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const REFRESH_INTERVAL = 1000 * 60 * 60 * 2; // 1 hours

  const fetchNewsFromAPI = async (forceRefresh = false) => {
    try {
      if (!loading) setRefreshing(true);
      setLoading(true);

      const currentTime = Date.now();
      const lastDbFetchTimestamp = localStorage.getItem('lastDbFetchTimestamp');

      const needsFreshData = !lastDbFetchTimestamp ||
        (currentTime - parseInt(lastDbFetchTimestamp)) >= REFRESH_INTERVAL ||
        forceRefresh;

      if (needsFreshData) {
        console.log('refresh data');

        localStorage.removeItem('newsCache');
        localStorage.removeItem('newsCacheTimestamp');

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

        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        const response = await fetch(`https://gnews.io/api/v4/search?q=("Artificial Intelligence" OR "AI" OR "Machine Learning" OR "Data Science" OR (jobs OR hiring OR recruitment OR placements OR careers OR "job openings"))&lang=en&country=us&max=10&apikey=${apiKey}`);

        console.log('fetched new data from GNews API');
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }

        const data = await response.json();
        console.log('Full API Response:', data);

        if (!data.articles) {
          throw new Error('API returned an error or invalid data format');
        }
        console.log('Fetched Articles:', data.articles);

        const mappedResults = data.articles.map(item => ({
          title: item.title,
          description: item.description,
          photoUrl: item.image,
          link: item.url,
          date: item.publishedAt,
          category: assignRandomCategory() // Add random category for demo
        }));
        console.log('mappedResults:', mappedResults);

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

        const validSavedItems = savedItems.filter(item => item !== null);
        console.log('Items saved to DB:', validSavedItems.length);

        setNewsItems(validSavedItems);
        console.log("Updated newsItems state:", validSavedItems);

        localStorage.setItem('newsCache', JSON.stringify(validSavedItems));
        localStorage.setItem('newsCacheTimestamp', currentTime.toString());
        localStorage.setItem('lastDbFetchTimestamp', currentTime.toString());

      } else {
        const cachedData = localStorage.getItem('newsCache');
        const cachedTimestamp = localStorage.getItem('newsCacheTimestamp');

        if (
          cachedData &&
          cachedTimestamp &&
          (currentTime - parseInt(cachedTimestamp)) < REFRESH_INTERVAL
        ) {
          console.log('Using cached news data');
          const parsedData = JSON.parse(cachedData);
          // Ensure we have categories for demo
          const dataWithCategories = parsedData.map(item => ({
            ...item,
            category: item.category || assignRandomCategory()
          }));
          setNewsItems(dataWithCategories);
        } else {
          try {
            const dbResponse = await fetch('/api/news');

            if (dbResponse.ok) {
              const dbNews = await dbResponse.json();

              if (dbNews.length > 0) {
                console.log('Using database news data');
                const newsWithCategories = dbNews.map(item => ({
                  ...item,
                  category: item.category || assignRandomCategory()
                }));
                setNewsItems(newsWithCategories);

                localStorage.setItem('newsCache', JSON.stringify(newsWithCategories));
                localStorage.setItem('newsCacheTimestamp', currentTime.toString());
              } else {
                return fetchNewsFromAPI(true);
              }
            }
          } catch (dbErr) {
            console.error('Error checking database for news:', dbErr);
            return fetchNewsFromAPI(true);
          }
        }
      }

      setError(null);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error in news refresh cycle:', err);
      setError('Failed to load news. Please try again later.');
      setLoading(false);
      setRefreshing(false);

      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const dbNews = await response.json();
          if (dbNews.length > 0) {
            const newsWithCategories = dbNews.map(item => ({
              ...item,
              category: item.category || assignRandomCategory()
            }));
            setNewsItems(newsWithCategories);
            setError('Could not fetch fresh news. Showing existing content.');
          }
        }
      } catch (dbErr) {
        console.error('Error fetching from database:', dbErr);
      }
    }
  };

  // Added function to assign categories for demo purposes
  const assignRandomCategory = () => {
    const categories = ['policy', 'innovation', 'higher-ed', 'k12', 'technology'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  useEffect(() => {
    fetchNewsFromAPI();

    const interval = setInterval(() => {
      console.log("Interval triggered, forcing refresh");
      fetchNewsFromAPI(true);
    }, REFRESH_INTERVAL);

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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    
    // Convert to hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    
    // If older than a day, show days
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'policy': 'from-blue-500 to-blue-700',
      'innovation': 'from-green-500 to-green-700',
      'higher-ed': 'from-purple-500 to-purple-700',
      'k12': 'from-orange-500 to-orange-700',
      'technology': 'from-red-500 to-red-700',
    };
    return colors[category] || 'from-purple-500 to-pink-600';
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      'policy': 'text-blue-400',
      'innovation': 'text-green-400',
      'higher-ed': 'text-purple-400',
      'k12': 'text-orange-400',
      'technology': 'text-red-400',
    };
    return colors[category] || 'text-purple-400';
  };

  const getCategoryName = (category) => {
    const names = {
      'policy': 'Policy',
      'innovation': 'Innovation',
      'higher-ed': 'Higher Education',
      'k12': 'K-12',
      'technology': 'Technology',
    };
    return names[category] || category;
  };

  const filteredNews = activeCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#050415] min-h-screen pb-16 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-700/10 blur-3xl animate-blob"></div>
          <div className="absolute top-[40%] right-[15%] w-72 h-72 rounded-full bg-blue-700/10 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[35%] w-80 h-80 rounded-full bg-pink-700/10 blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header with Title */}
          <div className="py-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Education News
              </span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full my-2"></div>
            <p className="text-purple-200/80 text-center max-w-2xl">
              Stay updated with the latest trends and insights in education
            </p>
          </div>
          
          {/* Category Navigation */}
          <div className="pb-4 flex items-center justify-center space-x-1 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveCategory('all')} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              All News
            </button>
            
            <button 
              onClick={() => setActiveCategory('policy')} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'policy' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Policy
            </button>
            
            <button 
              onClick={() => setActiveCategory('innovation')} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'innovation' 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Innovation
            </button>
            
            <button 
              onClick={() => setActiveCategory('k12')} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'k12' 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-800 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              K-12
            </button>
            
            <button 
              onClick={() => setActiveCategory('technology')} 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === 'technology' 
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Technology
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {error && (
          <div className="bg-red-500/20 text-red-100 p-4 rounded-lg mb-8 border border-red-500/30 backdrop-blur-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-12">
            {/* Featured News Skeleton */}
            <div className="neo-card">
              <div className="lg:flex gap-8">
                <Skeleton className="w-full lg:w-2/3 h-[300px] rounded-xl" />
                <div className="w-full lg:w-1/3 mt-6 lg:mt-0 space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>

            {/* News Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array(6).fill().map((_, index) => (
                <div key={index} className="neo-card">
                  <Skeleton className="w-full h-48 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-24 w-full rounded-md mb-4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Breaking News Ticker */}
            <div className="w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-2 text-white font-bold flex items-center gap-1 whitespace-nowrap">
                  <TrendingUp size={14} /> TRENDING
                </div>
                <div className="py-2 px-4 relative overflow-hidden w-full">
                  <div className="ticker-tape">
                    {newsItems.slice(0, 5).map((item, index) => (
                      <span key={index} className="ticker-item">
                        {item.title}
                        <span className="mx-6 text-gray-500">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured News Section */}
            {filteredNews.length > 0 && (
              <div className="neo-card featured-news transform transition-all duration-300 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold tracking-wider shadow-lg">
                    FEATURED
                  </div>
                  
                  {filteredNews[0].category && (
                    <div className={`mt-2 px-3 py-1.5 bg-gradient-to-r ${getCategoryColor(filteredNews[0].category)} text-white rounded-full text-xs font-bold tracking-wider shadow-lg`}>
                      {getCategoryName(filteredNews[0].category).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="lg:flex gap-8">
                  <div className="w-full lg:w-2/3 overflow-hidden rounded-xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-[1]"></div>
                    <img
                      src={filteredNews[0].photoUrl || '/placeholder-news.jpg'}
                      alt={filteredNews[0].title}
                      className="w-full h-[300px] sm:h-[400px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/placeholder-news.jpg';
                      }}
                    />
                  
                    
                    {/* Time badge in absolute position */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="flex items-center text-white/80 text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Clock size={14} className="mr-2" /> {getTimeAgo(filteredNews[0].date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-purple-200 text-sm">
                        {formatDate(filteredNews[0].date)}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 hover:text-purple-200 transition-colors">
                      {filteredNews[0].title}
                    </h2>
                    <p className="text-gray-300 mb-6 line-clamp-4">{filteredNews[0].description}</p>
                    {filteredNews[0].link && (
                      <a
                        href={filteredNews[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2 px-5 rounded-full transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
                      >
                        Read Full Story <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Latest Updates</h2>
                <div className="px-3 py-1 rounded-full bg-white/5 text-purple-200 text-sm backdrop-blur-sm border border-white/10">
                  {filteredNews.length} stories
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredNews.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="group neo-card transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 relative"
                  >
                    <div className="overflow-hidden rounded-xl relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]"></div>
                      <img
                        src={item.photoUrl || '/placeholder-news.jpg'}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/placeholder-news.jpg';
                        }}
                      />
                      
                      {/* Category Badge */}
                      {item.category && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(item.category)} text-white text-xs rounded-md font-semibold`}>
                            {getCategoryName(item.category)}
                          </div>
                        </div>
                      )}
                      
                      {/* Time Badge */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white/80 text-xs px-2 py-1 rounded-md">
                          <Clock size={12} /> {getTimeAgo(item.date)}
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2 mt-4">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-300 text-sm mt-2 line-clamp-3">{item.description}</p>
                    
                    {item.link && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className={`text-xs font-medium ${getCategoryTextColor(item.category)}`}>
                          {formatDate(item.date)}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors text-sm"
                        >
                          Read More <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating "Back to Top" Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg opacity-0 transition-opacity duration-300 hover:shadow-purple-500/50"
        id="backToTopBtn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      
      {/* Advanced CSS */}
      <style jsx>{`
        /* Custom Neon Card */
        .neo-card {
          background: rgba(15, 15, 25, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .neo-card:hover {
          box-shadow: 0 8px 30px rgba(128, 0, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .featured-news:hover {
          box-shadow: 0 10px 40px rgba(160, 0, 255, 0.2);
        }

        /* Hide scrollbar for category navigation */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Animations */
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 20s infinite alternate;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* News ticker tape animation */
        .ticker-tape {
          display: flex;
          animation: ticker 30s linear infinite;
          white-space: nowrap;
        }

        .ticker-item {
          padding-right: 20px;
          color: #d8bfff;
        }

        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        /* Save/Share Toast Notification */
        .save-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: rgba(128, 90, 213, 0.95);
          backdrop-filter: blur(12px);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          z-index: 1000;
          font-size: 14px;
          font-weight: 500;
          opacity: 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .save-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      `}</style>

      {/* Back to Top Button Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener("scroll", function() {
            const backToTopBtn = document.getElementById("backToTopBtn");
            if (backToTopBtn) {
              if (window.scrollY > 300) {
                backToTopBtn.style.opacity = "1";
              } else {
                backToTopBtn.style.opacity = "0";
              }
            }
          });
        `
      }} />
    </div>
  );
}

export default NewsPage;