"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
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
  const [api, setApi] = useState(null);
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
  const fetchedRef = useRef(false); // To track if we've already fetched data
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [shareError, setShareError] = useState(false);

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

  // Fetch carousel images
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

  // Fetch all images and organize by category
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

  // Autoplay carousel effect
  useEffect(() => {
    if (!api || carouselLoading) return;

    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(autoplayInterval);
  }, [api, carouselLoading]);

  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalImageLoaded(false); // Reset modal image load state
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
    setModalImageLoaded(false); // Reset modal image load state when navigating
    const newIndex = currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(categoryImages[currentCategory][newIndex]);
  };

  const navigateToNextImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || currentImageIndex >= categoryImages[currentCategory].length - 1) return;
    setModalImageLoaded(false); // Reset modal image load state when navigating
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
      
      // Create a temporary anchor element
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
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(image.photoUrl);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      setShareError(true);
      
      // Try fallback to clipboard if sharing failed
      try {
        await navigator.clipboard.writeText(image.photoUrl);
        alert('Image URL copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to share image. Please try again later.');
      }
    }
  };

  const GalleryImage = ({ image, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    return (
      <motion.div 
        className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group"
        onClick={() => onClick(image)}
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 animate-pulse rounded-xl" />
        )}
        
        <Image 
          src={image.photoUrl} 
          alt={image.title} 
          fill
          className={`object-cover transition-opacity duration-300 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-medium text-sm truncate">{image.title}</h3>
          <p className="text-xs text-purple-300 truncate">
            {image.description?.substring(0, 30)}{image.description?.length > 30 ? '...' : ''}
          </p>
        </div>
      </motion.div>
    );
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} className="w-full aspect-video rounded-xl bg-[#17003A]/40" />
                ))}
              </div>
            ) : (
              <Carousel 
                className="w-full"
                opts={{ align: "start", loop: true }}
                setApi={setApi}
              >
                <CarouselContent>
                  {carouselImages.map((image) => (
                    <CarouselItem key={image.id} className="basis-full sm:basis-1/2 md:basis-1/3">
                      <motion.div 
                        className="relative aspect-video cursor-pointer rounded-xl overflow-hidden group"
                        onClick={() => openImageModal(image)}
                        whileHover={{ scale: 0.98 }}
                      >
                        {!loadedImages[image.id] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 animate-pulse rounded-xl" />
                        )}
                        
                        <Image
                          src={image.photoUrl}
                          alt={image.title}
                          fill
                          className={`object-cover transition-opacity duration-300 ${!loadedImages[image.id] ? 'opacity-0' : 'opacity-100'}`}
                          onLoadingComplete={() => handleImageLoad(image.id)}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-medium">{image.title}</h3>
                          <p className="text-xs text-purple-300">{formatCategoryName(image.category)}</p>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 text-white" />
                <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 text-white" />
              </Carousel>
            )}
          </section>

          <section className="space-y-12 sm:space-y-16">
            {galleryLoading || !placeholderLoaded ? (
              <div className="space-y-12">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded-full bg-[#17003A]/40" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                      {Array(4).fill(0).map((_, imgIndex) => (
                        <Skeleton key={imgIndex} className="aspect-square rounded-xl bg-[#17003A]/40" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <motion.section 
                  key={category} 
                  id={category.toLowerCase()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-2">
                      <span className="w-2 h-6 bg-[#8617C0] rounded-full"></span>
                      {formatCategoryName(category)}
                    </h2>
                    {categoryImages[category]?.length > 4 && (
                      <button className="text-sm text-purple-400 hover:text-white transition-colors">
                        View All
                      </button>
                    )}
                  </div>
                  
                  {categoryImages[category]?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                      {categoryImages[category].slice(0, 8).map((image) => (
                        <GalleryImage key={image.id} image={image} onClick={openImageModal} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-[#8617C0]/20 rounded-xl border border-[#8617C0]/30">
                      <p className="text-purple-300">No images available in this category</p>
                    </div>
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