"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { 
  Linkedin, 
  Github, 
  Instagram, 
  Mail, 
  MapPin,
  ExternalLink
} from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/Events", label: "Events" },
    { href: "/Achievements", label: "Achievements" },
    { href: "/Gallery", label: "Gallery" },
    { href: "/Team-Page", label: "Team" },
    { href: "/Faculty", label: "Faculty" },
  ];

  const socialLinks = [
    { 
      href: "https://www.linkedin.com/company/idea-nmamit", 
      icon: Linkedin, 
      label: "LinkedIn", 
      color: "bg-gradient-to-br from-[#0A66C2]/20 to-[#0077b5]/10",
      hoverColor: "hover:shadow-[#0A66C2]/30" 
    },
    { 
      href: "https://github.com/idea-nmamit", 
      icon: Github, 
      label: "GitHub", 
      color: "bg-gradient-to-br from-[#333]/20 to-[#24292e]/10",
      hoverColor: "hover:shadow-[#333]/30"
    },
    { 
      href: "https://instagram.com/idea_nmamit", 
      icon: Instagram, 
      label: "Instagram", 
      color: "bg-gradient-to-br from-[#E1306C]/20 to-[#C13584]/10",
      hoverColor: "hover:shadow-[#E1306C]/30"
    },
  ];

  return (
    <footer className="w-full relative overflow-hidden py-16 bg-[#17003A] dark:bg-[#8617C0]">
      {/* Background with gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute -bottom-16 left-0 right-0 h-36 bg-gradient-to-t from-black/10 to-transparent"></div>
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#8617C0]/30 dark:bg-[#17003A]/30 rounded-full blur-3xl -z-10"
          animate={{ 
            x: [0, 10, 0], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#f6014e]/20 rounded-full blur-3xl -z-10"
          animate={{ 
            x: [0, -10, 0], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and About */}
          <div className="flex flex-col space-y-4">
            <motion.div 
              className="relative w-40 h-16 mb-2 mx-auto md:mx-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" aria-label="Go to homepage">
                {resolvedTheme === "dark" ? (
                  <Image
                    src="/Logo-Dark.png"
                    alt="IDEA Logo"
                    fill
                    sizes="10rem"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                ) : (
                  <Image
                    src="/Logo-Light.png"
                    alt="IDEA Logo"
                    fill
                    sizes="10rem"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                )}
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-[#8617c0]/30 dark:border-[#340181]/30 shadow-xl hover:shadow-[#f6014e]/10 transition-all duration-500 w-full">
                <CardContent className="p-4">
                  <p className="text-sm text-white leading-relaxed text-center md:text-left font-medium">
                    IDEA is a vibrant student community dedicated to fostering innovation and excellence through collaboration and creativity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col text-white">
            <h3 className="font-bold text-xl mb-6 relative text-center md:text-left">
              <span className="inline-block">
                Navigation
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 md:right-auto w-full md:w-16 h-1 bg-gradient-to-r from-[#340181] to-[#f6014e] rounded-full shadow-lg shadow-[#f6014e]/30"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </span>
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-[#8617c0]/30 dark:border-[#340181]/30 shadow-xl hover:shadow-[#f6014e]/10 transition-all duration-500 w-full">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-y-4 w-full">
                    {navigationLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Link
                          href={link.href}
                          className="text-sm font-medium text-white hover:text-white group transition-all duration-300 flex items-center"
                          aria-label={`Navigate to ${link.label}`}
                        >
                          <motion.span 
                            className="h-1.5 w-0 rounded-full mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"
                            style={{
                              background: `linear-gradient(90deg, rgb(52, 1, 129) ${index * 16}%, rgb(246, 1, 78) 100%)`,
                            }}
                            whileHover={{ width: "0.5rem" }}
                          />
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col text-white">
            <h3 className="font-bold text-xl mb-6 relative text-center md:text-left">
              <span className="inline-block">
                Connect With Us
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 md:right-auto w-full md:w-16 h-1 bg-gradient-to-r from-[#340181] to-[#f6014e] rounded-full shadow-lg shadow-[#f6014e]/30"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-[#8617c0]/30 dark:border-[#340181]/30 shadow-xl hover:shadow-[#f6014e]/10 transition-all duration-500 w-full">
                <CardContent className="p-6 space-y-4">
                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-br from-[#340181]/30 to-[#f6014e]/30 p-2 rounded-full text-white group-hover:from-[#340181]/40 group-hover:to-[#f6014e]/40 transition-all duration-300">
                      <Mail size={16} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <a 
                      href="mailto:idea@nmamit.in" 
                      className="text-sm font-medium hover:text-[#f6014e] transition-colors flex items-center gap-1 group-hover:gap-2 duration-300"
                      aria-label="Send email to IDEA"
                    >
                      idea@nmamit.in
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-br from-[#340181]/30 to-[#f6014e]/30 p-2 rounded-full text-white group-hover:from-[#340181]/40 group-hover:to-[#f6014e]/40 transition-all duration-300">
                      <MapPin size={16} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <a 
                      href="https://maps.app.goo.gl/APEcEzXaX1SfQkVZ9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-[#f6014e] transition-colors flex items-center gap-1 group-hover:gap-2 duration-300"
                      aria-label="View NMAMIT location on map"
                    >
                      NMAM Institute of Technology, Nitte
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </motion.div>
                  
                  {/* Social Media Icons */}
                  <div className="flex items-center space-x-4 pt-2 justify-center md:justify-start">
                    <TooltipProvider>
                      {socialLinks.map((social) => (
                        <Tooltip key={social.href}>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`${social.color} backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:shadow-lg ${social.hoverColor} border border-white/20`}
                                asChild
                              >
                                <a
                                  href={social.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Visit IDEA on ${social.label}`}
                                >
                                  <social.icon size={18} className="text-white" />
                                </a>
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-r from-[#340181] to-[#f6014e] text-white border-none">
                            <p>{social.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-16 relative">
          <Separator className="bg-gradient-to-r from-[#340181]/30 via-[#8617C0]/30 to-[#f6014e]/30 h-px" />
          <motion.div 
            className="bg-gradient-to-r from-[#340181] via-[#8617C0] to-[#f6014e] h-px w-2/3 mx-auto blur-sm absolute top-0 left-1/2 transform -translate-x-1/2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="text-sm text-white tracking-wide text-center mt-6 font-medium">
            © {currentYear} IDEA | 
            <span className="bg-gradient-to-r from-[#24a4cf] to-[#ed4747] bg-clip-text text-transparent font-bold ml-1">
              Innovate • Develop • Excel • Achieve
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;