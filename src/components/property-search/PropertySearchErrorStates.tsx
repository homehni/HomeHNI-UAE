/**
 * Property Search Error States
 * Reusable error UI components for property search
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export function PropertyLoadError({ 
  title = 'Failed to Load Properties',
  message = 'We encountered an error while loading properties. Please try again.',
  onRetry,
  onGoHome,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{message}</p>
          <div className="mt-4 flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            {onGoHome && (
              <Button onClick={onGoHome} variant="default" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function NoPropertiesFound({ 
  onClearFilters,
}: { onClearFilters?: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🏠</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No properties found
      </h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your search criteria or location
      </p>
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Issue</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Unable to connect to the server. Please check your internet connection.</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function PropertySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80" />
      ))}
    </div>
  );
}
