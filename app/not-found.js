'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);

    const createParticle = () => {
      if (!document.getElementById('particleContainer')) return;
      
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight / 2;
      
      const size = Math.floor(Math.random() * 10) + 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      
      document.getElementById('particleContainer').appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 3000);
    };
    
    const particleInterval = setInterval(createParticle, 200);
    
    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 bg-gradient-to-b from-background to-background/80 text-foreground">
      <div id="particleContainer" className="absolute inset-0 z-0" />
      
      <div className={`z-10 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="relative">
          <h1 className="text-9xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-500">404</h1>
          <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-500 rounded-full -z-10"></div>
        </div>
        
        <div className="my-8">
          <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-light mb-8">Page Not Found</h2>
        
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link href="/">
          <Button 
            className="px-8 py-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:scale-105 h-auto"
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
      
      <style jsx>{`
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: float 3s ease-in infinite;
          background: radial-gradient(circle, hsla(var(--primary)/0.3) 0%, hsla(var(--primary)/0) 70%);
        }
        
        :global(.dark) .particle {
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
        }
        
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
