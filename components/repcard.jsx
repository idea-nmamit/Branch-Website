"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Card = ({ name, imageUrl, designation, linkedin, github, instagram }) => {
  const [isClient, setIsClient] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setMousePos({
      x: (e.clientX - rect.left - centerX) / centerX,
      y: (e.clientY - rect.top - centerY) / centerY
    });
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Subtle ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-30" />
      
      <motion.div
        className="relative group"
        onMouseMove={handleMouseMove}
        whileHover={{ y: -12 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Main card */}
        <motion.div
          className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`
          }}
          whileHover={{
            borderColor: "rgba(168, 85, 247, 0.4)",
            boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)"
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Elegant inner border */}
          <div className="absolute inset-3 rounded-xl border border-white/5" />
          
          {/* Subtle light ray effect */}
          <motion.div
            className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-purple-400/0 via-purple-400/20 to-purple-400/0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Content */}
          <div className="relative p-8 flex flex-col items-center h-full justify-center">
            {/* Profile image */}
            <motion.div
              className="relative mb-8 group/image"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Image container with elegant border */}
              <div className="relative w-24 h-24">
                {/* Animated border ring */}
                <motion.div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.6), transparent)"
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Static elegant border */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/30 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-800 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {isClient && (
                        <motion.img
                          src={imageUrl}
                          alt="profile"
                          className="w-full h-full object-cover transition-all duration-500 group-hover/image:scale-110"
                          whileHover={{ filter: "brightness(1.1) contrast(1.1)" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Name and title */}
            <div className="text-center mb-8">
              <motion.h3
                className="text-2xl font-bold text-white mb-3 tracking-tight"
                whileHover={{ 
                  color: "#C084FC",
                  transition: { duration: 0.2 }
                }}
              >
                {name}
              </motion.h3>
              
              <div className="space-y-3">
                <p className="text-purple-200/80 font-medium text-sm tracking-wider uppercase">
                  {designation}
                </p>
                
                {/* Elegant animated underline */}
                <motion.div
                  className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent mx-auto"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Social links with premium styling */}
            <motion.div
              className="flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {[
                { href: instagram, icon: InstagramIcon, label: "Instagram", color: "hover:text-pink-400" },
                { href: github, icon: GithubIcon, label: "GitHub", color: "hover:text-white" },
                { href: linkedin, icon: LinkedinIcon, label: "LinkedIn", color: "hover:text-blue-400" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/social relative text-white/60 ${social.color} transition-all duration-300`}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Elegant hover background */}
                  <div className="absolute -inset-3 rounded-xl bg-white/5 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className="relative p-3">
                    <social.icon size={18} />
                  </div>
                  
                  {/* Subtle tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {social.label}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Subtle corner decorations */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/10 rounded-bl-lg" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Clean, minimal social icons
const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default Card;