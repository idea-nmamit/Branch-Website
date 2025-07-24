'use client'

import React from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

const ErrorBoundary = ({ error, onRetry, onBack }) => {
  return (
    <Card className="max-w-lg mx-auto mt-8 border-0 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <AlertTriangle className="h-6 w-6" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50 h-12 px-6">
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          )}
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 h-12 px-6">
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#34006e]/20 border-t-[#34006e] rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#17003A] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-6 text-gray-600 font-medium text-lg">{message}</p>
    </div>
  )
}

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#17003A]/10 to-[#34006e]/10 rounded-full flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-[#17003A] to-[#34006e] rounded-lg"></div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 text-lg">{description}</p>
      {action}
    </div>
  )
}

export { ErrorBoundary, LoadingSpinner, EmptyState }
