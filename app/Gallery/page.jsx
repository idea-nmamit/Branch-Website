"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronDown } from "lucide-react";

const categories = [
  "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC",
  "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION",
  "OUTREACH", "ORIENTATION","ALL_IMAGES"
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
    return category.replace(/_/g, ' ');
  };

  // Function to open image modal
  const openImageModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

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
    <div className="w-full min-h-screen px-3 sm:px-6 py-6 sm:py-10 text-white bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4]">
      {/* Category dropdown */}
      <div className="fixed top-20 right-4 z-30">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#370069] hover:bg-[#4b008e] text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg"
          >
            {selectedCategory ? formatCategoryName(selectedCategory) : "Select Category"}
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#17003A] border border-[#8617C0] rounded-md shadow-lg z-40 max-h-[60vh] overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left px-4 py-2 hover:bg-[#370069] text-sm"
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
      <div className="mb-10 max-w-5xl mx-auto">
        <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Highlights
        </motion.h2>
        {carouselLoading ? (
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-full h-40 md:h-52 rounded-lg" />
            ))}
          </div>
        ) : (
          <Carousel 
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {carouselImages.map((image) => (
                <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 cursor-pointer" onClick={() => openImageModal(image)}>
                  <div className="relative w-full h-40 md:h-52 rounded-lg overflow-hidden">
                    <Image
                      src={image.photoUrl}
                      alt={image.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
                      {image.title}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}
      </div>

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto">
        <motion.h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Gallery Categories
        </motion.h2>
        
        {galleryLoading ? (
          // Loading skeleton for categories
          <div className="space-y-10">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, imgIndex) => (
                    <Skeleton key={imgIndex} className="w-full h-48 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Display each category with its images
          <div className="space-y-16">
            {categories.map((category) => (
              <motion.div 
                key={category} 
                className="scroll-mt-24"
                id={category.toLowerCase()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-left border-b border-[#8617C0] pb-2">
                  {formatCategoryName(category)}
                </h3>
                
                {categoryImages[category] && categoryImages[category].length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {categoryImages[category].map((image) => (
                      <motion.div 
                        key={image.id} 
                        className="relative w-full h-36 sm:h-48 cursor-pointer"
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
                          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-1 sm:p-2 w-full text-center text-xs sm:text-sm truncate">
                          {image.title}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-lg italic opacity-70">No images available for this category</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
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
              <div className="relative w-full h-[50vh] md:h-[60vh]">
                <Image 
                  src={selectedImage.photoUrl} 
                  alt={selectedImage.title} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <div className="p-4 md:p-6 overflow-y-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-sm md:text-base">{selectedImage.description}</p>
                <p className="text-xs mt-4 text-gray-400">Category: {formatCategoryName(selectedImage.category)}</p>
              </div>
              <button 
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors duration-200"
                onClick={closeImageModal}
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
