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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentHeroVideoIndex, setCurrentHeroVideoIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedFloorPlanIndex, setSelectedFloorPlanIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const interiorCarouselRef = useRef<HTMLDivElement>(null);
  const similarProjectsRef = useRef<HTMLDivElement>(null);
  
  // Hero video segments
  const heroVideoSegments = [
    { title: 'Exterior Views', videoUrl: forestEdgeHeroVideo },
    { title: 'Amenities Overview', videoUrl: forestEdgeHeroVideo },
    { title: 'Apartment Interiors', videoUrl: forestEdgeHeroVideo },
    { title: 'Forest View', videoUrl: forestEdgeHeroVideo },
  ];
  
  // Fetch developer data from database
  const { data: developerData, isLoading, error } = useDeveloperPage(developerId || '');
  
  // Keep legacy hardcoded data as fallback
  const developers = {
    'prestige-group': {
      name: 'Prestige Group',
      logo: prestigeGroupLogo,
      rank: 1,
      founded: '1986',
      headquarters: 'Bangalore, India',
      highlights: 'Large-scale mixed-use projects, strong presence across South India',
      description: 'Prestige Group is one of India\'s leading real estate developers with over 35 years of experience. Known for their premium residential and commercial projects across South India, they have delivered over 280 projects covering 140 million sq ft of developable area.',
      specializations: ['Premium Residential Projects', 'Commercial Complexes', 'Mixed-use Developments', 'Hospitality Projects', 'Retail Spaces'],
      keyProjects: ['Prestige Lakeside Habitat - Premium residential complex', 'Prestige Tech Platina - IT park and commercial space', 'Prestige Shantiniketan - Integrated township', 'Prestige Golfshire - Golf course community'],
      awards: ['FIABCI Prix d\'Excellence Award', 'CNBC Awaaz Real Estate Awards', 'Best Developer - South India', 'Excellence in Real Estate Development'],
      contact: {
        phone: '+91 80 4655 5555',
        email: 'info@prestigeconstructions.com',
        website: 'www.prestigeconstructions.com'
      },
      propertyDetails: {
        price: { min: 75, max: 150, unit: 'Lacs', perSqft: 5500 },
        location: 'Bangalore, India',
        locality: 'Whitefield',
        city: 'Bangalore',
        configurations: [{ type: '2 BHK', sizes: ['1200 Sft'] }, { type: '3 BHK', sizes: ['1600 Sft'] }],
        projectArea: '10 Acres',
        totalUnits: 500,
        status: 'Under Construction',
        possession: 'Dec 2025',
        rera: 'PRM/KA/RERA/1251/446/PR/171120/002345',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Premium location in Bangalore', 'Modern architecture and design', 'World-class amenities', 'Excellent connectivity']
      }
    },
    'godrej-properties': {
      name: 'Godrej Properties',
      logo: godrejPropertiesLogo,
      rank: 2,
      founded: '1990',
      headquarters: 'Mumbai, India',
      highlights: 'National developer newly active in Hyderabad, high-magnitude projects',
      description: 'Godrej Properties is the real estate arm of the Godrej Group, one of India\'s most trusted business conglomerates. With a focus on sustainable and innovative development, they have established a strong presence in major Indian cities.',
      specializations: ['Sustainable Development', 'Smart Homes Technology', 'Premium Residential', 'Commercial Spaces', 'Plotted Developments'],
      keyProjects: ['Godrej Park Avenue - Luxury apartments', 'Godrej 24 - Premium residential towers', 'Godrej Emerald - Green certified homes', 'Godrej City - Integrated township'],
      awards: ['India Green Building Council Certification', 'CREDAI Awards for Excellence', 'Best Practices in Sustainability', 'Developer of the Year'],
      contact: {
        phone: '+91 22 2518 8010',
        email: 'marketing@godrejproperties.com',
        website: 'www.godrejproperties.com'
      },
      propertyDetails: {
        price: { min: 90, max: 180, unit: 'Lacs', perSqft: 6200 },
        location: 'Mumbai, India',
        locality: 'Vikhroli',
        city: 'Mumbai',
        configurations: [{ type: '2 BHK', sizes: ['1100 Sft'] }, { type: '3 BHK', sizes: ['1500 Sft'] }],
        projectArea: '15 Acres',
        totalUnits: 650,
        status: 'Ready to Move',
        possession: 'Ready to move',
        rera: 'P51800000001',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Sustainable green buildings', 'Smart home technology', 'Premium finishes', 'Strategic location']
      }
    },
    'ramky-group': {
      name: 'Ramky Group',
      logo: ramkyGroupLogo,
      rank: 3,
      founded: '1994',
      headquarters: 'Hyderabad, India',
      highlights: 'Hyderabad-based, focus on sustainable and innovative infrastructure',
      description: 'Ramky Group is a diversified infrastructure and real estate development company based in Hyderabad. Known for their innovative approach to urban development and commitment to sustainability, they have been instrumental in shaping Hyderabad\'s skyline.',
      specializations: ['Infrastructure Development', 'Sustainable Construction', 'Urban Planning', 'Residential Communities', 'Environmental Solutions'],
      keyProjects: ['Ramky One Galaxia - Premium residential', 'Ramky One North - Integrated township', 'Ramky Towers - Commercial complex', 'Ramky Infrastructure Projects'],
      awards: ['Green Building Certification', 'Excellence in Infrastructure', 'Sustainable Development Award', 'Best Regional Developer'],
      contact: {
        phone: '+91 40 4033 4000',
        email: 'info@ramkygroup.com',
        website: 'www.ramkygroup.com'
      },
      propertyDetails: {
        price: { min: 65, max: 140, unit: 'Lacs', perSqft: 5800 },
        location: 'Hyderabad, India',
        locality: 'Kokapet',
        city: 'Hyderabad',
        configurations: [{ type: '2 BHK', sizes: ['1150 Sft'] }, { type: '3 BHK', sizes: ['1550 Sft'] }],
        projectArea: '12 Acres',
        totalUnits: 480,
        status: 'Under Construction',
        possession: 'Jun 2026',
        rera: 'P02200004567',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Sustainable infrastructure', 'Modern urban planning', 'Green building practices', 'Prime Hyderabad location']
      }
    },
    'brigade-group': {
      name: 'Brigade Group',
      logo: brigadeGroupLogo,
      rank: 4,
      founded: '1986',
      headquarters: 'Bangalore, India',
      highlights: 'Award-winning developer, active in residential, commercial, hospitality',
      description: 'Brigade Group is a leading real estate developer in South India with over 35 years of experience. They are known for their diversified portfolio spanning residential, commercial, retail, and hospitality sectors.',
      specializations: ['Residential Development', 'Commercial Projects', 'Hospitality Ventures', 'Retail Spaces', 'Mixed-use Developments'],
      keyProjects: ['Brigade Cornerstone Utopia - Premium apartments', 'World Trade Center Brigade Gateway', 'Brigade Millennium - IT park', 'The Sheraton Grand Bangalore Hotel'],
      awards: ['CREDAI National Award', 'Karnataka State Award', 'Best Mixed-use Development', 'Excellence in Architecture'],
      contact: {
        phone: '+91 80 4137 4000',
        email: 'info@brigadegroup.com',
        website: 'www.brigadegroup.com'
      },
      propertyDetails: {
        price: { min: 80, max: 160, unit: 'Lacs', perSqft: 6000 },
        location: 'Bangalore, India',
        locality: 'Koramangala',
        city: 'Bangalore',
        configurations: [{ type: '2 BHK', sizes: ['1250 Sft'] }, { type: '3 BHK', sizes: ['1700 Sft'] }],
        projectArea: '8 Acres',
        totalUnits: 380,
        status: 'Ready to Move',
        possession: 'Ready to move',
        rera: 'PRM/KA/RERA/1251/446/PR/171120/003456',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Award-winning architecture', 'Prime location', 'Luxury amenities', 'Proven track record']
      }
    },
    'aparna-constructions': {
      name: 'Aparna Constructions',
      logo: aparnaConstructionsLogo,
      rank: 5,
      founded: '1996',
      headquarters: 'Hyderabad, India',
      highlights: 'High-quality housing, tech-enabled, eco-conscious building practices',
      description: 'Aparna Constructions is a prominent real estate developer in Hyderabad, known for their commitment to quality construction and innovative design. They have successfully delivered numerous residential and commercial projects across the city.',
      specializations: ['Tech-enabled Homes', 'Eco-friendly Construction', 'Quality Architecture', 'Customer-centric Design', 'Modern Amenities'],
      keyProjects: ['Aparna Sarovar Grande - Luxury villas', 'Aparna Cyber Life - IT corridor apartments', 'Aparna Hillpark - Gated community', 'Aparna Constructions Commercial Hub'],
      awards: ['CREDAI Hyderabad Award', 'Excellence in Quality Construction', 'Best Residential Developer', 'Customer Satisfaction Award'],
      contact: {
        phone: '+91 40 4020 4040',
        email: 'info@aparnaconstructions.com',
        website: 'www.aparnaconstructions.com'
      },
      propertyDetails: {
        price: { min: 70, max: 135, unit: 'Lacs', perSqft: 5600 },
        location: 'Hyderabad, India',
        locality: 'Gachibowli',
        city: 'Hyderabad',
        configurations: [{ type: '2 BHK', sizes: ['1180 Sft'] }, { type: '3 BHK', sizes: ['1580 Sft'] }],
        projectArea: '9 Acres',
        totalUnits: 420,
        status: 'Under Construction',
        possession: 'Mar 2026',
        rera: 'P02200005678',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Tech-enabled smart homes', 'Eco-friendly construction', 'Quality assured', 'Modern design']
      }
    },
    'aliens-group': {
      name: 'Aliens Group',
      logo: aliensGroupLogo,
      rank: 6,
      founded: '2006',
      headquarters: 'Hyderabad, India',
      highlights: 'Hyderabad-founded, iconic skyscraper projects, design awards',
      description: 'Aliens Group is a contemporary real estate developer based in Hyderabad, known for their iconic architectural designs and innovative skyscraper projects. They focus on creating landmark developments that redefine urban living.',
      specializations: ['Iconic Architecture', 'Skyscraper Development', 'Contemporary Design', 'Urban Landmarks', 'Premium Living Spaces'],
      keyProjects: ['Aliens Space Station Township', 'Aliens Hub - Commercial tower', 'Aliens Matrix - Residential complex', 'Aliens Signature Towers'],
      awards: ['Architectural Excellence Award', 'Design Innovation Recognition', 'Best Upcoming Developer', 'Modern Architecture Award'],
      contact: {
        phone: '+91 40 2311 1111',
        email: 'info@aliensgroup.com',
        website: 'www.aliensgroup.com'
      },
      propertyDetails: {
        price: { min: 95, max: 175, unit: 'Lacs', perSqft: 6500 },
        location: 'Hyderabad, India',
        locality: 'Tellapur',
        city: 'Hyderabad',
        configurations: [{ type: '2 BHK', sizes: ['1300 Sft'] }, { type: '3 BHK', sizes: ['1650 Sft'] }],
        projectArea: '20 Acres',
        totalUnits: 750,
        status: 'Under Construction',
        possession: 'Dec 2026',
        rera: 'P02200006789',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security'],
        features: ['Iconic architectural design', 'Skyscraper living', 'Contemporary interiors', 'Landmark project']
      }
    },
    'canny-forest-edge': {
      name: "Forest Edge",
      logo: cannyForestEdgeLogo,
      rank: 7,
      founded: '2010',
      headquarters: 'Bachupally, Hyderabad',
      highlights: '2BHK Luxurious residences designed to create an oasis of comfort and tranquility',
      description: "Experience a gated community inspired by Nature and the forests neighbourhood. Canny's Forest Edge - 2BHK Luxurious residences designed to create an oasis of comfort and tranquility. A premium residential project spread across 1.52 acres with 197 flats in Bachupally, Hyderabad. Ready to move-in possession with TS RERA Approved (P02200003658). Experience luxurious living with more than 66% open area and breathtaking 200 acres of forest view, featuring wide cantilever balconies and impeccably landscaped surroundings.",
      specializations: ['2BHK - 1285 Sft', 'Ready to Move', 'More than 66% Open Area', '200 Acres Forest View', 'TS RERA Approved (P02200003658)', 'Gated Community Inspired by Nature'],
      keyProjects: ['1.52 Acres with 197 Premium Flats', 'Wide Cantilever Balconies for Panoramic Views', 'Clubhouse with Swimming Pool & Fitness Center', 'Impeccably Landscaped Gardens & Recreational Areas', '24/7 Security with Dedicated Concierge Services'],
      awards: ['TS RERA Approved Project', 'Multiple Bank Financing Options', 'Premium Location - Bachupally', 'Forest View Living Experience'],
      contact: {
        phone: '+91 9833662222',
        email: 'info@cannylifespaces.com',
        website: 'www.cannylifespaces.com'
      },
      // Property-specific details
      propertyDetails: {
        price: {
          min: 82,
          max: 82,
          unit: 'Lacs',
          perSqft: 6381
        },
        location: 'Bachupally, Hyderabad',
        locality: 'Bachupally',
        city: 'Hyderabad',
        configurations: [{
          type: '2 BHK',
          sizes: ['1285 Sft']
        }],
        projectArea: '1.52 Acres',
        totalUnits: 197,
        status: 'Ready to Move',
        possession: 'Ready to move',
        rera: 'P02200003658',
        brochureLink: 'https://drive.google.com/file/d/1oBZpf4hXld-JX8ppSwOdC0psS3UlSEp9/view',
        mapLink: 'https://www.google.com/maps/place/Canny+Forest+Edge/@17.5428399,78.4038539,17z/data=!3m1!4b1!4m5!3m4!1s0x3bcb8fc6acafcec1:0xa65b820b460d291a!8m2!3d17.5428399!4d78.4060426?shorturl=1',
        amenities: ['Clubhouse', 'Swimming Pool', 'Fitness Center', 'Kids Play Area', 'Landscaped Gardens', '24/7 Security', 'CCTV Surveillance', 'Multi-utility block', 'Recreational Areas'],
        features: ['1.52 Acres - 197 Flats', 'Grand Clubhouse & Multi-utility block', 'More than 66% of Open Area with 200 Acres Forest View', 'Wide cantilever balconies for a better feel', 'Clubhouse, swimming pool, fitness center, and recreational areas for a well-rounded lifestyle', 'Impeccably landscaped surroundings, offering a serene environment', '24/7 security and dedicated concierge services to ensure your peace of mind']
      }
    },
    'alpine-infratech': {
      name: 'Alpine Infratech',
      logo: alpineInfratechLogo,
      rank: 8,
      founded: '2008',
      headquarters: 'Kompally-Bollarum, Hyderabad',
      highlights: 'GMR Springfield - Ready to move in 2BHK apartments @ ₹5200/Sft, 47% Open Area',
      description: 'Alpine Infratech presents GMR Springfield - Live in Leisure, a premium residential project in Kompally-Bollarum, Hyderabad. Spread across 4 Acres with 4 Blocks (G+5) housing 370 Flats, this ready to move-in project offers 2BHK apartments of 1120 Sft. TS RERA Approved (P02200003938). The project features 47% open area with lavish landscaping and a massive 2420 Sqyd Party Lawn. Bank approved by SBI, HDFC, LIC, Bajaj Finance, and Sundaram Finance.',
      specializations: ['2BHK - 1120 Sft Apartments', 'Ready to Move In', '47% Open Area', '2420 Sqyd Party Lawn', 'Bank Approved (SBI, HDFC, LIC, Bajaj, Sundaram)', 'Price @ ₹5200/Sft', '1.5 km from Bolaraum MMTS Station', '5 mins to D-Mart & Cineplanet'],
      keyProjects: ['GMR Springfield - 4 Acres, 370 Flats, G+5 Blocks', 'Location: 1.5 km from Bolaraum MMTS Station', '5 mins drive to D-Mart, Cineplanet, Shopping Malls', 'Easy connectivity to Banks, Schools, Hospitals'],
      awards: ['TS RERA Approved - P02200003938', 'Bank Approvals from SBI, HDFC, LIC', 'Bajaj Finance & Sundaram Finance Approved', 'Premium Location - Kompally-Bollarum'],
      contact: {
        phone: '+91 40 4567 8900',
        email: 'info@alpineinfratech.com',
        website: 'www.alpineinfratech.com'
      },
      propertyDetails: {
        price: { min: 58, max: 58, unit: 'Lacs', perSqft: 5200 },
        location: 'Kompally-Bollarum, Hyderabad',
        locality: 'Kompally',
        city: 'Hyderabad',
        configurations: [{ type: '2 BHK', sizes: ['1120 Sft'] }],
        projectArea: '4 Acres',
        totalUnits: 370,
        status: 'Ready to Move',
        possession: 'Ready to move',
        rera: 'P02200003938',
        brochureLink: '#',
        mapLink: 'https://maps.google.com',
        amenities: ['Party Lawn 2420 Sqyd', 'Clubhouse', 'Landscaped Gardens', '24/7 Security', 'Kids Play Area', 'Fitness Center'],
        features: ['47% Open Area with lavish landscaping', 'Bank Approved - SBI, HDFC, LIC, Bajaj, Sundaram', '1.5 km from Bolaraum MMTS Station', '5 mins to D-Mart, Cineplanet, Shopping Malls', '4 Blocks (G+5) with 370 premium flats', 'Ready to move in possession']
      }
    }
  };
  
  // Loading state handled within UI sections to keep hooks order consistent
  
  // Try database first, but use hardcoded logos (imported assets)
  const hardcodedDev = developers[developerId as keyof typeof developers];
  const developer = developerData 
    ? {
        name: developerData.company_name,
        logo: hardcodedDev?.logo || developerData.logo_url || '',
        rank: developerData.display_order || 0,
        founded: developerData.founded_year || '',
        headquarters: developerData.headquarters || '',
        highlights: developerData.highlights || developerData.tagline || '',
        description: developerData.description || '',
        specializations: Array.isArray(developerData.specializations) ? developerData.specializations : [],
        keyProjects: Array.isArray(developerData.key_projects) ? developerData.key_projects : [],
        awards: Array.isArray(developerData.awards) ? developerData.awards : [],
        contact: {
          phone: developerData.contact_phone || '',
          email: developerData.contact_email || '',
          website: developerData.contact_website || ''
        },
        propertyDetails: hardcodedDev?.propertyDetails || {
          price: { min: 75, max: 150, unit: 'Lacs', perSqft: 5500 },
          location: developerData.headquarters || '',
          locality: '',
          city: developerData.headquarters?.split(',')[0] || '',
          configurations: [{ type: '2 BHK', sizes: ['1200 Sft'] }, { type: '3 BHK', sizes: ['1600 Sft'] }],
          projectArea: '10 Acres',
          totalUnits: 500,
          status: 'Under Construction',
          possession: 'Dec 2025',
          rera: 'RERA123456',
          brochureLink: '#',
          mapLink: developerData.location_map_url || 'https://maps.google.com',
          amenities: Array.isArray(developerData.amenities) ? developerData.amenities : [],
          features: []
        }
      }
    : hardcodedDev;
  
  const developerNotFound = !developer && !developerData;

  // Check if this is a property-detail style page
  const isPropertyDetail = developer && 'propertyDetails' in developer;
  const pd = developer?.propertyDetails;

  // Forest Edge carousel images
  const forestEdgeImages = [forestEdgeExterior, forestEdgeAmenities1, forestEdgeAmenities2, forestEdgePool, forestEdgeLawn, forestEdgeAerial, forestEdgeBalcony, forestEdgeEvening];

  // Interior images array - apartment interior photos
  const interiorImages = [interior1, interior2, interior3, interior4, interior5, interior6, interior7, interior8];

  // Floor plan images array
  const floorPlanImages = [floorPlan1, floorPlan2, floorPlan3];

  // ALL HOOKS MUST RUN UNCONDITIONALLY - Scroll animation hook
  useEffect(() => {
    if (!isPropertyDetail) return;
    
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
  }, [isPropertyDetail]);

  // Auto-scroll and smooth scroll tracking for interior carousel
  useEffect(() => {
    if (!isPropertyDetail) return;
    
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
  }, [isPropertyDetail, interiorImages.length]);

  // Similar Projects scroll tracking
  useEffect(() => {
    if (!isPropertyDetail) return;
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
  }, [isPropertyDetail]);

  // Video auto-play/pause hook
  useEffect(() => {
    if (!isPropertyDetail) return;
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
  }, [isPropertyDetail]);

  // Video pause/play when tab/window loses/gains focus
  useEffect(() => {
    if (!isPropertyDetail) return;
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
  }, [isPropertyDetail]);

  // Hero video auto-play/pause hook
  useEffect(() => {
    if (!isPropertyDetail) return;
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
  }, [isPropertyDetail]);

  // Hero video pause/play when tab/window loses/gains focus
  useEffect(() => {
    if (!isPropertyDetail) return;
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
  }, [isPropertyDetail]);

  // Hero video click handler
  const handleHeroVideoClick = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(error => console.log('Hero video play prevented:', error));
    } else {
      video.pause();
    }
  };

  // Video fullscreen handler
  const handleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          await (video as any).webkitRequestFullscreen();
        } else if ((video as any).msRequestFullscreen) {
          await (video as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.log('Fullscreen error:', error);
    }
  };

  // Video play/pause toggle handler
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(error => console.log('Video play prevented:', error));
    } else {
      video.pause();
    }
  };

  // Amenity icons mapping for better visual representation
  const amenityIcons: Record<string, React.ReactNode> = {
    'Clubhouse': <Home className="h-6 w-6" />,
    'Swimming Pool': <Droplets className="h-6 w-6" />,
    'Fitness Center': <Dumbbell className="h-6 w-6" />,
    'Kids Play Area': <Users className="h-6 w-6" />,
    'Landscaped Gardens': <Trees className="h-6 w-6" />,
    '24/7 Security': <Shield className="h-6 w-6" />,
    'CCTV Surveillance': <Camera className="h-6 w-6" />,
    'Multi-utility block': <Building2 className="h-6 w-6" />,
    'Recreational Areas': <Star className="h-6 w-6" />
  };
  
  // Render property-detail layout for Forest Edge
  if (isPropertyDetail && pd) {
    return <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50" ref={sectionRef}>
        <Marquee />
        <Header />
        
        {/* Hero Section - Responsive Layout: PC Split View / Mobile Background Video */}
        <section className="relative mb-12 scroll-animate overflow-hidden lg:bg-gradient-to-br lg:from-emerald-50 lg:via-green-50 lg:to-teal-50 pt-20">
          {/* Mobile View - Clean & Elegant Layout */}
          {developerId === 'canny-forest-edge' && (
            <div className="lg:hidden relative w-full min-h-[700px] mb-12">
              {/* Background Video Carousel */}
              <div className="absolute inset-0 w-full h-full">
                {heroVideoSegments.map((segment, index) => (
                  <video
                    key={index}
                    ref={index === currentHeroVideoIndex ? heroVideoRef : null}
                    className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                      index === currentHeroVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    playsInline
                    loop
                    preload="metadata"
                    muted
                    autoPlay={index === currentHeroVideoIndex}
                    onClick={handleHeroVideoClick}
                  >
                    <source src={segment.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-20"></div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentHeroVideoIndex((prev) => (prev === 0 ? heroVideoSegments.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all duration-200"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentHeroVideoIndex((prev) => (prev === heroVideoSegments.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 transition-all duration-200"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
                
                {/* Progress Dots */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                  {heroVideoSegments.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentHeroVideoIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentHeroVideoIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Video Title */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">{heroVideoSegments[currentHeroVideoIndex].title}</span>
                </div>
              </div>

            {/* Content Overlay - Structured Layout */}
            <div className="relative z-30 h-full flex flex-col p-5 sm:p-6 text-white">
              {/* Top Section - Logo & Project Area Badge */}
              <div className="flex flex-col items-center gap-4 mb-6 pt-4">
                {/* Logo - Centered */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <img src={developer.logo} alt="Canny Life Spaces" className="w-36 h-24 sm:w-44 sm:h-28 object-contain" />
                </div>
              </div>

              {/* Middle Section - Main Property Info */}
              <div className="relative bg-transparent backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4 mb-6">
                {/* NEW LAUNCH Badge - Mobile Top Right */}
                <div className="absolute top-3 right-3 sm:hidden">
                  <span className="text-[10px] font-bold text-yellow-400">NEW LAUNCH</span>
                </div>

                {/* Configuration & Price */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {pd.configurations.map(c => c.type).join(', ')} Apartment
                  </h2>
                  <p className="text-base sm:text-lg font-semibold text-emerald-300">
                    ₹ {pd.price.min} {pd.price.unit} Onwards*
                  </p>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-white/95">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-medium">{pd.locality}, {pd.city}</span>
                </div>
                
                {/* Status Tags */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <Calendar className="h-3 w-3 text-emerald-400" />
                    <span className="text-[11px] font-medium">{pd.possession}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="text-[11px] font-medium">RERA Approved</span>
                  </div>
                </div>

                {/* NEW LAUNCH Badge - Desktop */}
                <div className="hidden sm:flex items-center gap-3 pt-1">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-yellow-400/30">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-[11px] font-bold text-white">NEW LAUNCH Project</span>
                  </div>
                  <a href="#" className="text-[11px] text-emerald-300 hover:text-emerald-200 underline font-medium">Learn more</a>
                </div>
              </div>

              {/* Property Details Cards - Compact & Clean */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-white">{pd.projectArea}</p>
                    <p className="text-[9px] text-white/80">{pd.totalUnits} Flats</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-white">{pd.configurations[0].type}</p>
                    <p className="text-[9px] text-white/80">{pd.configurations[0].sizes[0]}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-white">RERA</p>
                    <p className="text-[9px] text-white/80">Certified</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <Button size="default" className="flex-1 bg-white text-slate-900 hover:bg-white/90 font-bold shadow-lg text-sm" onClick={() => setIsContactFormOpen(true)}>
                  View Number
                </Button>
                {pd.brochureLink && <Button variant="outline" size="default" className="flex-1 bg-white/10 text-white hover:bg-white/20 border-2 border-white/40 font-bold backdrop-blur-md shadow-lg text-sm" onClick={() => window.open(pd.brochureLink, '_blank')}>
                    <Download className="mr-2 h-3.5 w-3.5" />
                    Brochure
                  </Button>}
              </div>

              {/* Interest Indicator */}
              <div className="hidden md:flex items-center justify-center gap-2 text-[11px] text-white/90 bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-400/30 mb-4">
                <span>🔥</span>
                <span className="font-medium">36 families showed interest yesterday</span>
              </div>

              {/* Bottom Bar - Key Highlights */}
              <div className="mt-auto bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 flex items-center justify-between border border-white/20">
                <span className="text-white font-semibold text-xs">Key Highlights</span>
                <ChevronRight className="h-4 w-4 text-white rotate-90" />
              </div>
            </div>
          </div>
          )}

          {/* PC View - Split Layout (60/40) - Bold Color Style */}
          <div className="hidden lg:block py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Content Container */}
              <div className="relative z-10">
                <div className="relative flex gap-0">
                  {/* Left Column - ~60% width */}
                  <div className="w-[60%] relative z-10">
                    {/* Single Line Layout - Logo and All Info */}
                    <div className="flex items-center gap-6 mb-8 flex-wrap">
                      {/* Logo */}
                      <img src={developer.logo} alt="Canny Life Spaces" className="w-48 h-28 lg:w-56 lg:h-32 object-contain flex-shrink-0" />
                      
                      {/* Divider */}
                      <div className="h-16 w-px bg-slate-300"></div>
                      
                      {/* Main Info */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-xl lg:text-2xl font-bold text-slate-900">{pd.configurations.map(c => c.type).join(', ')} Apartment</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-xl lg:text-2xl font-bold text-slate-900">₹ {pd.price.min} {pd.price.unit} Onwards*</span>
                        <span className="text-slate-400">|</span>
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="h-5 w-5 text-slate-700" />
                          <span className="text-base font-medium">{pd.locality}, {pd.city}</span>
                        </div>
                        <span className="text-slate-400">|</span>
                        <div className="bg-slate-900/90 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs font-semibold text-white tracking-wide">NEW LAUNCH</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-slate-700" />
                          <span className="text-xs font-medium">RERA</span>
                        </div>
                      </div>
                    </div>

                    {/* Property Details - Dark Containers */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      <div className="flex flex-col items-center gap-2 p-3 bg-white/80 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/90 transition-all duration-300 border border-slate-200 aspect-square justify-center">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-slate-700" />
                        </div>
                        <span className="text-xs font-semibold text-center text-slate-900 leading-tight">{pd.projectArea}<br />{pd.totalUnits} Flats</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-white/80 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/90 transition-all duration-300 border border-slate-200 aspect-square justify-center">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-slate-700" />
                        </div>
                        <span className="text-xs font-semibold text-center text-slate-900 leading-tight">{pd.configurations[0].type}<br />{pd.configurations[0].sizes[0]}</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-white/80 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/90 transition-all duration-300 border border-slate-200 aspect-square justify-center">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-slate-700" />
                        </div>
                        <span className="text-xs font-semibold text-center text-slate-900 leading-tight">RERA<br />Certified</span>
                      </div>
                    </div>

                    {/* Action Buttons - Professional Style */}
                    <div className="flex gap-4 mb-6">
                      <Button size="lg" className="flex-1 bg-white text-slate-900 hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-base py-6 rounded-xl" onClick={() => setIsContactFormOpen(true)}>
                        View Number
                      </Button>
                      {pd.brochureLink && <Button variant="outline" size="lg" className="flex-1 bg-white/80 backdrop-blur-lg text-slate-900 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl group transition-all duration-300 text-base py-6 rounded-xl" onClick={() => window.open(pd.brochureLink, '_blank')}>
                          <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                          Brochure
                        </Button>}
                    </div>

                    {/* Interest Indicator */}
                    
                  </div>

                  {/* Right Column - ~40% width, Right Aligned - Mobile Portrait Video Carousel */}
                  {developerId === 'canny-forest-edge' && (
                    <div className="w-[40%] ml-auto relative z-20 flex items-center justify-end pl-8">
                      <Card className="border-0 shadow-2xl overflow-hidden w-full max-w-[320px]">
                        <div className="relative aspect-[9/16] bg-black group cursor-pointer rounded-2xl">
                          {/* Video Carousel */}
                          {heroVideoSegments.map((segment, index) => (
                            <video
                              key={index}
                              ref={index === currentHeroVideoIndex ? heroVideoRef : null}
                              className={`w-full h-full object-cover rounded-2xl absolute inset-0 transition-opacity duration-500 ${
                                index === currentHeroVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                              }`}
                              playsInline
                              loop
                              preload="metadata"
                              muted
                              autoPlay={index === currentHeroVideoIndex}
                              onClick={handleHeroVideoClick}
                            >
                              <source src={segment.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ))}

                          {/* Video Title */}
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                            <span className="text-white text-xs font-medium">{heroVideoSegments[currentHeroVideoIndex].title}</span>
                          </div>

                          {/* Bottom Bar - Key Highlights */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md px-4 py-3 flex items-center justify-between z-20">
                            <span className="text-white font-semibold text-sm">Key Highlights</span>
                            <ChevronRight className="h-4 w-4 text-white rotate-90" />
                          </div>

                          {/* Navigation Arrows */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentHeroVideoIndex((prev) => (prev === 0 ? heroVideoSegments.length - 1 : prev - 1));
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all z-30"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="h-5 w-5 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentHeroVideoIndex((prev) => (prev === heroVideoSegments.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all z-30"
                            aria-label="Next"
                          >
                            <ChevronRight className="h-5 w-5 text-white" />
                          </button>
                          
                          {/* Progress Dots */}
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                            {heroVideoSegments.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentHeroVideoIndex(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  index === currentHeroVideoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 70/30 Split Layout Wrapper - Starts from Key Features */}
        <div className="w-full">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-4 lg:max-w-[1400px] lg:mx-auto lg:px-4">
          
          {/* Main Content - 70% */}
          <div className="w-full" style={{ gridColumn: '1' }}>
        {/* Key Features - Modern grid layout */}
        <section className="px-5 sm:px-6 pt-12 pb-16 scroll-animate relative z-0">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Key Features</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                {pd.features.map((feature, index) => <div key={index} className="group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-xl border border-neutral-200 hover:border-brand-red/50 hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/10 to-brand-maroon/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6 text-brand-red" />
                </div>
                <p className="text-foreground font-medium leading-relaxed pt-1 text-sm sm:text-base">{feature}</p>
              </div>)}
          </div>
        </section>

        {/* Video Section - Carousel with navigation */}
        {developerId === 'canny-forest-edge' && (
          <section className="px-5 sm:px-6 pb-16 scroll-animate">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Project Videos</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            {/* Video Carousel Container */}
            <div className="relative">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden max-w-sm mx-auto md:max-w-full">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[9/16] md:aspect-video bg-neutral-900">
                    {/* Video slides */}
                    <div className="relative w-full h-full overflow-hidden">
                      {[
                        { title: 'Project Overview', video: cannyForestEdgeVideo },
                        { title: 'Amenities Tour', video: forestEdgeHeroVideo },
                        { title: 'Apartment Walkthrough', video: cannyForestEdgeVideo },
                        { title: 'Neighbourhood View', video: forestEdgeHeroVideo }
                      ].map((segment, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-500 ${
                            index === currentVideoIndex 
                              ? 'opacity-100 translate-x-0' 
                              : index < currentVideoIndex 
                                ? 'opacity-0 -translate-x-full' 
                                : 'opacity-0 translate-x-full'
                          }`}
                        >
                          <video 
                            className="w-full h-full object-cover" 
                            playsInline 
                            loop 
                            preload="metadata" 
                            muted 
                            autoPlay={index === currentVideoIndex}
                            onClick={handleVideoClick}
                          >
                            <source src={segment.video} type="video/mp4" />
                          </video>
                          
                          {/* Video Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h3 className="text-white font-semibold text-lg md:text-xl">{segment.title}</h3>
                            <div className="flex gap-1 mt-2">
                              {[0, 1, 2, 3].map((dot) => (
                                <div
                                  key={dot}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    dot === currentVideoIndex 
                                      ? 'w-8 bg-white' 
                                      : 'w-1.5 bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={() => setCurrentVideoIndex((prev) => (prev === 0 ? 3 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110 z-20"
                      aria-label="Previous video"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentVideoIndex((prev) => (prev === 3 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110 z-20"
                      aria-label="Next video"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>

                    {/* Fullscreen button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFullscreen();
                      }}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110 z-20"
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

         {/* Apartment Interiors - 3D Carousel Gallery */}
         <section className="px-5 sm:px-6 py-16 scroll-animate">
           <div className="mb-8 text-center sm:text-left">
             <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Apartment Interiors</h2>
             <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
               </div>
          
          {/* Smooth Swipe Carousel Container - Static black background with scrolling images inside */}
          <div className="relative">
            <Card className="border-0 shadow-2xl bg-transparent md:bg-black overflow-hidden h-[500px] md:h-[600px] relative">
              <div ref={interiorCarouselRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar h-full relative" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}>
                {interiorImages.map((image, index) => {
                // Use scrollProgress for blur transition effect
                const offset = index - scrollProgress;
                const absOffset = Math.abs(offset);

                // Calculate blur based on distance from center - more aggressive blur
                const blurAmount = absOffset < 0.1 ? 0 : Math.min(absOffset * 8, 15); // Max 15px blur when not in focus
                // Calculate opacity for smooth fade in/out
                const opacity = absOffset < 0.5 ? 1 : Math.max(0.2, 1 - absOffset * 0.5);
                return <div key={index} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-0 md:p-4" style={{
                  position: 'absolute',
                  top: 0,
                  left: `${index * 100}%`,
                  width: '100%',
                  height: '100%',
                  opacity: opacity,
                  filter: `blur(${blurAmount}px)`,
                  transition: 'opacity 1.2s ease-in-out, filter 1.2s ease-in-out',
                  willChange: 'opacity, filter',
                  pointerEvents: absOffset < 0.5 ? 'auto' : 'none'
                }}>
                      <img src={image} alt={`Apartment Interior ${index + 1}`} className="w-full h-full md:w-auto md:h-auto max-w-full max-h-full object-cover md:object-contain" style={{
                    maxWidth: 'calc(100% - 2rem)',
                    maxHeight: 'calc(100% - 2rem)'
                  }} />
                    </div>;
              })}
                {/* Spacer divs to maintain scroll width */}
                {interiorImages.map((_, index) => <div key={`spacer-${index}`} className="flex-shrink-0 w-full h-full" aria-hidden="true" />)}
              </div>
            </Card>
          </div>

          {/* Custom styles for 3D carousel */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </section>

         {/* Floor Plans - Premium showcase */}
         <section className="px-5 sm:px-6 pb-16 scroll-animate">
           <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
             <div className="text-center sm:text-left">
               <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Floor Plans</h2>
               <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
             </div>
            <Button variant="ghost" className="text-brand-red hover:text-brand-maroon font-semibold">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Configuration Filter Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap justify-center sm:justify-start">
                {pd.configurations.map((config, index) => <Button key={index} variant={index === 0 ? "default" : "outline"} size="lg" className={index === 0 ? "bg-gradient-to-r from-brand-red to-brand-maroon hover:from-brand-maroon hover:to-brand-maroon-dark text-white shadow-lg font-semibold" : "border-2 hover:border-brand-red hover:text-brand-red font-semibold"}>
                    {config.type}
                  </Button>)}
              </div>

          {/* Floor Plan Cards - Modern grid with actual images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floorPlanImages.map((floorPlan, index) => <Card key={index} className="group border-2 border-neutral-200 hover:border-brand-red/50 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => setSelectedFloorPlanIndex(index)}>
                <div className="relative aspect-square bg-white rounded-t-xl overflow-hidden">
                  <img src={floorPlan} alt={`Floor Plan ${index + 1}`} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Floor Plan {index + 1}</h3>
                  <Button variant="outline" className="w-full border-2 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all font-semibold group" onClick={e => {
                e.stopPropagation();
                setIsContactFormOpen(true);
              }}>
                    Request Price <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
            </CardContent>
          </Card>)}
          </div>
          
          {/* Floor Plan Modal - Full size image viewer */}
          {selectedFloorPlanIndex !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedFloorPlanIndex(null)}>
              <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                <img src={floorPlanImages[selectedFloorPlanIndex]} alt={`Floor Plan ${selectedFloorPlanIndex + 1}`} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
                <button onClick={() => setSelectedFloorPlanIndex(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all hover:scale-110" aria-label="Close">
                  <X className="h-6 w-6 text-white" />
                </button>
                {/* Navigation arrows */}
                {floorPlanImages.length > 1 && <>
                    <button onClick={e => {
                e.stopPropagation();
                setSelectedFloorPlanIndex((selectedFloorPlanIndex - 1 + floorPlanImages.length) % floorPlanImages.length);
              }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all hover:scale-110" aria-label="Previous">
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button onClick={e => {
                e.stopPropagation();
                setSelectedFloorPlanIndex((selectedFloorPlanIndex + 1) % floorPlanImages.length);
              }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all hover:scale-110" aria-label="Next">
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                  </>}
              </div>
            </div>}
        </section>

        {/* Amenities - Premium grid with icons */}
        <section className="bg-gradient-to-b from-neutral-50 to-white py-16 scroll-animate">
          <div className="px-5 sm:px-6">
            <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Amenities</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
              </div>
              <Button variant="ghost" className="text-brand-red hover:text-brand-maroon font-semibold">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {pd.amenities.map((amenity, index) => <div key={index} className="group flex flex-col items-center gap-3 p-4 sm:p-6 bg-white rounded-xl border-2 border-neutral-200 hover:border-brand-red hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-brand-red/10 to-brand-maroon/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-brand-red/20 group-hover:to-brand-maroon/20 transition-all">
                    {amenityIcons[amenity] || <Star className="h-7 w-7 sm:h-8 sm:w-8 text-brand-red" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-center text-foreground leading-tight">{amenity}</span>
                  </div>)}
              </div>
          </div>
        </section>

        {/* About the Project - Rich content section */}
        <section className="px-5 sm:px-6 py-16 scroll-animate">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">About {developer.name}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
              </div>
              <div className="prose prose-lg max-w-none">
                <div className="text-muted-foreground leading-relaxed space-y-6 text-base md:text-lg">
                {developer.description.split('. ').map((sentence, index) => sentence.trim() && <p key={index} className="mb-0">
                      {sentence.trim()}{index < developer.description.split('. ').length - 1 ? '.' : ''}
                    </p>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Location & Map */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-16 pb-48 lg:pb-56 scroll-animate">
          <div className="px-5 sm:px-6">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Location & Neighbourhood</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <iframe
                src="https://maps.google.com/maps?ll=17.5428399,78.4060426&q=17.5428399,78.4060426&z=16&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Canny Forest Edge, Bachupally - Location Map"
                className="w-full"
              ></iframe>
            </div>
            <div className="hidden mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <MapPin className="h-6 w-6 text-brand-red flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Canny Forest Edge</p>
                <p className="text-muted-foreground">Bachupally, Hyderabad, Telangana</p>
              </div>
              <a
                href="https://www.google.com/maps/place/Canny+Forest+Edge/@17.5428399,78.4038539,17z/data=!3m1!4b1!4m5!3m4!1s0x3bcb8fc6acafcec1:0xa65b820b460d291a!8m2!3d17.5428399!4d78.4060426"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-maroon transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                Get Directions
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
         </section>

        </div>
        {/* End Main Content (70%) */}
        
        {/* CTA Sidebar - 30% (Desktop Only, Sticky - scrolls until Location section) */}
        <aside className="hidden lg:block space-y-6 lg:sticky lg:top-24 lg:self-start h-fit" style={{ gridColumn: '2', maxWidth: '340px' }}>
          
          {/* Property Highlights Card */}
          <Card className="shadow-lg border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Why you should buy
                </h3>
                <p className="text-lg font-bold text-foreground">{developer.name}?</p>
              </div>
              
              {/* Benefits List */}
              <div className="space-y-3 mb-6">
                {developer.specializations?.slice(0, 4).map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{spec}</span>
                  </div>
                ))}
              </div>
              
              {/* Property Highlights */}
              <div className="mb-6 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <h4 className="text-sm font-bold text-foreground mb-3">Property Highlights</h4>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">✓ Premium 2 BHK apartments with 1285 sq.ft super built-up area</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">✓ Ready to move-in possession with RERA approval (P02200003658)</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">✓ Surrounded by 200 acres of lush forest with 66% open area</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">✓ Wide cantilever balconies offering breathtaking forest views</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  View Number
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Brochure
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Shortlist
                </Button>
              </div>
            </CardContent>
          </Card>
          
        </aside>
        {/* End CTA Sidebar (30%) */}
        
        </div>
        {/* End 70/30 Grid Wrapper */}
        </div>
        {/* End overflow wrapper */}

        {/* Full Width Sections Below */}

         {/* About the Builder - Premium dark section */}
         <section className="bg-gradient-to-br from-[#001F3F] via-[#0A2A43] to-[#001829] py-16 scroll-animate">
           <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 md:p-12">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-8 mb-8">
                <div className="relative flex-shrink-0">
              <img src={developer.logo} alt="Canny Life Spaces" className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-2xl object-contain bg-white p-3 shadow-xl border-2 border-white/20" />
                </div>
                <div className="flex-1 text-white text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-3">About the Builder</h2>
                  <h3 className="text-xl md:text-2xl mb-4 text-white/90">Canny Life Spaces Pvt Ltd</h3>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <Calendar className="h-4 w-4" />
                    Years in business: <span className="text-white">{parseInt(new Date().getFullYear().toString()) - parseInt(developer.founded)} Years</span>
                  </div>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base md:text-lg">
                    Canny Life Spaces Pvt Ltd has been one of the most premium real estate developers in India since its inception. 
                    It has firmly established itself as a brand to reckon with in the real estate industry in India and abroad, 
                    delivering excellence in every project.
                </p>
              </div>
            </div>
              
              {/* Projects by Builder */}
              <div className="mt-10 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">Projects by Canny Life Spaces</h3>
                  <Button variant="ghost" className="text-white hover:bg-white/10 font-semibold">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={forestEdgeProjectImage} alt={developer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-xl text-white mb-2">{developer.name}</h4>
                      <p className="text-sm text-white/70">2 BHK Luxurious Residences</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

         {/* Similar Projects - Horizontal scrollable carousel */}
         <section className="bg-white py-16 scroll-animate">
           <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Similar Projects</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
                </div>

            {/* Scrollable Projects Carousel */}
            <div className="relative">
              {/* Left Scroll Arrow */}
              {canScrollLeft && <button onClick={() => {
              if (similarProjectsRef.current) {
                similarProjectsRef.current.scrollBy({
                  left: -400,
                  behavior: 'smooth'
                });
              }
            }} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all hover:scale-110 z-10" aria-label="Scroll left">
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>}
              
              <div ref={similarProjectsRef} className="flex gap-6 overflow-x-auto pb-6 scroll-smooth hide-scrollbar" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}>
                {/* Similar Project Cards */}
                {[{
                image: forestEdgeExterior,
                price: '₹82 L onwards',
                bhk: '2 BHK',
                name: 'Modern Spaaces Engrace Phase 2',
                location: 'Opp to Bricks & Milestone Felicit...',
                url: '#'
              }, {
                image: forestEdgeAerial,
                price: '₹2.18 Crs - ₹2.52 Crs',
                bhk: '3 BHK',
                name: 'Assetz Trees And Tandem',
                location: 'Near Bouncers Cricket Club, Cho...',
                url: '#'
              }, {
                image: forestEdgeAmenities1,
                price: '₹1.5 Crs - ₹2.2 Crs',
                bhk: '2, 3 BHK',
                name: 'Navanaami Courtyard Of Life',
                location: 'Gachibowli, Hyderabad',
                url: '#'
              }, {
                image: forestEdgePool,
                price: '₹95 L onwards',
                bhk: '2 BHK',
                name: 'Prestige High Fields',
                location: 'Nallagandla, Hyderabad',
                url: '#'
              }, {
                image: forestEdgeLawn,
                price: '₹1.8 Crs - ₹2.5 Crs',
                bhk: '3 BHK',
                name: 'Lodha Upper Thane',
                location: 'Thane, Mumbai',
                url: '#'
              }].map((project, index) => <Card key={index} className="flex-shrink-0 w-[320px] sm:w-[360px] border-2 border-neutral-200 hover:border-brand-red/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Project Image */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-100">
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>
                    
                    <CardContent className="p-5">
                      {/* Price and BHK */}
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-xl font-bold text-foreground">{project.price}</div>
                        <div className="text-sm text-muted-foreground">{project.bhk}</div>
                      </div>
                      
                      {/* Project Name */}
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{project.name}</h3>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button className="flex-1 bg-brand-red hover:bg-brand-maroon text-white font-semibold" onClick={() => window.open(project.url, '_blank')}>
                          View Project
                        </Button>
                        <button onClick={() => {
                      const whatsappUrl = `https://wa.me/919833662222?text=Hi, I'm interested in ${encodeURIComponent(project.name)}`;
                      window.open(whatsappUrl, '_blank');
                    }} className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-lg hover:shadow-xl" aria-label="Contact via WhatsApp">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </button>
              </div>
            </CardContent>
          </Card>)}
              </div>
              
              {/* Right Scroll Arrow */}
              {canScrollRight && <button onClick={() => {
              if (similarProjectsRef.current) {
                similarProjectsRef.current.scrollBy({
                  left: 400,
                  behavior: 'smooth'
                });
              }
            }} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition-all hover:scale-110 z-10" aria-label="Scroll right">
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>}
            </div>
          </div>
        </section>

         {/* RERA & Legal Certificates - Trust section */}
         <section className="bg-gradient-to-b from-white to-neutral-50 py-16 scroll-animate">
           <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">RERA & Legal Certificates</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-maroon rounded-full mx-auto sm:mx-0"></div>
                </div>
                
                <div className="space-y-8">
                  {/* RERA Certificate Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-blue-100 max-w-xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto sm:mx-0">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">RERA Certificate</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          The Real Estate (Regulation and Development) Act, 2016 is an Act of the Parliament of India which seeks to 
                    protect home-buyers as well as boost investments in the real estate industry. The Act came into force on 1 May 2016.
                  </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl p-5 sm:p-6 border border-blue-200 w-full">
                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Telangana RERA</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground break-all">{pd.rera}</p>
                    </div>
                      <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center rounded-lg shadow-none border-2 border-blue-300 hover:bg-blue-50 font-semibold">
                        View Certificate <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                  {/* RERA Benefits Grid */}
                      <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-6 text-center sm:text-left">Benefits of RERA</h3>
                    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                      {[{
                      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
                      title: 'Timely Dispute Resolution',
                      desc: 'Buyer can approach RERA authorities within 60 days from date of problem identified'
                    }, {
                      icon: <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />,
                      title: 'Quality Assurance',
                      desc: 'Quality standards as set out by authorities must be followed by developers'
                    }, {
                      icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />,
                      title: 'Transparency & Tracking',
                      desc: 'Allows buyers to track progress milestones and defects'
                    }, {
                      icon: <Award className="h-5 w-5 sm:h-6 sm:w-6" />,
                      title: 'Buyer Protection',
                      desc: 'Buyers can get grievance redressed within project completion'
                    }].map((benefit, idx) => <div key={idx} className="group flex gap-4 p-5 sm:p-6 bg-gradient-to-br from-neutral-50 to-white rounded-xl border-2 border-neutral-200 hover:border-brand-red/50 hover:shadow-lg transition-all">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-red/10 to-brand-maroon/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="text-brand-red">{benefit.icon}</div>
                      </div>
                      <div>
                            <h4 className="font-bold text-foreground mb-2 text-sm sm:text-base">{benefit.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {benefit.desc}
                        </p>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
           </div>
         </section>

         <Footer />

         {/* Contact Form Modal */}
         <DeveloperContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} developerName={developer.name} />
      </div>;
  }

  // Default developer page layout for other developers
  return <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-brand-red via-brand-maroon to-brand-maroon-dark text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-shrink-0 animate-fade-in">
              <div className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 bg-white rounded-2xl p-6 md:p-8 shadow-2xl hover-lift">
                <img src={developer.logo} alt={`${developer.name} logo`} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left animate-fade-in">
              <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                Rank #{developer.rank} Developer
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                {developer.name}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed">
                {developer.highlights}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 bg-gradient-light">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6 md:gap-8 lg:gap-10">
            
            {/* Main Content */}
            <div className="space-y-6 md:space-y-8">
              
              {/* About Section */}
              <Card className="hover-lift border-0 md:border backdrop-blur-sm animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-maroon flex items-center justify-center shadow-lg">
                      <Building2 className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        About {developer.name}
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                    {developer.description.split('. ').map((sentence, index) => sentence.trim() && <p key={index} className="leading-relaxed">
                          {sentence.trim()}{index < developer.description.split('. ').length - 1 ? '.' : ''}
                        </p>)}
                  </div>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Our Specializations</h3>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    {developer.specializations.map((spec, index) => <div key={index} className="group flex items-center gap-3 p-4 bg-gradient-to-br from-secondary/50 to-background rounded-xl border-0 md:border md:border-border/50 md:hover:border-brand-red/30 transition-all duration-300 hover:shadow-md">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                          <Star className="h-4 w-4 text-brand-red" />
                        </div>
                        <span className="font-medium text-sm md:text-base text-foreground">{spec}</span>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              {/* Key Projects */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Key Projects</h3>
                  <div className="space-y-3 md:space-y-4">
                    {developer.keyProjects.map((project, index) => <div key={index} className="group flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-secondary/30 to-background rounded-xl hover:from-secondary/50 hover:to-background transition-all duration-300 hover:shadow-md border-0 md:border md:border-border/50 md:hover:border-brand-red/30">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300">
                          <ArrowRight className="h-4 w-4 text-brand-red group-hover:text-white transition-colors" />
                        </div>
                        <p className="font-medium text-sm md:text-base text-foreground leading-relaxed pt-1">{project}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              {/* Awards */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-maroon flex items-center justify-center shadow-lg">
                      <Award className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      Awards & Recognition
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    {developer.awards.map((award, index) => <div key={index} className="group flex items-start gap-3 p-4 bg-gradient-to-br from-brand-red/5 to-background border-0 md:border md:border-brand-red/20 md:hover:border-brand-red/40 hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors mt-0.5">
                          <Award className="h-4 w-4 text-brand-red" />
                        </div>
                        <span className="font-medium text-sm md:text-base text-foreground leading-relaxed">{award}</span>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* Company Details */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-foreground">Company Details</h3>
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-1">Founded</div>
                        <div className="text-muted-foreground text-sm">{developer.founded}</div>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-1">Headquarters</div>
                        <div className="text-muted-foreground text-sm">{developer.headquarters}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-foreground">Contact Information</h3>
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-brand-red" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-1">Phone</div>
                        <a href={`tel:${developer.contact.phone}`} className="text-muted-foreground text-sm hover:text-brand-red transition-colors break-all">
                          {developer.contact.phone}
                        </a>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-brand-red" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-1">Email</div>
                        <a href={`mailto:${developer.contact.email}`} className="text-muted-foreground text-sm hover:text-brand-red transition-colors break-all">
                          {developer.contact.email}
                        </a>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-brand-red" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-1">Website</div>
                        <a href={`https://${developer.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-brand-red transition-colors break-all">
                          {developer.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="shadow-xl bg-gradient-to-br from-brand-red/5 via-brand-red/10 to-brand-maroon/10 backdrop-blur-sm overflow-hidden relative animate-fade-in border-0 md:border md:border-brand-red/20">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent"></div>
                <CardContent className="p-5 sm:p-6 md:p-8 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-red to-brand-maroon flex items-center justify-center shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">Interested in Their Projects?</h3>
                  <p className="text-muted-foreground mb-6 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                    Get in touch with {developer.name} for investment opportunities and project details.
                  </p>
                  <Button size="lg" className="w-full bg-gradient-to-r from-brand-red to-brand-maroon hover:from-brand-maroon hover:to-brand-maroon-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" onClick={() => setIsContactFormOpen(true)}>
                    Contact Developer
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
      
      <Footer />

      {/* Contact Form Modal */}
      <DeveloperContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} developerName={developer.name} />
    </div>;
};
export default DeveloperPage;