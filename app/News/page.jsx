'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const NewsPage = () => {
  const CATEGORIES = [
    {
      value: 'data-science',
      label: 'Data Science & ML',
      query: '"Data Science" OR "Machine Learning"',
      priority: 1
    },
    {
      value: 'technology',
      label: 'Technology',
      query: '"Artificial Intelligence" OR "AI"',
      priority: 2
    },
    {
      value: 'innovation',
      label: 'Innovation',
      query: 'Innovation',
      priority: 3
    },
    {
      value: 'higher-ed',
      label: 'Education',
      query: 'education',
      priority: 4
    }
  ].sort((a, b) => a.priority - b.priority);

  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('data-science');
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const REFRESH_INTERVAL = 1000 * 60 * 60 * 3;

  const fetchNewsFromAPI = useCallback(async (forceRefresh = false, selectedCategory = null) => {
    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      // Check rate limiting
      const canFetch = Date.now() - lastFetchTime > 3000;
      if (!canFetch && !forceRefresh) {
        console.log('Rate limited - waiting before next fetch');
        return;
      }

      // First try to get existing news from database
      const filterResponse = await fetch('/api/news/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory || 'all',
          refreshInterval: REFRESH_INTERVAL
        })
      });

      if (filterResponse.ok) {
        const existingNews = await filterResponse.json();

        // Remove duplicates from existing news too
        const uniqueExistingNews = existingNews.filter((item, index, self) =>
          index === self.findIndex(news =>
            news.title === item.title && news.link === item.link
          )
        );

        const filteredNews = selectedCategory
          ? uniqueExistingNews.filter(item => item.category === selectedCategory)
          : uniqueExistingNews;

        if (filteredNews.length > 0 && !forceRefresh) {
          setNewsItems(filteredNews);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }

      // If forceRefresh or no existing news, fetch from API
      if (!forceRefresh) {
        setLoading(false);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const newsResults = [];

      // Process categories sequentially with longer delay
      for (const category of CATEGORIES) {
        try {
          // Increased delay between requests to 3 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));

          const response = await fetch(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(category.query)}&lang=en&max=10&apikey=${apiKey}`
          );

          if (!response.ok) {
            console.warn(`Failed to fetch news for ${category.value}`);
            continue;
          }

          const data = await response.json();
          if (data.articles) {
            newsResults.push(...data.articles.map(item => ({
              title: item.title,
              description: item.description,
              photoUrl: item.image,
              link: item.url,
              date: item.publishedAt,
              category: category.value,
              fetchedAt: new Date()
            })));
          }
        } catch (err) {
          console.error(`Error fetching ${category.label}:`, err);
        }
      }

      // Only clear existing entries if we got new data
      if (newsResults.length > 0) {
        // Remove duplicates based on title and link
        const uniqueNews = newsResults.filter((item, index, self) =>
          index === self.findIndex(news =>
            news.title === item.title && news.link === item.link
          )
        );

        console.log(`Fetched ${newsResults.length} articles, filtered to ${uniqueNews.length} unique articles`);

        await fetch('/api/news', { method: 'DELETE' });

        // Save new items
        await Promise.all(uniqueNews.map(async (newsItem) => {
          try {
            await fetch('/api/news', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newsItem),
            });
          } catch (err) {
            console.error('Error saving news item:', err);
          }
        }));

        setNewsItems(uniqueNews.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLastFetchTime(Date.now());
      } else {
        // If no new data, keep existing items
        if (filterResponse.ok) {
          const existingNews = await filterResponse.json();

          // Remove duplicates from existing news
          const uniqueExistingNews = existingNews.filter((item, index, self) =>
            index === self.findIndex(news =>
              news.title === item.title && news.link === item.link
            )
          );

          setNewsItems(uniqueExistingNews);
        }
      }

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error in news refresh cycle:', err);
      setError('Failed to load some news. Showing cached content if available.');
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    let mounted = true;
    let hasInitialFetch = false;
    
    const initialFetch = async () => {
      if (!mounted || hasInitialFetch) return;
      hasInitialFetch = true;
      
      await fetchNewsFromAPI();

      // Only check for empty if this is truly the first load
      if (mounted && newsItems.length === 0) {
        console.log("Database empty, forcing refresh");
        await fetchNewsFromAPI(true);
      }
    };

    initialFetch();

    const interval = setInterval(() => {
      if (mounted) {
        fetchNewsFromAPI(true);
      }
    }, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchNewsFromAPI, REFRESH_INTERVAL]);

  // Debounced category change handler
  const handleCategoryChange = useCallback((categoryValue) => {
    setActiveCategory(categoryValue);
    setCategoryLoading(true);
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchNewsFromAPI(false, categoryValue).finally(() => {
        setCategoryLoading(false);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchNewsFromAPI]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'data-science': 'from-blue-500 to-blue-700',
      'technology': 'from-red-500 to-red-700',
      'innovation': 'from-green-500 to-green-700',
      'higher-ed': 'from-purple-500 to-purple-700',
    };
    return colors[category] || 'from-purple-500 to-pink-600';
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      'data-science': 'text-blue-400',
      'technology': 'text-red-400',
      'innovation': 'text-green-400',
      'higher-ed': 'text-purple-400',
    };
    return colors[category] || 'text-purple-400';
  };

  const getCategoryName = (category) => {
    const names = {
      'data-science': 'Data Science',
      'technology': 'Technology',
      'innovation': 'Innovation',
      'higher-ed': 'Education',
    };
    return names[category] || category;
  };

  // Memoize filtered news to prevent unnecessary recalculations
  const filteredNews = useMemo(() => {
    return activeCategory === 'all'
      ? newsItems
      : newsItems.filter(item => item.category === activeCategory);
  }, [newsItems, activeCategory]);

  // Memoize unique filtered news to prevent unnecessary recalculations
  const uniqueFilteredNews = useMemo(() => {
    return filteredNews.filter((item, index, self) => {
      // More robust duplicate detection
      const normalizeTitle = (title) => title.toLowerCase().trim().replace(/[^\w\s]/g, '');
      const normalizeLink = (link) => link.toLowerCase().trim();

      return index === self.findIndex(news => {
        const isSameTitle = normalizeTitle(news.title) === normalizeTitle(item.title);
        const isSameLink = normalizeLink(news.link) === normalizeLink(item.link);

        // Consider it a duplicate if either title matches exactly or link matches exactly
        return isSameTitle || isSameLink;
      });
    });
  }, [filteredNews]);

  // Debug logging
  console.log(`Category: ${activeCategory}, Original: ${filteredNews.length}, After dedup: ${uniqueFilteredNews.length}`);

  const gridNews = uniqueFilteredNews.length > 0 ? uniqueFilteredNews.slice(1) : [];
  return (
    <div className="bg-gradient-to-br from-[#17003A] to-[#370069] min-h-screen pb-16 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-white/5 blur-3xl animate-blob"></div>
          <div className="absolute top-[40%] right-[15%] w-72 h-72 rounded-full bg-white/5 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[35%] w-80 h-80 rounded-full bg-white/5 blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-12 sm:pt-16 relative z-10">
        {/* Page Header - Now integrated with main content */}
        <div className="py-4 sm:py-6 flex flex-col items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-center mb-2 px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Education News
            </span>
          </h1>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-white to-gray-300 rounded-full my-2"></div>
          <p className="text-white/80 text-center max-w-2xl text-sm sm:text-base px-4">
            Stay updated with the latest trends and insights in education
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="pb-6 sm:pb-8 flex items-center justify-start sm:justify-center space-x-1 overflow-x-auto hide-scrollbar px-1">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              disabled={categoryLoading}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeCategory === category.value
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
                } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="bg-red-500/20 text-red-100 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 border border-red-500/30 backdrop-blur-md text-sm sm:text-base">
            {error}
          </div>
        )}

        {(loading || categoryLoading) ? (
          <div className="space-y-8 sm:space-y-12">
            <div className="neo-card">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                <Skeleton className="w-full lg:w-2/3 h-[200px] sm:h-[300px] rounded-lg sm:rounded-xl" />
                <div className="w-full lg:w-1/3 mt-4 lg:mt-0 space-y-3 sm:space-y-4">
                  <Skeleton className="h-6 sm:h-8 w-24 sm:w-32" />
                  <Skeleton className="h-8 sm:h-10 w-full" />
                  <Skeleton className="h-4 sm:h-6 w-20 sm:w-24" />
                  <Skeleton className="h-24 sm:h-32 w-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array(6).fill().map((_, index) => (
                <div key={index} className="neo-card">
                  <Skeleton className="w-full h-40 sm:h-48 rounded-lg sm:rounded-xl mb-3 sm:mb-4" />
                  <Skeleton className="h-4 sm:h-6 w-20 sm:w-24 mb-2" />
                  <Skeleton className="h-6 sm:h-8 w-full mb-2 sm:mb-3" />
                  <Skeleton className="h-20 sm:h-24 w-full rounded-md mb-3 sm:mb-4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-1.5 sm:p-2 text-white font-bold flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                  <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> TRENDING
                </div>
                <div className="py-2 px-2 sm:px-4 relative overflow-hidden w-full">
                  <div className="ticker-tape">
                    {newsItems.slice(0, 5).map((item, index) => (
                      <span key={index} className="ticker-item text-xs sm:text-sm">
                        {item.title}
                        <span className="mx-3 sm:mx-6 text-gray-500">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {uniqueFilteredNews.length > 0 && (
              <div className="neo-card featured-news transform transition-all duration-300 overflow-hidden">
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold tracking-wider shadow-lg">
                    FEATURED
                  </div>
                  {uniqueFilteredNews[0].category && (
                    <div className={`mt-1 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${getCategoryColor(uniqueFilteredNews[0].category)} text-white rounded-full text-xs font-bold tracking-wider shadow-lg`}>
                      {getCategoryName(uniqueFilteredNews[0].category).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  <div className="w-full lg:w-2/3 overflow-hidden rounded-lg sm:rounded-xl relative group h-[200px] sm:h-[300px] lg:h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-[1]"></div>
                    <Image
                      src={uniqueFilteredNews[0].photoUrl || '/placeholder-news.jpg'}
                      alt={uniqueFilteredNews[0].title}
                      fill
                      className="object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-700"
                      unoptimized={uniqueFilteredNews[0].photoUrl && uniqueFilteredNews[0].photoUrl.startsWith('http')}
                      onError={(e) => {
                        e.target.src = '/placeholder-news.jpg';
                      }}
                    />
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20">
                      <div className="flex items-center text-white/80 text-xs sm:text-sm bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                        <Clock size={12} className="mr-1 sm:mr-2 sm:w-3.5 sm:h-3.5" /> {getTimeAgo(uniqueFilteredNews[0].date)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/3 mt-2 sm:mt-4 lg:mt-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="text-purple-200 text-xs sm:text-sm">
                        {formatDate(uniqueFilteredNews[0].date)}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 sm:mb-4 hover:text-purple-200 transition-colors leading-tight">
                      {uniqueFilteredNews[0].title}
                    </h2>
                    <p className="text-gray-300 mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-4 text-sm sm:text-base">{uniqueFilteredNews[0].description}</p>
                    {uniqueFilteredNews[0].link && (
                      <a
                        href={uniqueFilteredNews[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2 px-4 sm:px-5 rounded-full transition-all transform hover:translate-y-[-2px] hover:shadow-lg text-sm sm:text-base"
                      >
                        Read Full Story <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

            )}

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Latest Updates</h2>
                <div className="px-3 py-1 rounded-full bg-white/5 text-purple-200 text-xs sm:text-sm backdrop-blur-sm border border-white/10 self-start sm:self-auto">
                  {uniqueFilteredNews.length} stories
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {uniqueFilteredNews.slice(1).map((item, index) => (
                  <div
                    key={`${item.link}-${item.title}-${index}`}
                    className="group neo-card transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 relative"
                  >
                    <div className="overflow-hidden rounded-lg sm:rounded-xl relative h-40 sm:h-48">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]"></div>
                      <Image
                        src={item.photoUrl || '/placeholder-news.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg sm:rounded-xl transform transition-transform duration-700 group-hover:scale-105"
                        unoptimized={item.photoUrl && item.photoUrl.startsWith('http')}
                        onError={(e) => {
                          e.target.src = '/placeholder-news.jpg';
                        }}
                      />
                      {item.category && (
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                          <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r ${getCategoryColor(item.category)} text-white text-xs rounded-md font-semibold`}>
                            {getCategoryName(item.category)}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white/80 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                          <Clock size={10} className="sm:w-3 sm:h-3" /> {getTimeAgo(item.date)}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2 mt-3 sm:mt-4 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-gray-300 text-xs sm:text-sm mt-2 line-clamp-3">{item.description}</p>
                    {item.link && (
                      <div className="mt-3 sm:mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className={`text-xs font-medium ${getCategoryTextColor(item.category)}`}>
                          {formatDate(item.date)}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 sm:gap-2 text-purple-300 hover:text-purple-100 transition-colors text-xs sm:text-sm"
                        >
                          Read More <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
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

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-opacity duration-300 hover:shadow-purple-500/50 ${showBackToTop ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <style jsx>{`
        .neo-card {
          background: rgba(15, 15, 25, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        @media (min-width: 640px) {
          .neo-card {
            border-radius: 1rem;
            padding: 1.5rem;
          }
        }

        .neo-card:hover {
          box-shadow: 0 8px 30px rgba(128, 0, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .featured-news:hover {
          box-shadow: 0 10px 40px rgba(160, 0, 255, 0.2);
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

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

        /* Mobile-specific ticker adjustments */
        @media (max-width: 640px) {
          .ticker-tape {
            animation-duration: 40s;
          }
        }

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
    </div>
  );
}

export default NewsPage;