"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");

  // Fetch carousel images
  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        setCarouselImages(data);
        setCarouselLoading(false);
      })
      .catch(err => {
        console.error("Error fetching carousel images:", err);
        setCarouselLoading(false);
      });
  }, []);

  // Fetch all images and organize by category
  useEffect(() => {
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
  }, []);

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

  // Handler for category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
    
    // Scroll to the selected category section
    const element = document.getElementById(category.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 text-white bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4]">
      {/* Category dropdown - Adjusted for better mobile positioning */}
      <div className="fixed top-20 sm:top-24 md:top-26 right-2 sm:right-6 md:right-10 z-30">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#370069] hover:bg-[#4b008e] text-white py-1 px-2 sm:py-2 sm:px-4 rounded-lg flex items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
          >
            {selectedCategory ? formatCategoryName(selectedCategory) : "Select Category"}
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 sm:mt-2 w-44 sm:w-48 bg-[#17003A] border border-[#8617C0] rounded-md shadow-lg z-40 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto">
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

      {/* Carousel Section */}
      <div className="mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto">
        <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Highlights
        </motion.h2>
        {carouselLoading ? (
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-full h-40 sm:h-48 md:h-52 lg:h-72 rounded-lg" />
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
                    <Image
                      src={image.photoUrl}
                      alt={image.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      style={{ borderRadius: '0.5rem' }} /* Fixed rounded corners during animation */
                    />
                    <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full text-center text-xs sm:text-sm">
                      {image.title}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:-left-5 lg:-left-14" />
            <CarouselNext className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:-right- lg:-right-14" />
          </Carousel>
        )}
      </div>

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto">
        <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Gallery Categories
        </motion.h2>
        
        {galleryLoading ? (
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
                    {categoryImages[category].map((image) => (
                      <motion.div 
                        key={image.id} 
                        className="relative w-full h-32 xs:h-40 sm:h-48 md:h-56 lg:h-60 cursor-pointer overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => openImageModal(image)}
                      >
                        <Image 
                          src={image.photoUrl} 
                          alt={image.title} 
                          layout="fill" 
                          objectFit="cover" 
                          className="rounded-lg"
                        />
                        <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full text-center text-xs sm:text-sm truncate">
                          {image.title}
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
                <Image 
                  src={selectedImage.photoUrl} 
                  alt={selectedImage.title} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <div className="p-2 sm:p-4 md:p-6 overflow-y-auto">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{selectedImage.title}</h3>
                <p className="text-xs sm:text-sm md:text-base">{selectedImage.description}</p>
                <p className="text-xs mt-2 sm:mt-4 text-gray-400">
                  Category: {formatCategoryName(selectedImage.category)}
                  {currentCategory && <span> | Image {currentImageIndex + 1} of {categoryImages[currentCategory].length}</span>}
                </p>
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
