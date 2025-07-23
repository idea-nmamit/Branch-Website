"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Code2, Quote, ChevronRight } from "lucide-react";

const Card = ({ name, imageUrl, role, linkedinUrl, quote, githubUrl, instagramUrl, portfolioUrl }) => {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto group"
      style={{ minHeight: '380px', height: 'auto' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Animated code symbols background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {['{ }', '< >', '[ ]', '( )'].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400/40 font-mono text-sm font-bold"
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      <motion.div        className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-slate-600/40 shadow-2xl"
        whileHover={{
          borderColor: "rgba(6, 182, 212, 0.6)",
          boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Tech grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full p-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-cyan-400 rounded-sm"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        </div>

        {/* Header section */}
        <div className="relative p-4 sm:p-6">          <motion.div
            className="flex items-center justify-between mb-4 sm:mb-6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div
                className="text-cyan-400 bg-cyan-400/10 p-1.5 sm:p-2 rounded-lg"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Code2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </motion.div>
              <div>
                <span className="text-cyan-300 font-mono text-[10px] sm:text-xs uppercase tracking-wider block">
                  Developer
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <motion.div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-green-400 font-mono text-[10px] sm:text-xs">Online</span>
                </div>
              </div>
            </div>
              {/* Social links - moved to top right */}
            <motion.div
              className="flex space-x-1 sm:space-x-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >              {[
                { href: githubUrl, icon: GithubIcon, color: 'hover:text-white', bg: 'hover:bg-white/10' },
                { href: linkedinUrl, icon: LinkedinIcon, color: 'hover:text-blue-400', bg: 'hover:bg-blue-400/10' },
                { href: instagramUrl, icon: InstagramIcon, color: 'hover:text-pink-400', bg: 'hover:bg-pink-400/10' },
                { href: portfolioUrl, icon: PortfolioIcon, color: 'hover:text-green-400', bg: 'hover:bg-green-400/10' }
              ].filter(social => social.href && social.href.trim() !== '').map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative text-gray-300 ${social.color} ${social.bg} transition-all duration-300 p-1.5 sm:p-2 rounded-lg border border-gray-600/20 hover:border-current/30`}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={14} className="sm:w-4 sm:h-4" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>{/* Profile section */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">            {/* Profile image */}
            <motion.div
              className="relative mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/60 relative bg-gradient-to-br from-cyan-400/10 to-cyan-600/10">                {/* Enhanced scan line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-full"
                  animate={{ y: [-96, 96] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Corner accents */}
                <div className="absolute top-0.5 left-0.5 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-t-2 border-cyan-400" />
                <div className="absolute top-0.5 right-0.5 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-t-2 border-cyan-400" />
                <div className="absolute bottom-0.5 left-0.5 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-b-2 border-cyan-400" />
                <div className="absolute bottom-0.5 right-0.5 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-cyan-400" />
                
                {isClient && (
                  <Image
                    src={imageUrl}
                    alt="profile"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="relative z-10"
                  />
                )}
              </div>
            </motion.div>

            {/* Name and role centered */}
            <div className="text-center">
              <motion.h3
                className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 tracking-wide"
                whileHover={{ color: "#06B6D4" }}
                transition={{ duration: 0.2 }}
              >
                {name}
              </motion.h3>
              
              <motion.div
                className="flex items-center justify-center space-x-2 mb-3 sm:mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                <span className="text-cyan-300 font-mono text-xs sm:text-sm tracking-wider">
                  {role}
                </span>
                <div className="w-1 h-1 bg-cyan-400 rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* Quote section */}
          <motion.div
            className="bg-black/40 rounded-xl p-3 sm:p-4 border border-cyan-400/30 mb-4 sm:mb-6 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Subtle tech pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <div className="grid grid-cols-4 gap-1 p-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full" />
                ))}
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3 relative z-10">
              <Quote size={14} className="sm:w-4 sm:h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light italic">
                {quote || "Building the future, one line of code at a time."}
              </p>
            </div>          </motion.div>
        </div>

        {/* Bottom tech accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </motion.div>
    </motion.div>
  );
};

// Social media icons (same as before)
const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="currentColor">
    <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
  </svg>
);

const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M256 32C114.62 32 0 146.62 0 288c0 113.31 73.38 209.06 175.47 242.8 12.82 2.34 17.53-5.56 17.53-12.33 0-6.08-.24-26.21-.35-47.56-71.34 15.51-86.42-30.96-86.42-30.96-11.65-29.59-28.46-37.46-28.46-37.46-23.27-15.91 1.76-15.59 1.76-15.59 25.7 1.81 39.23 26.39 39.23 26.39 22.88 39.21 59.99 27.9 74.62 21.33 2.32-16.56 8.94-27.91 16.27-34.33-56.95-6.48-116.81-28.47-116.81-126.74 0-27.99 10-50.86 26.39-68.78-2.64-6.5-11.43-32.69 2.51-68.19 0 0 21.51-6.88 70.45 26.27a243.69 243.69 0 01128.26 0c48.91-33.15 70.39-26.27 70.39-26.27 13.97 35.5 5.18 61.69 2.54 68.19 16.43 17.92 26.36 40.79 26.36 68.78 0 98.5-59.97 120.19-117.15 126.51 9.18 7.9 17.37 23.52 17.37 47.45 0 34.29-.3 61.92-.3 70.37 0 6.81 4.63 14.74 17.61 12.23C438.66 497 512 401.32 512 288 512 146.62 397.38 32 256 32z" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M100.28 448H7.4V149.76h92.88zM53.79 108.1C24.09 108.1 0 83.37 0 53.79a53.79 53.79 0 11107.58 0c0 29.58-24.1 54.31-53.79 54.31zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.7-58.4-23.9 0-38.2 16.1-44.4 31.6-2.3 5.5-2.8 13.1-2.8 20.8V448h-92.6s1.2-268.5 0-296.4h92.6v42c12.3-19 34.3-46.1 83.6-46.1 61 0 106.9 39.8 106.9 125.3V448z" />
  </svg>
);

const PortfolioIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor">
    <path d="M352 256C352 278.2 350.8 299.6 348.7 320H163.3C161.2 299.6 160 278.2 160 256C160 233.8 161.2 212.4 163.3 192H348.7C350.8 212.4 352 233.8 352 256zM503.9 192C508.4 212.5 510.1 233.7 510.1 256C510.1 278.3 508.4 299.5 503.9 320H380.8C382.9 299.4 384 277.1 384 256C384 234.9 382.9 212.6 380.8 192H503.9zM493.4 160H376.7C366.7 96.1 346.9 42.6 321.4 8.442C399.8 29.09 461.9 86.57 493.4 160zM344.3 160H167.7C173.8 123.6 183.2 91.38 194.7 65.35C205.2 41.74 216.9 24.61 228.2 14.4C239.7 3.178 248.7 0 256 0C263.3 0 272.3 3.178 283.8 14.4C295.1 24.61 306.8 41.74 317.3 65.35C328.8 91.38 338.2 123.6 344.3 160H344.3zM18.61 160C50.09 86.57 112.2 29.09 190.6 8.442C165.1 42.6 145.3 96.1 135.3 160H18.61zM131.2 192C129.1 212.6 128 234.9 128 256C128 277.1 129.1 299.4 131.2 320H8.065C3.617 299.5 1.974 278.3 1.974 256C1.974 233.7 3.617 212.5 8.065 192H131.2zM18.61 352C50.09 425.4 112.2 482.9 190.6 503.6C165.1 469.4 145.3 415.9 135.3 352H18.61zM167.7 352C173.8 388.4 183.2 420.6 194.7 446.6C205.2 470.3 216.9 487.4 228.2 497.6C239.7 508.8 248.7 512 256 512C263.3 512 272.3 508.8 283.8 497.6C295.1 487.4 306.8 470.3 317.3 446.6C328.8 420.6 338.2 388.4 344.3 352H167.7zM493.4 352C461.9 425.4 399.8 482.9 321.4 503.6C346.9 469.4 366.7 415.9 376.7 352H493.4z" />
  </svg>
);

export default Card;