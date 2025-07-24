'use client'

import React from 'react'
import { Wrench, Clock, ArrowLeft, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

const MaintenancePage = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-[#17003A] to-[#34006e] flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#8617c0]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#f6014e]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#8617c0]/10 to-[#f6014e]/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-2xl max-h-[95vh] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl relative z-10">
        <CardContent className="p-4 sm:p-6 md:p-8 text-center flex flex-col justify-center h-full">
          {/* Logo/Brand Area */}
          <div className="mb-4 sm:mb-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-[#f6014e] to-[#ff4895] rounded-full flex items-center justify-center shadow-lg shadow-[#f6014e]/30">
              <Settings className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 font-montserrat">
            We&apos;ll Be Back Soon!
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed font-poppins px-2">
            Our website is currently undergoing scheduled maintenance to improve your experience. 
            We apologize for any inconvenience and appreciate your patience.
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-[#8617c0]/20 to-[#8617c0]/10 p-3 sm:p-4 md:p-6 rounded-xl border border-[#8617c0]/30 backdrop-blur-sm">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#8617c0] mx-auto mb-1 sm:mb-2" />
              <h3 className="font-semibold text-white text-sm sm:text-base mb-1 font-montserrat">Expected Duration</h3>
              <p className="text-xs sm:text-sm text-gray-300 font-poppins">Updates in progress</p>
            </div>
            <div className="bg-gradient-to-r from-[#f6014e]/20 to-[#f6014e]/10 p-3 sm:p-4 md:p-6 rounded-xl border border-[#f6014e]/30 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-[#f6014e] mx-auto mb-1 sm:mb-2" />
              <h3 className="font-semibold text-white text-sm sm:text-base mb-1 font-montserrat">What&apos;s Coming</h3>
              <p className="text-xs sm:text-sm text-gray-300 font-poppins">Enhanced features</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 font-poppins px-2">
              Need immediate assistance? Contact us at{' '}
              <a 
                href="mailto:idea.nmamit@gmail.com" 
                className="text-[#f6014e] hover:text-[#ff4895] font-medium underline transition-colors duration-200"
              >
                idea.nmamit@gmail.com
              </a>
            </p>
            
            {/* Refresh Button */}
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-gradient-to-r from-[#f6014e] to-[#ff4895] hover:from-[#d4013e] hover:to-[#e6407a] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-montserrat font-medium text-sm sm:text-base"
            >
              Check Again
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 mt-auto">
            <p className="text-xs text-gray-500 font-poppins">
              © {new Date().getFullYear()} Intelligence and Data Science Engineers&apos; Association.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MaintenancePage
