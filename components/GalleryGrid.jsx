"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";

const GalleryGrid = React.memo(({ 
  categories, 
  categoryImages, 
  galleryLoading, 
  placeholderLoaded, 
  onImageClick, 
  formatCategoryName,
  loadedImages,
  onImageLoad
}) => {
  const GalleryImage = React.memo(({ image, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imageKey = `gallery-${image.id}`;

    React.useEffect(() => {
      if (loadedImages[imageKey]) {
        setIsLoaded(true);
      }
    }, [imageKey]);
    
    const handleLocalImageLoad = useCallback(() => {
      setIsLoaded(true);
      onImageLoad(`gallery-${image.id}`, false);
    }, [image.id]);
    
    const handleImageError = useCallback(() => {
      setHasError(true);
      setIsLoaded(false);
    }, []);
    
    return (
      <motion.div 
        className="relative aspect-square cursor-pointer rounded-xl overflow-hidden group will-change-transform gallery-image"
        onClick={() => onClick(image)}
        whileHover={{ 
          scale: 1.05, 
          y: -5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
        layout={false}
        layoutId={`gallery-${image.id}`}
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
          <OptimizedImage 
            src={image.photoUrl} 
            alt={image.title || `Gallery image from ${image.category || 'event'}`}
            fill
            className={`object-cover transition-opacity duration-700 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
            onLoadComplete={handleLocalImageLoad}
            priority={false}
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
        
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-purple-400/0 group-hover:border-purple-400/30 transition-all duration-300"
          initial={false}
        />
      </motion.div>
    );
  }, (prevProps, nextProps) => {
    return (
      prevProps.image.id === nextProps.image.id &&
      prevProps.image.photoUrl === nextProps.image.photoUrl &&
      prevProps.image.title === nextProps.image.title &&
      prevProps.image.description === nextProps.image.description &&
      prevProps.onClick === nextProps.onClick
    );
  });

  GalleryImage.displayName = 'GalleryImage';

  if (galleryLoading || !placeholderLoaded) {
    return (
      <div className="space-y-16">
        {Array(3).fill(0).map((_, index) => (
          <motion.div 
            key={index} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-8 w-48 rounded-full bg-[#17003A]/40 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {Array(4).fill(0).map((_, imgIndex) => (
                <div key={imgIndex} className="aspect-square rounded-xl bg-[#17003A]/40 animate-pulse" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <>
      {categories
        .filter(category => categoryImages[category]?.length > 0)
        .map((category, categoryIndex) => (
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
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 gallery-grid"
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
                <GalleryImage image={image} onClick={onImageClick} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      ))}
    </>
  );
});

GalleryGrid.displayName = 'GalleryGrid';

export default GalleryGrid;
