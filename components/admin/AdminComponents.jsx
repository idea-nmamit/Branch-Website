'use client'

import React from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

const ErrorBoundary = ({ error, onRetry, onBack }) => {
  return (
    <Card className="max-w-lg mx-auto mt-8 border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="border-red-300 bg-red-100">
          <AlertDescription className="text-red-800">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="flex items-center gap-2 text-slate-600 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
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
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-slate-600 font-medium">{message}</p>
    </div>
  )
}

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-blue-300 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      {action}
    </div>
  )
}

export { ErrorBoundary, LoadingSpinner, EmptyState }
