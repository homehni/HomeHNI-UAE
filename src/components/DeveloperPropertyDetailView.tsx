import React, { useState, useEffect, useRef } from 'react';
import { Building2, MapPin, Calendar, Users, Award, Leaf, Star, Phone, Mail, Globe, ArrowRight, Download, CheckCircle2, Home, Trees, Droplets, Dumbbell, Shield, Camera, Maximize2, ChevronRight, ChevronLeft, X, MessageCircle, TrendingUp, Heart, IndianRupee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { DeveloperContactForm } from "@/components/DeveloperContactForm";
import { AutoScrollCarousel } from "@/components/AutoScrollCarousel";
import prestigeGroupLogo from '@/assets/prestige-group-logo.jpg';
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
import cannyForestEdgeVideo from '@/videos/2 and 3 BHK flats for sale Bachupally, Hyderabad ｜ Canny Forest Edge ｜ Canny Life Spaces.mp4';
import forestEdgeHeroVideo from '@/videos/WhatsApp Video 2025-10-29 at 17.06.17_b8cc3ca2.mp4';
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

interface DeveloperPropertyDetailViewProps {
  developer: any;
  isContactFormOpen: boolean;
  setIsContactFormOpen: (open: boolean) => void;
}

export const DeveloperPropertyDetailView: React.FC<DeveloperPropertyDetailViewProps> = ({
  developer,
  isContactFormOpen,
  setIsContactFormOpen
}) => {
  // All hooks at top level
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

  const pd = developer.propertyDetails;

  // Forest Edge carousel images
  const forestEdgeImages = [forestEdgeExterior, forestEdgeAmenities1, forestEdgeAmenities2, forestEdgePool, forestEdgeLawn, forestEdgeAerial, forestEdgeBalcony, forestEdgeEvening];

  // Interior images array
  const interiorImages = [interior1, interior2, interior3, interior4, interior5, interior6, interior7, interior8];

  // Floor plan images array
  const floorPlanImages = [floorPlan1, floorPlan2, floorPlan3];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const element = sectionRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };

    const section = sectionRef.current;
    section?.addEventListener('scroll', handleScroll);

    return () => {
      section?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.play().catch(error => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, []);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = true;
      heroVideoRef.current.loop = true;
      heroVideoRef.current.play().catch(error => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (interiorCarouselRef.current) {
        const element = interiorCarouselRef.current;
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth);
      }
    };

    if (interiorCarouselRef.current) {
      interiorCarouselRef.current.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check

      return () => {
        interiorCarouselRef.current?.removeEventListener('scroll', checkScroll);
      };
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (heroVideoRef.current) {
              heroVideoRef.current.play().catch(error => {
                console.error("Autoplay prevented:", error);
              });
            }
          } else {
            if (heroVideoRef.current) {
              heroVideoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    if (heroVideoRef.current) {
      observer.observe(heroVideoRef.current);
    }

    return () => {
      if (heroVideoRef.current) {
        observer.unobserve(heroVideoRef.current);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (similarProjectsRef.current) {
              const scrollAmount = similarProjectsRef.current.offsetWidth;
              similarProjectsRef.current.scrollLeft += scrollAmount;
            }
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    if (similarProjectsRef.current) {
      observer.observe(similarProjectsRef.current);
    }

    return () => {
      if (similarProjectsRef.current) {
        observer.unobserve(similarProjectsRef.current);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (interiorCarouselRef.current) {
        const scrollSpeed = 1; // Adjust scroll speed as needed
        interiorCarouselRef.current.scrollLeft += e.deltaY * scrollSpeed;
        e.preventDefault();
      }
    };

    if (interiorCarouselRef.current) {
      interiorCarouselRef.current.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        interiorCarouselRef.current?.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  // This is just the wrapper component structure
  
  return (
    <div>Property Detail View - Component content goes here</div>
  );
};
