import React, { useState, useEffect, useRef } from 'react';
import { Building2, MapPin, Calendar, Users, Award, Leaf, Star, Phone, Mail, Globe, ArrowRight, Download, CheckCircle2, Home, Trees, Droplets, Dumbbell, Shield, Camera, Maximize2, ChevronRight, ChevronLeft, X, MessageCircle, TrendingUp, Heart, IndianRupee, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { DeveloperContactForm } from "@/components/DeveloperContactForm";
import { AutoScrollCarousel } from "@/components/AutoScrollCarousel";
import { useDeveloperPage } from "@/hooks/useDeveloperPages";
import { DeveloperPageView } from "@/components/DeveloperPageView";
import godrejPropertiesLogo from '@/assets/godrej-properties-logo.jpg';
import ramkyGroupLogo from '@/assets/ramky-group-logo.jpg';
import brigadeGroupLogo from '@/assets/brigade-group-logo.jpg';
import aparnaConstructionsLogo from '@/assets/aparna-constructions-logo.jpg';
import aliensGroupLogo from '@/assets/aliens-group-logo.jpg';
import cannyForestEdgeLogo from '@/assets/canny-forest-edge-logo.jpg';
import alpineInfratechLogo from '@/assets/alpine-infratech-logo.png';
import forestEdgeExterior from '@/assets/forest-edge-exterior.jpg';
import forestEdgeAmenities1 from '@/assets/forest-edge-amenities1.jpg';
import forestEdgeAmenities2 from '@/assets/forest-edge-amenities2.jpg';
import forestEdgePool from '@/assets/forest-edge-pool.jpg';
import forestEdgeLawn from '@/assets/forest-edge-lawn.jpg';
import forestEdgeAerial from '@/assets/forest-edge-aerial.jpg';
import forestEdgeBalcony from '@/assets/forest-edge-balcony.jpg';
import forestEdgeEvening from '@/assets/forest-edge-evening.jpg';
// Video URLs from Supabase Storage (developer-media bucket)
const cannyForestEdgeVideo = 'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/developer-media/videos/canny-forest-edge-main.mp4';
const forestEdgeHeroVideo = 'https://geenmplkdgmlovvgwzai.supabase.co/storage/v1/object/public/developer-media/videos/forest-edge-hero.mp4';
import interior1 from '@/images/forest-edge/IMG-20251029-WA0022.jpg';
import interior2 from '@/images/forest-edge/IMG-20251029-WA0023.jpg';
import interior3 from '@/images/forest-edge/IMG-20251029-WA0024.jpg';
import interior4 from '@/images/forest-edge/IMG-20251029-WA0025.jpg';
import interior5 from '@/images/forest-edge/IMG-20251029-WA0026.jpg';
import interior6 from '@/images/forest-edge/IMG-20251029-WA0027.jpg';
import interior7 from '@/images/forest-edge/IMG-20251029-WA0028.jpg';
import interior8 from '@/images/forest-edge/WhatsApp Image 2025-10-29 at 17.06.17_18668968.jpg';
import forestEdgeProjectImage from '@/images/forest-edge/WhatsApp Image 2025-10-29 at 17.06.17_9380ae6d.jpg';
import floorPlan1 from '@/images/forest-edge/floor-plan/Screenshot_31-10-2025_215024_.jpeg';
import floorPlan2 from '@/images/forest-edge/floor-plan/Screenshot_31-10-2025_215035_.jpeg';
import floorPlan3 from '@/images/forest-edge/floor-plan/Screenshot_31-10-2025_215041_.jpeg';
const DeveloperPage = () => {
  const { developerId } = useParams();
  
  // ALL HOOKS MUST BE AT THE TOP - React Rules of Hooks
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedFloorPlanIndex, setSelectedFloorPlanIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const interiorCarouselRef = useRef<HTMLDivElement>(null);
  const similarProjectsRef = useRef<HTMLDivElement>(null);
  
  // Fetch developer data from database
  const { data: developerData, isLoading, error } = useDeveloperPage(developerId || '');
  // Loading/error handled after hooks for consistent hooks order


  // Use ONLY database data - no hardcoded fallbacks
  const developer = developerData 
    ? {
        name: developerData.company_name,
        logo: developerData.logo_url || '',
        rank: developerData.display_order || 0,
        founded: developerData.founded_year || '',
        headquarters: developerData.headquarters || '',
        highlights: developerData.highlights || developerData.tagline || '',
        description: developerData.description || '',
        specializations: Array.isArray(developerData.specializations) ? developerData.specializations : [],
        keyProjects: Array.isArray(developerData.key_projects) ? developerData.key_projects : [],
        awards: Array.isArray(developerData.awards) ? developerData.awards : [],
        stats: Array.isArray(developerData.stats) ? developerData.stats : [],
        contact: {
          phone: developerData.contact_phone || '',
          email: developerData.contact_email || '',
          website: developerData.contact_website || ''
        },
        heroTitle: developerData.hero_title || '',
        heroSubtitle: developerData.hero_subtitle || '',
        heroImage: developerData.hero_image_url || '',
        heroVideo: developerData.hero_video_url || '',
        heroCta: developerData.hero_cta_text || '',
        aboutTitle: developerData.about_title || '',
        aboutContent: developerData.about_content || '',
        aboutImages: Array.isArray(developerData.about_images) ? developerData.about_images : [],
        videoTitle: developerData.video_section_title || '',
        videoSubtitle: developerData.video_section_subtitle || '',
        videoUrl: developerData.video_url || '',
        videoThumbnail: developerData.video_thumbnail_url || '',
        galleryImages: Array.isArray(developerData.gallery_images) ? developerData.gallery_images : [],
        floorPlans: Array.isArray(developerData.floor_plans) ? developerData.floor_plans : [],
        amenities: Array.isArray(developerData.amenities) ? developerData.amenities : [],
        locationTitle: developerData.location_title || '',
        locationDescription: developerData.location_description || '',
        locationMap: developerData.location_map_url || '',
        locationHighlights: Array.isArray(developerData.location_highlights) ? developerData.location_highlights : []
      }
    : null;
  
  // Not-found handled after hooks for consistent hooks order

  // Use images from database only
  const heroImages = developer?.heroImage ? [developer.heroImage] : [];
  const interiorImages = developer?.galleryImages || [];
  const floorPlanImages = developer?.floorPlans?.map((fp: any) => fp.image) || [];

  // ALL HOOKS MUST RUN UNCONDITIONALLY - Scroll animation hook
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    const sections = document.querySelectorAll('.scroll-animate');
    sections.forEach(section => observer.observe(section));
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Auto-scroll and smooth scroll tracking for interior carousel
  useEffect(() => {
    
    const carousel = interiorCarouselRef.current;
    if (!carousel) return;
    let rafId: number | null = null;
    let isRunning = false;
    let autoScrollInterval: NodeJS.Timeout | null = null;
    let isPaused = false;
    const updateScrollProgress = () => {
      if (!carousel) return;
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.clientWidth;
      if (itemWidth === 0) return;
      const progress = scrollLeft / itemWidth;
      setScrollProgress(progress);
      const index = Math.round(progress);
      if (index >= 0 && index < interiorImages.length) {
        setCurrentInteriorIndex(prevIndex => {
          if (prevIndex !== index) return index;
          return prevIndex;
        });
      }
      isRunning = false;
      rafId = null;
    };
    const handleScroll = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updateScrollProgress);
      }
    };

    // Auto-scroll function
    const autoScroll = () => {
      if (!carousel || isPaused) return;
      const itemWidth = carousel.clientWidth;
      const scrollLeft = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - itemWidth;
      if (scrollLeft >= maxScroll - 1) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const nextPosition = Math.ceil(scrollLeft / itemWidth) * itemWidth + itemWidth;
        carousel.scrollTo({ left: nextPosition, behavior: 'smooth' });
      }
    };

    const startAutoScroll = () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(autoScroll, 5000);
    };

    const handlePause = () => {
      isPaused = true;
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    const handleResume = () => {
      isPaused = false;
      startAutoScroll();
    };
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    carousel.addEventListener('mouseenter', handlePause);
    carousel.addEventListener('mouseleave', handleResume);
    carousel.addEventListener('touchstart', handlePause, { passive: true });
    carousel.addEventListener('touchend', () => {
      setTimeout(handleResume, 2000);
    }, { passive: true });

    updateScrollProgress();
    startAutoScroll();
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      carousel.removeEventListener('mouseenter', handlePause);
      carousel.removeEventListener('mouseleave', handleResume);
      carousel.removeEventListener('touchstart', handlePause);
      carousel.removeEventListener('touchend', handleResume);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (autoScrollInterval) clearInterval(autoScrollInterval);
    };
  }, [interiorImages.length]);

  // Similar Projects scroll tracking
  useEffect(() => {
    const carousel = similarProjectsRef.current;
    if (!carousel) return;
    const updateScrollButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    updateScrollButtons();
    carousel.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      carousel.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  // Video auto-play/pause hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(error => console.log('Video auto-play prevented:', error));
          }
        }
        // Avoid immediate pause on slight scroll to prevent AbortError race
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -20% 0px' });
    videoObserver.observe(video);
    return () => videoObserver.unobserve(video);
  }, []);

  // Video pause/play when tab/window loses/gains focus
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(error => console.log('Video resume prevented:', error));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Hero video auto-play/pause hook
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(error => console.log('Hero video auto-play prevented:', error));
          }
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -20% 0px' });
    videoObserver.observe(video);
    return () => videoObserver.unobserve(video);
  }, []);

  // Hero video pause/play when tab/window loses/gains focus
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        const rect = video.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          video.play().catch(error => console.log('Hero video resume prevented:', error));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Post-hooks early returns to keep hooks order stable
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading developer page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
          <p className="text-muted-foreground mb-4">Unable to load this developer page. Please try again later.</p>
          <Button onClick={() => window.location.href = '/'}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
          <p className="text-muted-foreground mb-4">The developer page you're looking for doesn't exist or hasn't been published yet.</p>
          <Button onClick={() => window.location.href = '/'}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  // Render database-driven developer page
  if (developerData) {
    return <DeveloperPageView developer={developerData} />;
  }

};

export default DeveloperPage;