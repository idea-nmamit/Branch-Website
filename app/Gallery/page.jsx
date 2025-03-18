"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import gsap from "gsap";

const categories = [
  "TECHNICAL", "CULTURAL", "SPORTS",  "ACADEMIC",
  "WORKSHOP", "SEMINAR", 
  "OUTREACH", "ORIENTATION","ALL_IMAGES"
  // "INDUSTRIAL_VISIT","PROJECT_EXHIBITION","SOCIAL",
];

export default function GalleryPage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [api, setApi] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownRendered, setIsDropdownRendered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");
  const dropdownRef = useRef(null);
  
  // New state for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);

  // Add this to your state declarations at the top of your component
  const [downloading, setDownloading] = useState(false);

  // Add state to track loaded images
  const [loadedImages, setLoadedImages] = useState({});

  // Add this new state to track skeleton placeholders
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);

  // Function to mark an image as loaded
  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  // Create placeholder skeletons immediately on component mount
  useEffect(() => {
    // Pre-generate placeholder IDs for skeleton UI
    const initialLoadStates = {};
    
    // Generate placeholders for carousel (typically shows 3-5 images)
    for (let i = 0; i < 5; i++) {
      initialLoadStates[`placeholder-carousel-${i}`] = false;
    }
    
    // Generate placeholders for each category (4-8 images per category)
    categories.forEach(category => {
      for (let i = 0; i < 8; i++) {
        initialLoadStates[`placeholder-${category}-${i}`] = false;
      }
    });
    
    // Set initial load states to false to force skeleton display
    setLoadedImages(initialLoadStates);
    setPlaceholderLoaded(true);
  }, []);

  // Fetch carousel images
  useEffect(() => {
    // Don't wait for API to show skeletons
    if (!placeholderLoaded) return;
    
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        // Update loaded images map with real image IDs
        const updatedLoadStates = { ...loadedImages };
        data.forEach(image => {
          updatedLoadStates[image.id] = false;
        });
        
        setLoadedImages(updatedLoadStates);
        setCarouselImages(data);
        setCarouselLoading(false);
      })
      .catch(err => {
        console.error("Error fetching carousel images:", err);
        setCarouselLoading(false);
      });
  }, [placeholderLoaded]); // Depend on placeholderLoaded

  // Fetch all images and organize by category
  useEffect(() => {
    // Don't wait for API to show skeletons
    if (!placeholderLoaded) return;
    
    // Initialize empty object with all categories
    const initialCategories = {};
    categories.forEach(cat => {
      initialCategories[cat] = [];
    });
    
    // Fetch all images with the 'all=true' parameter
    fetch("/api/gallery?all=true")
      .then(res => res.json())
      .then(data => {
        // Group images by category
        const groupedImages = {...initialCategories};
        
        // Add all images to the ALL category
        groupedImages["ALL_IMAGES"] = [...data];
        
        // Sort images into their respective categories
        data.forEach(image => {
          if (image.category && groupedImages.hasOwnProperty(image.category)) {
            groupedImages[image.category].push(image);
          }
        });
        
        setCategoryImages(groupedImages);
        setGalleryLoading(false);
      })
      .catch(err => {
        console.error("Error fetching all images:", err);
        setGalleryLoading(false);
      });
  }, [placeholderLoaded]); // Depend on placeholderLoaded

  // Autoplay carousel effect
  useEffect(() => {
    if (!api || carouselLoading) return;

    // Set up autoplay interval
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(autoplayInterval);
  }, [api, carouselLoading]);

  // Format category display name
  const formatCategoryName = (category) => {
    // First replace underscores with spaces
    const withSpaces = category.replace(/_/g, ' ');
    
    // Then convert to Pascal case (first letter of each word uppercase, rest lowercase)
    return withSpaces
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to open image modal
  const openImageModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Set the current category and find the image index
    const category = image.category || "ALL_IMAGES";
    setCurrentCategory(category);
    
    const imageIndex = categoryImages[category].findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex);
  };

  // Function to close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Function to navigate to previous image
  const navigateToPrevImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || currentImageIndex <= 0) return;
    
    const newIndex = currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(categoryImages[currentCategory][newIndex]);
  };

  // Function to navigate to next image
  const navigateToNextImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || currentImageIndex >= categoryImages[currentCategory].length - 1) return;
    
    const newIndex = currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(categoryImages[currentCategory][newIndex]);
  };
  
  // Add keyboard navigation
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

  // Handle dropdown toggle with animations
  const toggleDropdown = () => {
    if (!dropdownOpen) {
      // Opening the dropdown
      setDropdownOpen(true);
      setIsDropdownRendered(true);
    } else {
      // Closing the dropdown - animate first, then remove from DOM
      if (dropdownRef.current) {
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
      }
    }
  };

  // GSAP animation for dropdown opening
  useEffect(() => {
    if (!dropdownRef.current || !dropdownOpen) return;
    
    // Animation for opening the dropdown
    gsap.fromTo(
      dropdownRef.current,
      { 
        opacity: 0, 
        y: -10, 
        scale: 0.95,
        transformOrigin: "top right" 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.25, 
        ease: "power2.out" 
      }
    );
  }, [dropdownOpen]);

  // Handler for category selection with animation
  const handleCategorySelect = (category) => {
    // Animate closing first
    if (dropdownRef.current) {
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
          
          // Scroll to the selected category section
          const element = document.getElementById(category.toLowerCase());
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  };

  // Search function to call the API with search term
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

  // Clear search results
  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Update the download function to handle cross-origin images
  const downloadImage = async (imageUrl, imageName) => {
    try {
      // Show loading state
      setDownloading(true);
      
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      
      // Create a local blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageName || 'gallery-image';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      // Hide loading state
      setDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 text-white bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4]">
      {/* Search bar - Added at the top of the page */}
      <div className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 pt-8 sm:pt-4">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images by title or description..."
            className="w-full bg-black/30 border border-[#8617C0] rounded-full py-2 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8617C0]"
          />
          {searchTerm && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            type="submit" 
            className="absolute right-2 bg-[#370069] hover:bg-[#4b008e] text-white p-1 rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Search Results Section */}
      {showSearchResults && (
        <div className="max-w-6xl mx-auto mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#17003A]/80 border border-[#8617C0] rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Search Results for "{searchTerm}"
              </h2>
              <button 
                onClick={clearSearch}
                className="bg-[#370069] hover:bg-[#4b008e] text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
            
            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {Array(4).fill(0).map((_, index) => (
                  <Skeleton key={index} className="w-full h-32 sm:h-40 md:h-48 rounded-lg" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {/* Search Results Image Container - Add hover description */}
                {searchResults.map((image) => (
                  <motion.div 
                    key={image.id} 
                    className="relative w-full h-32 sm:h-40 md:h-48 cursor-pointer rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 group"
                    onClick={() => openImageModal(image)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Skeleton shown while image is loading */}
                    {!loadedImages[image.id] && (
                      <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <Image 
                      src={image.photoUrl} 
                      alt={image.title} 
                      layout="fill" 
                      objectFit="cover" 
                      className={`rounded-lg ${!loadedImages[image.id] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                      onLoadingComplete={() => handleImageLoad(image.id)}
                    />
                    
                    {/* Black tint overlay (appears on hover) */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                    {/* Title overlay (visible by default) */}
                    <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full transition-opacity duration-300 group-hover:opacity-0">
                      <div className="text-xs sm:text-sm font-medium truncate">{image.title}</div>
                      <div className="text-xs opacity-75 truncate">{formatCategoryName(image.category)}</div>
                    </div>
                    {/* Description overlay (visible on hover) */}
                    <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] flex flex-col justify-center items-center p-2 sm:p-3 text-white opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                      <h4 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-center text-shadow-lg drop-shadow-lg">{image.title}</h4>
                      <p className="text-xs sm:text-sm text-center overflow-y-auto max-h-[80%] text-white text-shadow-lg drop-shadow-lg">
                        {image.description || "No description available"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">No images found matching your search.</p>
            )}
          </motion.div>
        </div>
      )}

      {/* Category dropdown - Adjusted for better mobile positioning */}
      <div className="fixed top-20 sm:top-24 md:top-26 right-2 sm:right-6 md:right-10 z-30">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-[#370069] hover:bg-[#4b008e] text-white py-1 px-2 sm:py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
          >
            {selectedCategory ? formatCategoryName(selectedCategory) : "Select Category"}
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownRendered && (
            <div 
              ref={dropdownRef}
              className="absolute right-0 mt-1 sm:mt-2 w-44 sm:w-48 bg-[#17003A] border border-[#8617C0] rounded-md shadow-lg z-40 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2 hover:bg-[#370069] text-sm sm:text-sm"
                  onClick={() => handleCategorySelect(category)}
                >
                  {formatCategoryName(category)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Only show regular content if not showing search results */}
      {!showSearchResults && (
        <>
          {/* Carousel Section */}
          <div className="mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto">
            <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Highlights
            </motion.h2>
            {carouselLoading || !placeholderLoaded ? (
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="relative w-full h-40 sm:h-52 md:h-72 lg:h-80 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel 
                className="w-full max-w-7xl mx-auto"
                opts={{
                  align: "start",
                  loop: true,
                }}
                setApi={setApi}
              >
                <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
                  {carouselImages.map((image) => (
                    <CarouselItem key={image.id} className="pl-1 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 cursor-pointer" onClick={() => openImageModal(image)}>
                      <div className="relative w-full h-40 sm:h-52 md:h-72 lg:h-80 rounded-lg overflow-hidden">
                        {/* Skeleton shown while image is loading */}
                        {!loadedImages[image.id] && (
                          <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        <Image
                          src={image.photoUrl}
                          alt={image.title}
                          layout="fill"
                          objectFit="cover"
                          className={`rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ${!loadedImages[image.id] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                          style={{ borderRadius: '0.5rem' }} /* Fixed rounded corners during animation */
                          onLoadingComplete={() => handleImageLoad(image.id)}
                        />
                        <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full text-center text-xs sm:text-sm">
                          {image.title}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:-left-5 lg:-left-14 bg-black hover:bg-black/20 text-white hover:text-white/70 shadow-md" />
                <CarouselNext className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:-right-5 lg:-right-14 bg-black hover:bg-black/20 text-white hover:text-white/70 shadow-md" />
              </Carousel>
            )}
          </div>

          {/* Category Sections */}
          <div className="max-w-6xl mx-auto">
            <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Gallery Categories
            </motion.h2>
            
            {galleryLoading || !placeholderLoaded ? (
              // Loading skeleton for categories
              <div className="space-y-6 sm:space-y-8 md:space-y-10">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="space-y-3 sm:space-y-4">
                    <Skeleton className="h-8 sm:h-10 w-32 sm:w-64" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                      {Array(4).fill(0).map((_, imgIndex) => (
                        <Skeleton key={imgIndex} className="w-full h-36 sm:h-40 md:h-48 rounded-lg" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display each category with its images
              <div className="space-y-8 sm:space-y-12 md:space-y-16">
                {categories.map((category) => (
                  <motion.div 
                    key={category} 
                    className="scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-24"
                    id={category.toLowerCase()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-left border-b border-[#8617C0] pb-1 sm:pb-2">
                      {formatCategoryName(category)}
                    </h3>
                    
                    {categoryImages[category] && categoryImages[category].length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                        {/* Category Images - Make description overlay more translucent */}
                        {categoryImages[category].map((image) => (
                          <motion.div 
                            key={image.id} 
                            className="relative w-full h-32 xs:h-40 sm:h-48 md:h-56 lg:h-60 cursor-pointer overflow-hidden rounded-lg shadow-md hover:scale-105 transition-all duration-300 
                                       box-border border-2 border-transparent hover:border-[#8617C0]/50 hover:shadow-[0_0_20px_rgba(134,23,192,0.6)] group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => openImageModal(image)}
                          >
                            {/* Skeleton shown while image is loading */}
                            {!loadedImages[image.id] && (
                              <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            
                            <Image 
                              src={image.photoUrl} 
                              alt={image.title} 
                              layout="fill" 
                              objectFit="cover" 
                              className={`rounded-lg ${!loadedImages[image.id] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                              onLoadingComplete={() => handleImageLoad(image.id)}
                            />
                            {/* Black tint overlay (appears on hover) */}
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                            {/* Title overlay (visible by default) */}
                            <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full text-center text-xs sm:text-sm truncate transition-opacity duration-300 group-hover:opacity-0">
                              {image.title}
                            </div>
                            {/* Description overlay - reduce opacity to match search results */}
                            <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] flex flex-col justify-center items-center p-2 sm:p-3 text-white opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                              <h4 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-center text-shadow-lg drop-shadow-lg">{image.title}</h4>
                              <p className="text-xs sm:text-sm text-center overflow-y-auto max-h-[80%] text-white text-shadow-lg drop-shadow-lg">
                                {image.description || "No description available"}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm sm:text-base md:text-lg italic opacity-70">No images available for this category</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Image Modal - Improved responsiveness */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div 
              className="relative bg-[#17003A] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Arrows - Improved positioning */}
              {currentImageIndex > 0 && (
                <button 
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 sm:p-2 text-white z-10 transition-colors duration-200"
                  onClick={navigateToPrevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              )}
              
              {currentCategory && currentImageIndex < categoryImages[currentCategory].length - 1 && (
                <button 
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1 sm:p-2 text-white z-10 transition-colors duration-200"
                  onClick={navigateToNextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              )}
              
              <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
                {!loadedImages[`modal-${selectedImage.id}`] && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <Image 
                  src={selectedImage.photoUrl} 
                  alt={selectedImage.title} 
                  layout="fill" 
                  objectFit="contain"
                  className={`${!loadedImages[`modal-${selectedImage.id}`] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                  onLoadingComplete={() => handleImageLoad(`modal-${selectedImage.id}`)}
                />
              </div>
              <div className="p-2 sm:p-4 md:p-6 overflow-y-auto">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{selectedImage.title}</h3>
                <p className="text-xs sm:text-sm md:text-base">{selectedImage.description}</p>
                <div className="flex items-center justify-between mt-2 sm:mt-4">
                  <p className="text-xs text-gray-400">
                    Category: {formatCategoryName(selectedImage.category)}
                    {currentCategory && <span> | Image {currentImageIndex + 1} of {categoryImages[currentCategory].length}</span>}
                  </p>
                  <button 
                    onClick={() => downloadImage(selectedImage.photoUrl, selectedImage.title.replace(/\s+/g, '_'))}
                    disabled={downloading}
                    className="bg-[#370069] hover:bg-[#4b008e] transition-colors duration-200 text-white text-xs sm:text-sm rounded-md py-1 px-2 sm:px-3 flex items-center gap-1"
                  >
                    {downloading ? (
                      <>
                        <span className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
              <button 
                className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors duration-200"
                onClick={closeImageModal}
              >
                <X className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
