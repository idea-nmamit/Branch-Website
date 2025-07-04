"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronDown, ChevronLeft, ChevronRight, Search, Download, Share2, Maximize } from "lucide-react";

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
  const searchInputRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const fetchedRef = useRef(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const [lastHintTime, setLastHintTime] = useState(0);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const navButtonTimeoutRef = useRef(null);
  const tapTimeoutRef = useRef(null);
  const tapCountRef = useRef(0);

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => ({ ...prev, [imageId]: true }));
  };

  useEffect(() => {
    const initialLoadStates = {};
    for (let i = 0; i < 5; i++) {
      initialLoadStates[`placeholder-carousel-${i}`] = false;
    }
    categories.forEach(category => {
      for (let i = 0; i < 8; i++) {
        initialLoadStates[`placeholder-${category}-${i}`] = false;
      }
    });
    setLoadedImages(initialLoadStates);
    setPlaceholderLoaded(true);
  }, []);

  useEffect(() => {
    if (!placeholderLoaded || fetchedRef.current) return;
    
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        const updatedLoadStates = { ...loadedImages };
        data.forEach(image => {
          updatedLoadStates[image.id] = false;
          updatedLoadStates[`modal-${image.id}`] = false;
        });
        
        setLoadedImages(updatedLoadStates);
        setCarouselImages(data);
        setCarouselLoading(false);
      })
      .catch(err => {
        console.error("Error fetching carousel images:", err);
        setCarouselLoading(false);
      });
  }, [placeholderLoaded]);

  useEffect(() => {
    if (!placeholderLoaded || fetchedRef.current) return;
    
    fetchedRef.current = true;
    
    const initialCategories = {};
    categories.forEach(cat => {
      initialCategories[cat] = [];
    });
    
    fetch("/api/gallery?all=true")
      .then(res => res.json())
      .then(data => {
        const groupedImages = {...initialCategories};
        
        groupedImages["ALL_IMAGES"] = [...data];
        
        data.forEach(image => {
          if (image.category && groupedImages.hasOwnProperty(image.category)) {
            groupedImages[image.category].push(image);
          }
        });
        
        const updatedLoadStates = { ...loadedImages };
        data.forEach(image => {
          updatedLoadStates[image.id] = false;
          updatedLoadStates[`modal-${image.id}`] = false;
        });
        
        setLoadedImages(updatedLoadStates);
        setCategoryImages(groupedImages);
        setGalleryLoading(false);
      })
      .catch(err => {
        console.error("Error fetching all images:", err);
        setGalleryLoading(false);
        fetchedRef.current = false;
      });
  }, [placeholderLoaded]);

  useEffect(() => {
    if (carouselLoading || carouselImages.length === 0 || isCarouselTransitioning) return;

    const autoplayInterval = setInterval(() => {
      setIsCarouselTransitioning(true);
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
      
      setTimeout(() => {
        setIsCarouselTransitioning(false);
      }, 1200);
    }, 8000);

    return () => clearInterval(autoplayInterval);
  }, [carouselLoading, carouselImages.length, isCarouselTransitioning]);

  const handleCarouselInteraction = () => {
    setShowNavButtons(true);

    if (navButtonTimeoutRef.current) {
      clearTimeout(navButtonTimeoutRef.current);
    }
    
    navButtonTimeoutRef.current = setTimeout(() => {
      setShowNavButtons(false);
    }, 3000);
  };

  const handleDoubleTap = () => {
    if (!isMobile) return;
    
    const currentTime = Date.now();
    const oneMinute = 60 * 1000;
    
    if (currentTime - lastHintTime > oneMinute) {
      setShowMobileHint(true);
      setLastHintTime(currentTime);
      
      setTimeout(() => {
        setShowMobileHint(false);
      }, 3000);
    }

    handleCarouselInteraction();
  };

  const handleTapInteraction = (e) => {
    if (!isMobile) {
      handleCarouselInteraction();
      return;
    }

    tapCountRef.current += 1;
    
    if (tapCountRef.current === 1) {
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 300);
    } else if (tapCountRef.current === 2) {
      clearTimeout(tapTimeoutRef.current);
      tapCountRef.current = 0;
      handleDoubleTap();
      e.preventDefault();
    }
  };

  useEffect(() => {
    return () => {
      if (navButtonTimeoutRef.current) {
        clearTimeout(navButtonTimeoutRef.current);
      }
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalImageLoaded(false);
    document.body.style.overflow = 'hidden';
    const category = image.category || "ALL_IMAGES";
    setCurrentCategory(category);
    const imageIndex = categoryImages[category].findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex);
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
      return;
    }
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const response = await fetch(`/api/gallery?search=${encodeURIComponent(searchTerm.trim())}`);
      if (!response.ok) throw new Error('Search request failed');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching images:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

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

  const GalleryImage = React.memo(({ image, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    
    return (
      <motion.div 
        className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group will-change-transform"
        onClick={() => onClick(image)}
        whileHover={{ 
          scale: 1.05, 
          y: -5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
        layout={false}
      >
        {(!isLoaded && !hasError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-pink-900/60 animate-pulse rounded-xl backdrop-blur-sm" />
        )}
        
        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
            <div className="text-gray-400 text-sm text-center p-4">
              Failed to load image
            </div>
          </div>
        ) : (
          <Image 
            src={image.photoUrl} 
            alt={image.title} 
            fill
            className={`object-cover transition-opacity duration-700 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(false);
            }}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            quality={75}
          />
        )}
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4"
          initial={false}
        >
          <motion.h3 
            className="text-white font-medium text-sm truncate"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
          >
            {image.title}
          </motion.h3>
          <motion.p 
            className="text-xs text-purple-300 truncate"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
          >
            {image.description?.substring(0, 30)}{image.description?.length > 30 ? '...' : ''}
          </motion.p>
        </motion.div>
        
        {/* Subtle border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-purple-400/0 group-hover:border-purple-400/30 transition-all duration-300"
          initial={false}
        />
      </motion.div>
    );
  });

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
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
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
                {categories.map((category) => (
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
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
              Search Results for "{searchTerm}"
            </h2>
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
              {searchResults.map((image) => (
                <motion.div 
                  key={image.id} 
                  className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group border border-[#8617C0]/20 hover:border-[#8617C0]/60 transition-all duration-300"
                  onClick={() => openImageModal(image)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {!loadedImages[image.id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8617C0] to-[#370069] animate-pulse rounded-xl" />
                  )}
                  
                  <Image 
                    src={image.photoUrl} 
                    alt={image.title} 
                    fill
                    className={`object-cover transition-opacity duration-300 ${!loadedImages[image.id] ? 'opacity-0' : 'opacity-100'}`}
                    onLoadingComplete={() => handleImageLoad(image.id)}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17003A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium truncate">{image.title}</h3>
                    <p className="text-xs text-purple-300">{formatCategoryName(image.category)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-[#8617C0]/20 rounded-full mb-4">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-lg text-purple-200">No images found matching your search</p>
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
            
            {carouselLoading || !placeholderLoaded ? (
              <div className="flex justify-center items-center gap-4 sm:gap-6 px-4">
                <Skeleton className="w-[250px] h-[180px] md:w-[300px] md:h-[200px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
                <Skeleton className="w-[350px] h-[250px] md:w-[450px] md:h-[320px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
                <Skeleton className="w-[250px] h-[180px] md:w-[300px] md:h-[200px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <div 
                  className="flex justify-center items-center gap-4 md:gap-8 px-4 py-8 will-change-transform"
                  onClick={handleTapInteraction}
                  onTouchStart={handleTapInteraction}
                >
                  {carouselImages.slice(0, 3).map((image, index) => {
                    const adjustedIndex = (currentCarouselIndex + index - 1 + carouselImages.length) % carouselImages.length;
                    const displayImage = carouselImages[adjustedIndex];
                    const isCenter = index === 1;
                    const imageKey = `${displayImage.id}-${currentCarouselIndex}-${index}`;
                    
                    return (
                      <motion.div
                        key={imageKey}
                        className={`relative cursor-pointer rounded-xl overflow-hidden group flex-shrink-0 will-change-transform ${
                          isCenter 
                            ? 'w-[300px] h-[220px] sm:w-[350px] sm:h-[250px] md:w-[450px] md:h-[320px]'
                            : 'w-[200px] h-[140px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px]'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageModal(displayImage);
                        }}
                        initial={false}
                        animate={{
                          scale: isCenter ? 1 : 0.85,
                          opacity: isCenter ? 1 : 0.6,
                          y: isCenter ? 0 : 30,
                          filter: isCenter ? "blur(0px)" : "blur(1px)",
                        }}
                        transition={{ 
                          duration: 1.2, 
                          ease: [0.25, 0.46, 0.45, 0.94],
                          type: "tween"
                        }}
                        whileHover={{ 
                          scale: isCenter ? 1.02 : 0.88,
                          y: isCenter ? -8 : 25,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: isCenter ? 0.98 : 0.82 }}
                      >
                        {!loadedImages[displayImage.id] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-pink-900/60 animate-pulse rounded-xl backdrop-blur-sm" />
                        )}
                        
                        <Image
                          src={displayImage.photoUrl}
                          alt={displayImage.title}
                          fill
                          className={`object-cover transition-opacity duration-1000 ${!loadedImages[displayImage.id] ? 'opacity-0' : 'opacity-100'}`}
                          onLoadingComplete={() => handleImageLoad(displayImage.id)}
                          sizes={isCenter ? "450px" : "300px"}
                          priority={isCenter}
                          quality={isCenter ? 90 : 75}
                          unoptimized={false}
                        />
                        
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end transition-all duration-500 ${
                          isCenter ? 'p-6' : 'p-3'
                        }`}>
                          <motion.h3 
                            className={`text-white font-medium transition-all duration-500 ${
                              isCenter ? 'text-lg md:text-xl mb-1' : 'text-xs md:text-sm'
                            }`}
                            animate={{ opacity: isCenter ? 1 : 0.8 }}
                          >
                            {displayImage.title}
                          </motion.h3>
                          <motion.p 
                            className={`text-purple-300 transition-all duration-500 ${
                              isCenter ? 'text-sm md:text-base' : 'text-xs'
                            }`}
                            animate={{ opacity: isCenter ? 1 : 0.7 }}
                          >
                            {formatCategoryName(displayImage.category)}
                          </motion.p>
                        </div>
                        
                        {isCenter && (
                          <motion.div 
                            className="absolute inset-0 ring-2 ring-purple-400/70 rounded-xl pointer-events-none"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        )}
                        
                        <div className={`absolute inset-0 rounded-xl transition-all duration-700 ${
                          isCenter 
                            ? 'shadow-2xl shadow-purple-500/40' 
                            : 'shadow-lg shadow-black/60'
                        }`} />
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Navigation buttons - Hidden on mobile until interaction */}
                <AnimatePresence>
                  {(showNavButtons || !isMobile) && (
                    <>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCarouselTransitioning) {
                            setIsCarouselTransitioning(true);
                            setCurrentCarouselIndex((prev) => 
                              prev === 0 ? carouselImages.length - 1 : prev - 1
                            );
                            setTimeout(() => setIsCarouselTransitioning(false), 1200);
                          }
                          handleCarouselInteraction();
                        }}
                        disabled={isCarouselTransitioning}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 z-10 backdrop-blur-sm md:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.9)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCarouselTransitioning) {
                            setIsCarouselTransitioning(true);
                            setCurrentCarouselIndex((prev) => 
                              (prev + 1) % carouselImages.length
                            );
                            setTimeout(() => setIsCarouselTransitioning(false), 1200);
                          }
                          handleCarouselInteraction();
                        }}
                        disabled={isCarouselTransitioning}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 z-10 backdrop-blur-sm md:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.9)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>

                {/* Mobile double-tap hint - Only show once per minute */}
                <AnimatePresence>
                  {showMobileHint && isMobile && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 text-white text-sm shadow-2xl border border-purple-400/30"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span>Double tap to show controls</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Dots indicator */}
                <motion.div 
                  className="flex justify-center mt-8 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {carouselImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        if (!isCarouselTransitioning) {
                          setIsCarouselTransitioning(true);
                          setCurrentCarouselIndex(index);
                          setTimeout(() => setIsCarouselTransitioning(false), 1200);
                          handleCarouselInteraction();
                        }
                      }}
                      disabled={isCarouselTransitioning}
                      className={`h-2 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
                        index === currentCarouselIndex 
                          ? 'bg-purple-400 w-8 shadow-lg shadow-purple-400/50' 
                          : 'bg-white/40 hover:bg-white/60 w-2'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        backgroundColor: index === currentCarouselIndex ? "#a855f7" : "rgba(255,255,255,0.4)"
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            )}
          </section>

          <section className="space-y-16 sm:space-y-20">
            {galleryLoading || !placeholderLoaded ? (
              <div className="space-y-16">
                {Array(3).fill(0).map((_, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Skeleton className="h-8 w-48 rounded-full bg-[#17003A]/40" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                      {Array(4).fill(0).map((_, imgIndex) => (
                        <Skeleton key={imgIndex} className="aspect-square rounded-xl bg-[#17003A]/40" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              categories.map((category, categoryIndex) => (
                <motion.section 
                  key={category} 
                  id={category.toLowerCase()}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: categoryIndex * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <span className="w-2 h-8 bg-gradient-to-b from-[#8617C0] to-[#370069] rounded-full"></span>
                      {formatCategoryName(category)}
                    </motion.h2>
                    {categoryImages[category]?.length > 4 && (
                      <motion.button 
                        className="text-sm text-purple-400 hover:text-white transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All
                      </motion.button>
                    )}
                  </div>
                  
                  {categoryImages[category]?.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {categoryImages[category].slice(0, 8).map((image, imageIndex) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20px" }}
                          transition={{ 
                            delay: imageIndex * 0.03,
                            duration: 0.4,
                            ease: "easeOut"
                          }}
                        >
                          <GalleryImage image={image} onClick={openImageModal} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="py-12 text-center bg-[#8617C0]/10 rounded-xl border border-[#8617C0]/20 backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <p className="text-purple-300">No images available in this category</p>
                    </motion.div>
                  )}
                </motion.section>
              ))
            )}
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