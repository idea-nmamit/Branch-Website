"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import NeuralNetwork from "./NeuralNetwork";
import PageLoader from "./PageLoader";

const HomePage = () => {
  const logoRef = useRef(null);
  const subtitleContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const wordsRefs = useRef([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  const titleText = "Intelligence and Data Science Engineers' Association";
  const titleWords = titleText.split(' ');
  
  // Always use light logo
  const logoSrc = "/Logo-Light.png";

  useEffect(() => {
    // Check if this is the initial app load
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('appLoaded');
      if (!hasLoaded) {
        setShouldShowLoader(true);
        setIsLoading(true);
        sessionStorage.setItem('appLoaded', 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (shouldShowLoader && isLoading) return;

    gsap.killTweensOf([logoRef.current, badgeRef.current, ...wordsRefs.current]);

    gsap.set(logoRef.current, { opacity: 0, y: -50 });
    gsap.set(badgeRef.current, { opacity: 0, y: 50 });

    if (wordsRefs.current.length) {
      wordsRefs.current.forEach(word => {
        gsap.set(word, {
          opacity: 0,
          x: () => Math.random() * 300 - 150,
          y: () => Math.random() * 200 - 100,
          rotation: () => Math.random() * 90 - 45,
          scale: 0.8
        });
      });
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out"
    });

    tl.to(wordsRefs.current, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1,
      stagger: {
        each: 0.06,
        from: "start",
        ease: "power1.inOut"
      },
      ease: "back.out(1.2)"
    }, "-=0.5");

    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1)"
    }, "-=0.5");

    return () => {
      gsap.killTweensOf([logoRef.current, badgeRef.current, ...wordsRefs.current]);
    };
  }, [shouldShowLoader, isLoading]);

  const handleWordClick = useCallback((index) => {
    const now = Date.now();
    if (now - lastClickTime < 500) return;

    setLastClickTime(now);
    const wordElement = wordsRefs.current[index];

    const tl = gsap.timeline();

    tl.to(wordElement, {
      keyframes: [
        { x: -3, y: 2, rotation: -1, scale: 1.03, duration: 0.1 },
        { x: 3, y: -2, rotation: 1, scale: 0.97, duration: 0.1 },
        { x: 0, y: 0, rotation: 0, opacity: 0.7, scale: 0.8, duration: 0.15 }
      ],
      ease: "power1.inOut"
    });

    tl.to(wordElement, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.5)"
    });
  }, [lastClickTime]);

  const finishLoading = () => {
    setIsLoading(false);
    setShouldShowLoader(false);
  };
  // If we don't want to show loading, render content directly
  if (!shouldShowLoader) {
    return (
      <div className="relative bg-gradient-to-br from-[#17003A] to-[#34006e] text-white overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Neural Network Background - positioned absolutely to cover entire background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <NeuralNetwork />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full w-full relative z-10 px-4 sm:px-6 md:px-8" style={{ transform: 'translateY(-8vh)' }}>
          {/* Logo and Title */}
          <div className="w-full max-w-6xl text-center">
            <div ref={logoRef} className="text-white flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
              <div className="relative w-64 h-24 sm:w-72 sm:h-28 md:w-96 md:h-40 lg:w-[450px] lg:h-48">
                <Image
                  src={logoSrc}
                  alt="IDEA"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              ref={subtitleContainerRef}
              className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 md:gap-y-2 mx-auto max-w-5xl"
            >
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  ref={el => wordsRefs.current[index] = el}
                  className="relative select-none font-sans tracking-tight cursor-pointer"
                  style={{
                    fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                    fontWeight: index === 0 || index === 2 ? 800 : 600,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
                    letterSpacing: index === 0 || index === 3 ? '-0.02em' : '-0.01em',
                    willChange: 'transform'
                  }}
                  onClick={() => handleWordClick(index)}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Badge */}
        <div ref={badgeRef} className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-12 md:left-12 z-20">
          <Link href="/News">
            <div className="bg-gradient-to-r from-pink-300 to-purple-300 text-[#17003A] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-lg tracking-wide cursor-pointer transition-all duration-300 hover:scale-105">
              Latest News
            </div>
          </Link>
        </div>
      </div>
    );
  }
    // Only show PageLoader when we actually want loading (initial app load)
  return (
    <PageLoader finishLoading={finishLoading}>
      <div className="relative bg-gradient-to-br from-[#17003A] to-[#34006e] text-white overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Neural Network Background - positioned absolutely to cover entire background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <NeuralNetwork />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full w-full relative z-10 px-4 sm:px-6 md:px-8" style={{ transform: 'translateY(-8vh)' }}>
          {/* Logo and Title */}
          <div className="w-full max-w-6xl text-center">
            <div ref={logoRef} className="text-white flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
              <div className="relative w-64 h-24 sm:w-72 sm:h-28 md:w-96 md:h-40 lg:w-[450px] lg:h-48">
                <Image
                  src={logoSrc}
                  alt="IDEA"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              ref={subtitleContainerRef}
              className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 md:gap-y-2 mx-auto max-w-5xl"
            >
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  ref={el => wordsRefs.current[index] = el}
                  className="relative select-none font-sans tracking-tight cursor-pointer"
                  style={{
                    fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                    fontWeight: index === 0 || index === 2 ? 800 : 600,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
                    letterSpacing: index === 0 || index === 3 ? '-0.02em' : '-0.01em',
                    willChange: 'transform'
                  }}
                  onClick={() => handleWordClick(index)}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Badge */}
        <div ref={badgeRef} className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-12 md:left-12 z-20">
          <Link href="/News">
            <div className="bg-gradient-to-r from-pink-300 to-purple-300 text-[#17003A] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-lg tracking-wide cursor-pointer transition-all duration-300 hover:scale-105">
              Latest News
            </div>
          </Link>
        </div>

      </div>
    </PageLoader>
  );
};

export default HomePage;