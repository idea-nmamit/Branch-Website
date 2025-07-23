"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronDown, ChevronLeft, ChevronRight, Search, Download, Share2, Maximize } from "lucide-react";
import Fuse from "fuse.js";
import CarouselSection from "@/components/CarouselSection";
import GalleryGrid from "@/components/GalleryGrid";

const categories = [
  "TECHNICAL", "CULTURAL", "SPORTS", "ACADEMIC",
  "WORKSHOP", "SEMINAR", "OUTREACH", "ORIENTATION", "ALL_IMAGES"
];

export default function GalleryPage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownRendered, setIsDropdownRendered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const searchInputRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const fetchedRef = useRef(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [shareError, setShareError] = useState(false);

  const fuseOptions = useMemo(() => ({
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'category', weight: 0.3 }
    ],
    threshold: 0.8,
    distance: 300,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    shouldSort: true,
    ignoreLocation: true,
    findAllMatches: true,
    useExtendedSearch: true,
    ignoreFieldNorm: true,
    getFn: (obj, path) => {
      const value = Fuse.config.getFn(obj, path);
      if (typeof value === 'string') {
        return value + ' ' + value.split(/\s+/).join(' ');
      }
      return value;
    }
  }), []);

  const fuse = useMemo(() => {
    if (allImages.length > 0) {
      return new Fuse(allImages, fuseOptions);
    }
    return null;
  }, [allImages, fuseOptions]);

  const handleImageLoad = useCallback((imageId, isCarousel = false) => {
    const key = isCarousel ? `carousel-${imageId}` : imageId;
    setLoadedImages(prev => {
      if (!prev[key]) {
        return { ...prev, [key]: true };
      }
      return prev;
    });
  }, []);

  const categoryImagesRef = useRef({});

  useEffect(() => {
    categoryImagesRef.current = categoryImages;
  }, [categoryImages]);

  const openImageModal = useCallback((image) => {
    setSelectedImage(image);
    setModalImageLoaded(false);
    document.body.style.overflow = 'hidden';
    const category = image.category || "ALL_IMAGES";
    setCurrentCategory(category);
    const imageIndex = categoryImagesRef.current[category]?.findIndex(img => img.id === image.id) || 0;
    setCurrentImageIndex(imageIndex);
  }, []);

  const formatCategoryName = useCallback((category) => {
    return category.replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  useEffect(() => {
    const initialLoadStates = {};
    setLoadedImages(initialLoadStates);
    setPlaceholderLoaded(true);
  }, []);

  useEffect(() => {
    if (!placeholderLoaded || fetchedRef.current) return;
    
    const cachedData = localStorage.getItem('gallery-carousel-images');
    const cacheTimestamp = localStorage.getItem('gallery-carousel-cache-timestamp');
    const cacheExpiry = 10 * 60 * 1000;
    
    if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < cacheExpiry) {
      try {
        const data = JSON.parse(cachedData);
        processCarouselData(data);
        return;
      } catch (error) {
        console.error("Error parsing cached carousel data:", error);
        localStorage.removeItem('gallery-carousel-images');
        localStorage.removeItem('gallery-carousel-cache-timestamp');
      }
    }
    
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('gallery-carousel-images', JSON.stringify(data));
        localStorage.setItem('gallery-carousel-cache-timestamp', Date.now().toString());
        
        processCarouselData(data);
      })
      .catch(err => {
        console.error("Error fetching carousel images:", err);
        setCarouselLoading(false);
      });
  }, [placeholderLoaded]);

  const processCarouselData = (data) => {
    setLoadedImages(prev => {
      const newStates = { ...prev };
      data.forEach(image => {
        if (!newStates.hasOwnProperty(`carousel-${image.id}`)) {
          newStates[`carousel-${image.id}`] = false;
        }
      });
      return newStates;
    });
    
    setCarouselImages(data);
    setCarouselLoading(false);
  };

  useEffect(() => {
    if (!placeholderLoaded || fetchedRef.current) return;
    
    fetchedRef.current = true;
    
    const cachedData = localStorage.getItem('gallery-all-images');
    const cacheTimestamp = localStorage.getItem('gallery-cache-timestamp');
    const cacheExpiry = 10 * 60 * 1000;
    
    if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < cacheExpiry) {
      try {
        const data = JSON.parse(cachedData);
        processGalleryData(data);
        return;
      } catch (error) {
        console.error("Error parsing cached data:", error);
        localStorage.removeItem('gallery-all-images');
        localStorage.removeItem('gallery-cache-timestamp');
      }
    }
    
    const initialCategories = {};
    categories.forEach(cat => {
      initialCategories[cat] = [];
    });
    
    fetch("/api/gallery?all=true")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('gallery-all-images', JSON.stringify(data));
        localStorage.setItem('gallery-cache-timestamp', Date.now().toString());
        
        processGalleryData(data);
      })
      .catch(err => {
        console.error("Error fetching all images:", err);
        setGalleryLoading(false);
        fetchedRef.current = false;
      });
  }, [placeholderLoaded]);

  const processGalleryData = (data) => {
    const initialCategories = {};
    categories.forEach(cat => {
      initialCategories[cat] = [];
    });
    
    const groupedImages = {...initialCategories};
    
    groupedImages["ALL_IMAGES"] = [...data];
    
    data.forEach(image => {
      if (image.category && groupedImages.hasOwnProperty(image.category)) {
        groupedImages[image.category].push(image);
      }
    });
    
    setLoadedImages(prev => {
      const newStates = { ...prev };
      data.forEach(image => {
        if (!newStates.hasOwnProperty(`gallery-${image.id}`)) {
          newStates[`gallery-${image.id}`] = false;
          newStates[`modal-${image.id}`] = false;
        }
      });
      return newStates;
    });
    
    setCategoryImages(groupedImages);
    setAllImages(data);
    setGalleryLoading(false);
  };

  const clearCache = () => {
    localStorage.removeItem('gallery-all-images');
    localStorage.removeItem('gallery-cache-timestamp');
    localStorage.removeItem('gallery-carousel-images');
    localStorage.removeItem('gallery-carousel-cache-timestamp');
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsFullscreen(false);
    setModalImageLoaded(false);
    document.body.style.overflow = 'auto';
  };

  const navigateToPrevImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || currentImageIndex <= 0) return;
    setModalImageLoaded(false);
    const newIndex = currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(categoryImages[currentCategory][newIndex]);
  };

  const navigateToNextImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || currentImageIndex >= categoryImages[currentCategory].length - 1) return;
    setModalImageLoaded(false);
    const newIndex = currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(categoryImages[currentCategory][newIndex]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'ArrowLeft') {
        if (currentImageIndex > 0) {
          navigateToPrevImage(e);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentImageIndex < categoryImages[currentCategory].length - 1) {
          navigateToNextImage(e);
        }
      } else if (e.key === 'Escape') {
        closeImageModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, currentCategory]);

  const toggleDropdown = () => {
    if (!dropdownOpen) {
      setDropdownOpen(true);
      setIsDropdownRendered(true);
    } else {
      if (dropdownRef.current) {
        import("gsap").then(({ default: gsap }) => {
          gsap.to(dropdownRef.current, {
            opacity: 0,
            y: -10,
            scale: 0.95,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              setIsDropdownRendered(false);
              setDropdownOpen(false);
            }
          });
        });
      }
    }
  };

  useEffect(() => {
    if (!dropdownRef.current || !dropdownOpen) return;
    import("gsap").then(({ default: gsap }) => {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.95, transformOrigin: "top right" },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    });
  }, [dropdownOpen]);

  const handleCategorySelect = (category) => {
    if (dropdownRef.current) {
      import("gsap").then(({ default: gsap }) => {
        gsap.to(dropdownRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            setIsDropdownRendered(false);
            setDropdownOpen(false);
            setSelectedCategory(category);
            
            const element = document.getElementById(category.toLowerCase());
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      if (fuse && allImages.length > 0) {
        const results = fuse.search(searchTerm.trim());

        const searchResults = results
          .filter(result => result.score <= 0.9)
          .map(result => ({
            ...result.item,
            searchScore: result.score,
            matches: result.matches
          }))
          .sort((a, b) => a.searchScore - b.searchScore);
        
        setSearchResults(searchResults);
      } else {
        const response = await fetch(`/api/gallery?search=${encodeURIComponent(searchTerm.trim())}`);
        if (!response.ok) throw new Error('Search request failed');
        
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching images:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (fuse) {
      const debounceTimer = setTimeout(() => {
        setIsSearching(true);
        setShowSearchResults(true);

        const results = fuse.search(searchTerm.trim());
        
        const searchResults = results
          .filter(result => result.score <= 0.9)
          .map(result => ({
            ...result.item,
            searchScore: result.score,
            matches: result.matches
          }))
          .sort((a, b) => a.searchScore - b.searchScore);
        
        setSearchResults(searchResults);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, fuse]);

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const downloadImage = async (e, imageUrl, imageName) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = (imageName || 'gallery-image').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const shareImage = async (e, image) => {
    e.stopPropagation();
    setShareError(false);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: image.description || 'Check out this image from our gallery!',
          url: image.photoUrl
        });
      } else {
        await navigator.clipboard.writeText(image.photoUrl);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      setShareError(true);
      
      try {
        await navigator.clipboard.writeText(image.photoUrl);
        alert('Image URL copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to share image. Please try again later.');
      }
    }
  };

  const highlightText = (text, matches) => {
    if (!matches || matches.length === 0) return text;
    
    let highlightedText = text;
    matches.forEach(match => {
      if (match.indices && match.indices.length > 0) {
        match.indices.forEach(([start, end]) => {
          const before = text.substring(0, start);
          const matched = text.substring(start, end + 1);
          const after = text.substring(end + 1);
          highlightedText = before + `<mark class="bg-yellow-400 text-black px-1 rounded">${matched}</mark>` + after;
        });
      }
    });
    
    return highlightedText;
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-br from-[#17003A] to-[#370069] text-white">
      <header className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Event Gallery
        </motion.h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search images..."
                className="w-full bg-[#17003A]/30 backdrop-blur-sm border border-[#8617C0]/50 rounded-full py-2.5 px-5 pr-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8617C0] focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-[#8617C0] hover:bg-[#370069] text-white py-2 px-4 rounded-full text-sm sm:text-base transition-colors shadow-lg"
            >
              {selectedCategory ? formatCategoryName(selectedCategory) : "All Categories"}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownRendered && (
              <motion.div 
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-[#17003A] border border-[#8617C0]/30 rounded-lg shadow-xl z-40 backdrop-blur-lg overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {categories
                  .filter(category => category === "ALL_IMAGES" || categoryImages[category]?.length > 0)
                  .map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-4 py-2.5 text-sm hover:bg-[#8617C0]/20 transition-colors border-b border-[#8617C0]/10 last:border-b-0"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {formatCategoryName(category)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {showSearchResults && (
        <motion.div 
          className="max-w-7xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
                Search Results for "{searchTerm}"
              </h2>
              {searchResults.length > 0 && !isSearching && (
                <p className="text-sm text-purple-400 mt-1">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button 
              onClick={clearSearch}
              className="flex items-center gap-1 text-sm bg-[#8617C0] hover:bg-[#370069] text-white py-1.5 px-3 rounded-full transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
          
          {isSearching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {Array(8).fill(0).map((_, index) => (
                <Skeleton key={index} className="w-full aspect-square rounded-xl bg-[#17003A]/40" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((image, index) => (
                <motion.div 
                  key={image.id} 
                  className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group border border-[#8617C0]/20 hover:border-[#8617C0]/60 transition-all duration-300"
                  onClick={() => openImageModal(image)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {!loadedImages[`gallery-${image.id}`] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8617C0] to-[#370069] animate-pulse rounded-xl" />
                  )}
                  
                  <Image 
                    src={image.photoUrl} 
                    alt={image.title} 
                    fill
                    className={`object-cover transition-opacity duration-300 ${!loadedImages[`gallery-${image.id}`] ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => handleImageLoad(`gallery-${image.id}`, false)}
                  />
                  
                  {image.searchScore !== undefined && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                      {Math.round((1 - image.searchScore) * 100)}% match
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17003A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium truncate">{image.title}</h3>
                    <p className="text-xs text-purple-300">{formatCategoryName(image.category)}</p>
                    {image.matches && image.matches.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs text-green-400">
                          Matched: {image.matches.map(match => match.key).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-[#8617C0]/20 rounded-full mb-4">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-lg text-purple-200 mb-2">No images found matching your search</p>
            </div>
          )}
        </motion.div>
      )}

      {!showSearchResults && (
        <main className="max-w-7xl mx-auto">
          <section className="mb-12 sm:mb-16">
            <motion.h2 
              className="text-xl sm:text-2xl font-bold mb-6 text-purple-300 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="w-2 h-6 bg-[#8617C0] rounded-full"></span>
              Featured Highlights
            </motion.h2>
            
            <CarouselSection
              carouselImages={carouselImages}
              carouselLoading={carouselLoading}
              placeholderLoaded={placeholderLoaded}
              onImageClick={openImageModal}
              formatCategoryName={formatCategoryName}
            />
          </section>

          <section className="space-y-16 sm:space-y-20">
            <GalleryGrid
              categories={categories}
              categoryImages={categoryImages}
              galleryLoading={galleryLoading}
              placeholderLoaded={placeholderLoaded}
              onImageClick={openImageModal}
              formatCategoryName={formatCategoryName}
              loadedImages={loadedImages}
              onImageLoad={handleImageLoad}
            />
          </section>
        </main>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div 
              ref={modalRef}
              className="relative w-full max-w-6xl max-h-[90vh] bg-[#17003A] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-[#8617C0]/20"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentImageIndex > 0 && (
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white z-10 transition-all duration-200 shadow-lg hover:scale-110"
                  onClick={navigateToPrevImage}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
              
              {currentCategory && currentImageIndex < categoryImages[currentCategory].length - 1 && (
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white z-10 transition-all duration-200 shadow-lg hover:scale-110"
                  onClick={navigateToNextImage}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
              
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center bg-black">
                {selectedImage && (
                  <>
                    {!modalImageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 animate-pulse flex items-center justify-center">
                        <svg className="w-16 h-16 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <Image 
                      src={selectedImage.photoUrl} 
                      alt={selectedImage.title || 'Gallery image'}
                      fill
                      className={`object-contain transition-opacity duration-300 ${modalImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setModalImageLoaded(true)}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </>
                )}
              </div>
              
              <div className="p-4 sm:p-6 bg-gradient-to-b from-[#17003A] to-[#0a0015]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{selectedImage.title}</h3>
                    <p className="text-sm text-purple-300">{formatCategoryName(selectedImage.category)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => downloadImage(e, selectedImage.photoUrl, selectedImage.title)}
                      disabled={downloading}
                      className="p-2 bg-[#8617C0] hover:bg-[#370069] rounded-full transition-colors"
                      title="Download"
                    >
                      {downloading ? (
                        <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => shareImage(e, selectedImage)}
                      className={`p-2 ${shareError ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} rounded-full transition-colors`}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {selectedImage.description && (
                  <p className="text-sm sm:text-base text-gray-300 mb-4">{selectedImage.description}</p>
                )}
                
                <div className="flex justify-between items-center text-xs text-purple-400">
                  <span>
                    Image {currentImageIndex + 1} of {categoryImages[currentCategory]?.length || 1}
                  </span>
                </div>
              </div>
              
              <button 
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors shadow-lg"
                onClick={closeImageModal}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}