"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/Carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC",
  "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION",
  "OUTREACH", "ORIENTATION"
];

export default function GalleryPage() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(false);

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

  // Fetch category-based images
  const fetchCategoryImages = (category) => {
    setSelectedCategory(category);
    setGalleryLoading(true);
    fetch(`/api/gallery?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setFilteredImages(data);
        setGalleryLoading(false);
      })
      .catch(err => {
        console.error("Error fetching category images:", err);
        setGalleryLoading(false);
      });
  };

  return (
    <div className="w-full min-h-screen px-6 py-10 text-white bg-gradient-to-br from-[#17003A] to-[#370069] dark:from-[#8617C0] dark:to-[#6012A4]">
      {/* Carousel Section */}
      <div className="mb-10 max-w-5xl mx-auto">
        <motion.h2 className="text-5xl font-bold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Featured Gallery
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

      {/* Category-Based Filter Section */}
      <div className="max-w-6xl mx-auto">
        <motion.h2 className="text-3xl font-bold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Gallery Categories
        </motion.h2>
        <div className="flex justify-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={galleryLoading}>{galleryLoading ? "Loading..." : selectedCategory}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#370069] text-white border border-[#8617C0]">
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => fetchCategoryImages(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Gallery Grid Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryLoading ? (
            Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-full h-48 rounded-lg" />
            ))
          ) : (
            filteredImages.map((image) => (
              <motion.div key={image.id} className="relative w-full h-48" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Image src={image.photoUrl} alt={image.title} layout="fill" objectFit="cover" className="rounded-lg shadow-md" />
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
                  {image.title}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
