"use client"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

const HomePage = () => {
  const logoRef = useRef(null);
  const subtitleContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const wordsRefs = useRef([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  const titleText = "Intelligence and Data Science Engineers' Association";
  const titleWords = titleText.split(' ');
  
  useEffect(() => {
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
  }, []);

  const handleWordClick = (index) => {
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#17003A] to-[#34006e] dark:from-[#8617C0] dark:to-[#6e11a0] text-white overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 md:pt-20 lg:pt-24 px-4 container mx-auto">
        {/* Logo and Title */}
        <div className="w-full max-w-4xl mx-auto">
          <div ref={logoRef} className="text-white flex items-center justify-center mb-6 md:mb-10">
            <div className="relative w-64 h-24 md:w-96 md:h-40 lg:w-[450px] lg:h-48">
              <Image
                src="/Logo-Dark.png"
                alt="IDEA"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div ref={subtitleContainerRef} className="mt-6 md:mt-8 flex flex-wrap justify-center gap-x-2 gap-y-2 relative">
            {titleWords.map((word, index) => (
              <div
                key={index}
                ref={el => wordsRefs.current[index] = el}
                className="relative select-none font-['Montserrat'] font-bold"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
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
      
      {/* News Badge - Fixed JSX structure */}
      <div ref={badgeRef} className="fixed bottom-6 left-6 md:bottom-12 md:left-12 z-20">
        <Link href="/news" className="inline-block transition-transform hover:scale-105">
          <div className="bg-gradient-to-r from-pink-300 to-purple-300 text-[#17003A] px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-base md:text-lg shadow-lg">
            Latest News
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;