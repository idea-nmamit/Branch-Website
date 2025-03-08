"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo_Dark from '@/public/Logo-Dark.png';
import Logo_Light from '@/public/Logo-Light.png';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="w-full bg-[#8617c0] dark:bg-[#340181] text-white py-3 px-4 md:px-6 shadow-lg sticky top-0 z-50 border-b border-[#8617c0]/30 dark:border-[#340181]/30">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative w-24 h-11 md:w-28 md:h-12">
            {mounted && (
              <Image 
                src={theme === 'dark' ? Logo_Dark : Logo_Light}
                alt="IDEA Logo" 
                fill
                priority
                sizes="(max-width: 768px) 6rem, 7rem"
                className="object-contain"
              />
            )}
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <NavItem href="/" label="Home" />
          <NavItem href="/Events" label="Events" />
          <NavItem href="/Achievements" label="Achievements" />
          <NavItem href="/Gallery" label="Gallery" />
          <NavItem href="/Team-Page" label="Team" />
          <NavItem href="/Faculty" label="Faculty" />
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && (theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            ))}
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Menu"
            className="md:hidden text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[3.375rem] left-0 right-0 bg-[#8617c0] dark:bg-[#340181] shadow-xl z-50 animate-fadeIn">
          <div className="flex flex-col space-y-1 p-3 max-h-[70vh] overflow-y-auto">
            <MobileNavItem href="/" label="Home" onClick={toggleMobileMenu} />
            <MobileNavItem href="/Events" label="Events" onClick={toggleMobileMenu} />
            <MobileNavItem href="/Achievements" label="Achievements" onClick={toggleMobileMenu} />
            <MobileNavItem href="/Gallery" label="Gallery" onClick={toggleMobileMenu} />
            <MobileNavItem href="/Team-Page" label="Team" onClick={toggleMobileMenu} />
            <MobileNavItem href="/Faculty" label="Faculty" onClick={toggleMobileMenu} />
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ href, label }) => {
  return (
    <Link 
      href={href} 
      className="text-white font-medium text-sm uppercase tracking-wide relative group py-1 px-1"
    >
      {label}
      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#f6014e] group-hover:w-full transition-all duration-300 ease-in-out"></span>
    </Link>
  );
};

const MobileNavItem = ({ href, label, onClick }) => {
  return (
    <Link 
      href={href} 
      className="text-white hover:bg-[#f6014e]/20 px-4 py-2.5 rounded-md w-full block transition-colors font-medium text-sm tracking-wide flex items-center"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;