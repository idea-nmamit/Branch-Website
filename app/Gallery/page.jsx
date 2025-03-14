"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "ALL", "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC",
  "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION",
  "OUTREACH", "ORIENTATION"
];

export default function GalleryPage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);

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
        groupedImages["ALL"] = [...data];
        
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

  // Format category display name
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ');
  };

  return (
    <div className="w-full min-h-screen px-6 py-10 text-white bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4]">
      {/* Carousel Section */}
      <div className="mb-10 max-w-5xl mx-auto">
        <motion.h2 className="text-5xl font-bold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Highlights
        </motion.h2>
        {carouselLoading ? (
          <div className="w-full max-w-3xl mx-auto flex gap-4">
            {Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-full h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <Carousel className="relative w-full max-w-3xl mx-auto">
            <CarouselContent>
              {carouselImages.map((image) => (
                <CarouselItem key={image.id} className="relative w-full h-64">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Image
                      src={image.photoUrl}
                      alt={image.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-lg"
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>

      {/* Category Sections */}
      <div className="max-w-6xl mx-auto">
        <motion.h2 className="text-3xl font-bold text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
                <h3 className="text-2xl font-bold mb-6 text-left border-b border-[#8617C0] pb-2">
                  {formatCategoryName(category)}
                </h3>
                
                {categoryImages[category] && categoryImages[category].length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryImages[category].map((image) => (
                      <motion.div 
                        key={image.id} 
                        className="relative w-full h-48"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image 
                          src={image.photoUrl} 
                          alt={image.title} 
                          layout="fill" 
                          objectFit="cover" 
                          className="rounded-lg shadow-md" 
                        />
                        <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
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
    </div>
  );
}
