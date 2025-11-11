import { lazy } from 'react';

// Lazy load heavy components to improve initial page load
export const LazyFeaturedProperties = lazy(() => import('./FeaturedProperties'));
export const LazyRealEstateSlider = lazy(() => import('./RealEstateSlider'));
export const LazyHomeServices = lazy(() => import('./HomeServices'));
export const LazyCustomerTestimonials = lazy(() => import('./CustomerTestimonials'));
export const LazyMobileAppSection = lazy(() => import('./MobileAppSection'));
