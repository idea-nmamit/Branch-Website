"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useTheme } from 'next-themes';
import NeuralNetwork from "./NeuralNetwork";

const HomePage = () => {
  const { theme, resolvedTheme } = useTheme();
  const logoRef = useRef(null);
  const subtitleContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const wordsRefs = useRef([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  const titleText = "Intelligence and Data Science Engineers' Association";
  const titleWords = titleText.split(' ');

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && (theme === 'dark' || resolvedTheme === 'dark')
    ? "/Logo-Dark.png"
    : "/Logo-Light.png";

  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#17003A] to-[#34006e] dark:from-[#8617C0] dark:to-[#6e11a0] text-white overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center transform -translate-y-16 px-4 container mx-auto">
        {/* Logo and Title */}
        <div className="absolute">
          <NeuralNetwork /></div>
        <div className="w-full max-w-4xl mx-auto text-center">
          <div ref={logoRef} className="text-white flex items-center justify-center mb-4 md:mb-8">
            <div className="relative w-52 h-20 sm:w-64 sm:h-24 md:w-96 md:h-40 lg:w-[450px] lg:h-48">
              {mounted && (
                <Image
                  src={logoSrc}
                  alt="IDEA"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </div>

          <div
            ref={subtitleContainerRef}
            className="flex flex-wrap justify-center gap-x-2 gap-y-1 md:gap-y-2 max-w-[90%] mx-auto"
          >
            {titleWords.map((word, index) => (
              <div
                key={index}
                ref={el => wordsRefs.current[index] = el}
                className="relative select-none font-sans tracking-tight"
                style={{
                  fontSize: 'clamp(1.125rem, 5vw, 2.8rem)',
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
      </main>

      {/* News Badge */}
      <div ref={badgeRef} className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-12 md:left-12 z-20">
        <Link href="/News">
          <div className="bg-gradient-to-r from-pink-300 to-purple-300 text-[#17003A] px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-lg tracking-wide cursor-pointer">
            Latest News
          </div>
        </Link>

      </div>
    </div>
  );
};

export default HomePage;