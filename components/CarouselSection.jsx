"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselSection = React.memo(({ carouselImages, carouselLoading, placeholderLoaded, onImageClick, formatCategoryName }) => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const [lastHintTime, setLastHintTime] = useState(0);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  
  const navButtonTimeoutRef = useRef(null);
  const tapTimeoutRef = useRef(null);
  const tapCountRef = useRef(0);

  const handleImageLoad = useCallback((imageId) => {
    const key = `carousel-${imageId}`;
    setLoadedImages(prev => {
      if (!prev[key]) {
        return { ...prev, [key]: true };
      }
      return prev;
    });
  }, []);

  // Initialize loaded images when carousel images change
  useEffect(() => {
    if (carouselImages.length > 0) {
      setLoadedImages(prev => {
        const newStates = { ...prev };
        let hasChanges = false;
        
        carouselImages.forEach(image => {
          const key = `carousel-${image.id}`;
          if (!newStates.hasOwnProperty(key)) {
            newStates[key] = false;
            hasChanges = true;
          }
        });
        
        return hasChanges ? newStates : prev;
      });
    }
  }, [carouselImages]);

  // Auto-play carousel
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

  const handleCarouselInteraction = useCallback(() => {
    setShowNavButtons(true);

    if (navButtonTimeoutRef.current) {
      clearTimeout(navButtonTimeoutRef.current);
    }
    
    navButtonTimeoutRef.current = setTimeout(() => {
      setShowNavButtons(false);
    }, 3000);
  }, []);

  const handleDoubleTap = useCallback(() => {
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
  }, [isMobile, lastHintTime, handleCarouselInteraction]);

  const handleTapInteraction = useCallback((e) => {
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
  }, [isMobile, handleCarouselInteraction, handleDoubleTap]);

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

  const navigateCarousel = useCallback((direction) => {
    if (isCarouselTransitioning) return;
    
    setIsCarouselTransitioning(true);
    setCurrentCarouselIndex((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? carouselImages.length - 1 : prev - 1;
      } else {
        return (prev + 1) % carouselImages.length;
      }
    });
    setTimeout(() => setIsCarouselTransitioning(false), 1200);
    handleCarouselInteraction();
  }, [isCarouselTransitioning, carouselImages.length, handleCarouselInteraction]);

  const goToSlide = useCallback((index) => {
    if (!isCarouselTransitioning) {
      setIsCarouselTransitioning(true);
      setCurrentCarouselIndex(index);
      setTimeout(() => setIsCarouselTransitioning(false), 1200);
      handleCarouselInteraction();
    }
  }, [isCarouselTransitioning, handleCarouselInteraction]);

  if (carouselLoading || !placeholderLoaded) {
    return (
      <div className="flex justify-center items-center gap-4 sm:gap-6 px-4">
        <Skeleton className="w-[250px] h-[180px] md:w-[300px] md:h-[200px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
        <Skeleton className="w-[350px] h-[250px] md:w-[450px] md:h-[320px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
        <Skeleton className="w-[250px] h-[180px] md:w-[300px] md:h-[200px] rounded-xl bg-[#17003A]/40 flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden carousel-container">
      <div 
        className="flex justify-center items-center gap-4 md:gap-8 px-4 py-8 will-change-transform"
        onClick={handleTapInteraction}
        onTouchStart={handleTapInteraction}
      >
        {carouselImages.slice(0, 3).map((image, index) => {
          const adjustedIndex = (currentCarouselIndex + index - 1 + carouselImages.length) % carouselImages.length;
          const displayImage = carouselImages[adjustedIndex];
          const isCenter = index === 1;
          const imageKey = `carousel-${displayImage.id}`;
          
          return (
            <motion.div
              key={`${imageKey}-${adjustedIndex}`}
              className={`relative cursor-pointer rounded-xl overflow-hidden group flex-shrink-0 will-change-transform gallery-image ${
                isCenter 
                  ? 'w-[300px] h-[220px] sm:w-[350px] sm:h-[250px] md:w-[450px] md:h-[320px]'
                  : 'w-[200px] h-[140px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px]'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(displayImage);
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
              {!loadedImages[imageKey] && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-pink-900/60 animate-pulse rounded-xl backdrop-blur-sm" />
              )}
              
              <Image
                src={displayImage.photoUrl}
                alt={displayImage.title}
                fill
                className={`object-cover transition-opacity duration-1000 ${!loadedImages[imageKey] ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => handleImageLoad(displayImage.id)}
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
      
      <AnimatePresence>
        {(showNavButtons || !isMobile) && (
          <>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigateCarousel('prev');
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
                navigateCarousel('next');
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
            onClick={() => goToSlide(index)}
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
  );
});

CarouselSection.displayName = 'CarouselSection';

export default CarouselSection;
