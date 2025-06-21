"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Logo from '@/public/Logo-Light.png'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  return (
    <nav className="w-full bg-gradient-to-r from-[#17003A] to-[#34006e] text-white py-3 px-4 md:px-6 shadow-lg backdrop-blur-sm sticky top-0 z-50 border-b border-[#8617c0]/30">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <div className="relative w-28 h-12 md:w-32 md:h-14 overflow-hidden">
            {mounted && (
              <Image 
                src={Logo}
                alt="IDEA Logo" 
                fill
                priority
                sizes="(max-width: 768px) 7rem, 8rem"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
          <NavItem href="/" label="Home" active={pathname === '/'} />
          <NavItem href="/Events" label="Events" active={pathname === '/Events'} />
          <NavItem href="/Achievements" label="Achievements" active={pathname === '/Achievements'} />
          <NavItem href="/Gallery" label="Gallery" active={pathname === '/Gallery'} />
          <NavItem href="/Team-Page" label="Team" active={pathname === '/Team-Page'} />
          <NavItem href="/Faculty" label="Faculty" active={pathname === '/Faculty'} />
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Menu"
            className="md:hidden text-white hover:bg-white/20 rounded-full w-9 h-9 p-0 flex items-center justify-center transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-[3.75rem] left-0 right-0 bg-gradient-to-b from-[#34006e] to-[#17003A] shadow-xl z-50 overflow-hidden mt-[16px]"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 }}
              className="flex flex-col space-y-1 p-3 max-h-[70vh] overflow-y-auto"
            >
              <MobileNavItem href="/" label="Home" active={pathname === '/'} />
              <MobileNavItem href="/Events" label="Events" active={pathname === '/Events'} />
              <MobileNavItem href="/Achievements" label="Achievements" active={pathname === '/Achievements'} />
              <MobileNavItem href="/Gallery" label="Gallery" active={pathname === '/Gallery'} />
              <MobileNavItem href="/Team-Page" label="Team" active={pathname === '/Team-Page'} />
              <MobileNavItem href="/Faculty" label="Faculty" active={pathname === '/Faculty'} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavItem = ({ href, label, active }) => {
  return (
    <Link 
      href={href} 
      className={`text-white font-medium text-sm uppercase tracking-wider relative group py-2 px-3 rounded-md transition-colors flex items-center ${
        active ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      <span className="relative z-10 font-sans" style={{ 
        letterSpacing: '0.05em',
        fontVariationSettings: "'wght' 500",
        textShadow: active ? '0 0 10px rgba(246, 1, 78, 0.5)' : 'none'
      }}>
        {label}
      </span>
      <span className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-[#f6014e] to-[#ff4895] transition-all duration-300 ease-in-out ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></span>
    </Link>
  );
};

const MobileNavItem = ({ href, label, active }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href={href} 
        className={`text-white px-4 py-3 rounded-md w-full block transition-all duration-200 flex items-center ${
          active 
            ? 'bg-gradient-to-r from-[#f6014e]/30 to-[#f6014e]/10 border-l-2 border-[#f6014e]' 
            : 'hover:bg-white/10 hover:border-l-2 hover:border-white/50'
        }`}
      >
        <span style={{ 
          fontFamily: 'var(--font-sans)',
          fontWeight: active ? '600' : '500',
          fontSize: '0.875rem',
          letterSpacing: '0.04em',
          textShadow: active ? '0 0 15px rgba(255, 255, 255, 0.4)' : 'none'
        }}>
          {label}
        </span>
        {active && <ChevronDown className="ml-auto h-4 w-4 rotate-90" />}
      </Link>
    </motion.div>
  );
};

export default Navbar;