'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#17003A] to-[#34006e] text-white"
    >
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[#f6014e]/10 blur-3xl"
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -40, 20, -10, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        style={{
          top: '20%',
          left: '60%',
        }}
      />
      
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full bg-[#8617C0]/20 blur-3xl"
        animate={{
          x: [0, -30, 20, -10, 0],
          y: [0, 30, -20, 10, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        style={{
          bottom: '10%',
          right: '60%',
        }}
      />

      <div className="z-10 text-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div 
            className="text-[180px] md:text-[220px] font-bold leading-none select-none"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#f6014e] to-white">404</span>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#8617C0]/30 to-[#f6014e]/30 rounded-full blur-[100px] -z-10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-8"
        >
          <div className="h-1 w-16 bg-gradient-to-r from-[#8617C0] to-[#f6014e] mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl font-light mb-8"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/70 text-lg mb-10 max-w-md mx-auto"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/">
            <Button 
              className="px-6 py-5 h-auto rounded-md bg-gradient-to-r from-[#8617C0] to-[#f6014e] hover:from-[#8617C0]/90 hover:to-[#f6014e]/90 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-[#f6014e]/20"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Homepage
            </Button>
          </Link>
          
          <Button
            variant="outline" 
            className="px-6 py-5 h-auto border-white/20 hover:bg-white/10 text-white hover:text-white bg-black"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    </div>
  );
}