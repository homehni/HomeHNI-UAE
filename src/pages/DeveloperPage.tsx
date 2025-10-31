import React, { useState } from 'react';
import { Building2, MapPin, Calendar, Users, Award, Leaf, Star, Phone, Mail, Globe, ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { DeveloperContactForm } from "@/components/DeveloperContactForm";
import { PropertyGalleryCarousel } from "@/components/PropertyGalleryCarousel";
import prestigeGroupLogo from '@/assets/prestige-group-logo.jpg';
import godrejPropertiesLogo from '@/assets/godrej-properties-logo.jpg';
import ramkyGroupLogo from '@/assets/ramky-group-logo.jpg';
import brigadeGroupLogo from '@/assets/brigade-group-logo.jpg';
import aparnaConstructionsLogo from '@/assets/aparna-constructions-logo.jpg';
import aliensGroupLogo from '@/assets/aliens-group-logo.jpg';
import cannyForestEdgeLogo from '@/assets/canny-forest-edge-logo.jpg';
import alpineInfratechLogo from '@/assets/alpine-infratech-logo.png';
import forestEdgeExterior from '@/assets/forest-edge-exterior.jpg';
import forestEdgeLiving1 from '@/assets/forest-edge-living1.jpg';
import forestEdgeLiving2 from '@/assets/forest-edge-living2.jpg';
import forestEdgeBedroom1 from '@/assets/forest-edge-bedroom1.jpg';
import forestEdgeKitchen from '@/assets/forest-edge-kitchen.jpg';
import forestEdgeLiving3 from '@/assets/forest-edge-living3.jpg';
import forestEdgeBedroom2 from '@/assets/forest-edge-bedroom2.jpg';

const DeveloperPage = () => {
  const { developerId } = useParams();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const developers = {
    'prestige-group': {
      name: 'Prestige Group',
      logo: prestigeGroupLogo,
      rank: 1,
      founded: '1986',
      headquarters: 'Bangalore, India',
      highlights: 'Large-scale mixed-use projects, strong presence across South India',
      description: 'Prestige Group is one of India\'s leading real estate developers with over 35 years of experience. Known for their premium residential and commercial projects across South India, they have delivered over 280 projects covering 140 million sq ft of developable area.',
      specializations: [
        'Premium Residential Projects',
        'Commercial Complexes',
        'Mixed-use Developments',
        'Hospitality Projects',
        'Retail Spaces'
      ],
      keyProjects: [
        'Prestige Lakeside Habitat - Premium residential complex',
        'Prestige Tech Platina - IT park and commercial space',
        'Prestige Shantiniketan - Integrated township',
        'Prestige Golfshire - Golf course community'
      ],
      awards: [
        'FIABCI Prix d\'Excellence Award',
        'CNBC Awaaz Real Estate Awards',
        'Best Developer - South India',
        'Excellence in Real Estate Development'
      ],
      contact: {
        phone: '+91 80 4655 5555',
        email: 'info@prestigeconstructions.com',
        website: 'www.prestigeconstructions.com'
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
      specializations: [
        'Sustainable Development',
        'Smart Homes Technology',
        'Premium Residential',
        'Commercial Spaces',
        'Plotted Developments'
      ],
      keyProjects: [
        'Godrej Park Avenue - Luxury apartments',
        'Godrej 24 - Premium residential towers',
        'Godrej Emerald - Green certified homes',
        'Godrej City - Integrated township'
      ],
      awards: [
        'India Green Building Council Certification',
        'CREDAI Awards for Excellence',
        'Best Practices in Sustainability',
        'Developer of the Year'
      ],
      contact: {
        phone: '+91 22 2518 8010',
        email: 'marketing@godrejproperties.com',
        website: 'www.godrejproperties.com'
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
      specializations: [
        'Infrastructure Development',
        'Sustainable Construction',
        'Urban Planning',
        'Residential Communities',
        'Environmental Solutions'
      ],
      keyProjects: [
        'Ramky One Galaxia - Premium residential',
        'Ramky One North - Integrated township',
        'Ramky Towers - Commercial complex',
        'Ramky Infrastructure Projects'
      ],
      awards: [
        'Green Building Certification',
        'Excellence in Infrastructure',
        'Sustainable Development Award',
        'Best Regional Developer'
      ],
      contact: {
        phone: '+91 40 4033 4000',
        email: 'info@ramkygroup.com',
        website: 'www.ramkygroup.com'
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
      specializations: [
        'Residential Development',
        'Commercial Projects',
        'Hospitality Ventures',
        'Retail Spaces',
        'Mixed-use Developments'
      ],
      keyProjects: [
        'Brigade Cornerstone Utopia - Premium apartments',
        'World Trade Center Brigade Gateway',
        'Brigade Millennium - IT park',
        'The Sheraton Grand Bangalore Hotel'
      ],
      awards: [
        'CREDAI National Award',
        'Karnataka State Award',
        'Best Mixed-use Development',
        'Excellence in Architecture'
      ],
      contact: {
        phone: '+91 80 4137 4000',
        email: 'info@brigadegroup.com',
        website: 'www.brigadegroup.com'
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
      specializations: [
        'Tech-enabled Homes',
        'Eco-friendly Construction',
        'Quality Architecture',
        'Customer-centric Design',
        'Modern Amenities'
      ],
      keyProjects: [
        'Aparna Sarovar Grande - Luxury villas',
        'Aparna Cyber Life - IT corridor apartments',
        'Aparna Hillpark - Gated community',
        'Aparna Constructions Commercial Hub'
      ],
      awards: [
        'CREDAI Hyderabad Award',
        'Excellence in Quality Construction',
        'Best Residential Developer',
        'Customer Satisfaction Award'
      ],
      contact: {
        phone: '+91 40 4020 4040',
        email: 'info@aparnaconstructions.com',
        website: 'www.aparnaconstructions.com'
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
      specializations: [
        'Iconic Architecture',
        'Skyscraper Development',
        'Contemporary Design',
        'Urban Landmarks',
        'Premium Living Spaces'
      ],
      keyProjects: [
        'Aliens Space Station Township',
        'Aliens Hub - Commercial tower',
        'Aliens Matrix - Residential complex',
        'Aliens Signature Towers'
      ],
      awards: [
        'Architectural Excellence Award',
        'Design Innovation Recognition',
        'Best Upcoming Developer',
        'Modern Architecture Award'
      ],
      contact: {
        phone: '+91 40 2311 1111',
        email: 'info@aliensgroup.com',
        website: 'www.aliensgroup.com'
      }
    },
    'canny-forest-edge': {
      name: "Forest Edge",
      logo: cannyForestEdgeLogo,
      rank: 7,
      founded: '2010',
      headquarters: 'Bachupally, Hyderabad',
      highlights: '2BHK & 3BHK Luxurious Residences - Ready to move in, 66% open area with 200 acres forest view',
      description: "Forest Edge is a premium residential project spread across 1.52 acres with 197 flats in Bachupally, Hyderabad. The project offers 2BHK apartments of 1125 & 1285 Sft and 3BHK apartments ranging from 1505 Sft to 2200 Sft with ready to move-in possession. TS RERA Approved (P02200003658). Experience luxurious living with 66% open area and breathtaking 200 acres of forest view, featuring wide cantilever balconies and impeccably landscaped surroundings.",
      specializations: [
        '2BHK - 1125 & 1285 Sft',
        '3BHK - 1505, 1675, 1985 & 2200 Sft',
        'Ready to Move In',
        '66% Open Area',
        '200 Acres Forest View',
        'TS RERA Approved (P02200003658)'
      ],
      keyProjects: [
        '1.52 Acres with 197 Premium Flats',
        'Wide Cantilever Balconies for Panoramic Views',
        'Clubhouse with Swimming Pool & Fitness Center',
        'Impeccably Landscaped Gardens & Recreational Areas',
        '24/7 Security with Dedicated Concierge Services'
      ],
      awards: [
        'TS RERA Approved Project',
        'Multiple Bank Financing Options',
        'Premium Location - Bachupally',
        'Forest View Living Experience'
      ],
      contact: {
        phone: '+91 9833662222',
        email: 'info@cannylifespaces.com',
        website: 'www.cannylifespaces.com'
      },
      // Property-specific details
      propertyDetails: {
        price: {
          min: 66.36,
          max: 129.78,
          unit: 'Lacs',
          perSqft: 5899
        },
        location: 'Sy. No. 369/A/2, Opp. Hamara Family Dhaba, Bachupally, Hyderabad',
        locality: 'Bachupally',
        city: 'Hyderabad',
        configurations: [
          { type: '2 BHK', sizes: ['1125 Sft', '1285 Sft'] },
          { type: '3 BHK', sizes: ['1505 Sft', '1675 Sft', '1985 Sft', '2200 Sft'] }
        ],
        projectArea: '1.52 Acres',
        totalUnits: 197,
        status: 'Ready to Move In',
        possession: 'Immediate',
        rera: 'P02200003658',
        amenities: [
          'Clubhouse',
          'Swimming Pool',
          'Fitness Center',
          'Kids Play Area',
          'Landscaped Gardens',
          '24/7 Security',
          'CCTV Surveillance',
          'Power Backup',
          'Rainwater Harvesting',
          'Sewage Treatment Plant'
        ],
        features: [
          'Just 3 KM from Nigma Metro Junction',
          'Well-Maintained Infrastructure',
          'Just 3 KM from Nigma Metro Junction',
          '66% Open Area with 200 Acres Forest View'
        ]
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
      specializations: [
        '2BHK - 1120 Sft Apartments',
        'Ready to Move In',
        '47% Open Area',
        '2420 Sqyd Party Lawn',
        'Bank Approved (SBI, HDFC, LIC, Bajaj, Sundaram)',
        'Price @ ₹5200/Sft',
        '1.5 km from Bolaraum MMTS Station',
        '5 mins to D-Mart & Cineplanet'
      ],
      keyProjects: [
        'GMR Springfield - 4 Acres, 370 Flats, G+5 Blocks',
        'Location: 1.5 km from Bolaraum MMTS Station',
        '5 mins drive to D-Mart, Cineplanet, Shopping Malls',
        'Easy connectivity to Banks, Schools, Hospitals'
      ],
      awards: [
        'TS RERA Approved - P02200003938',
        'Bank Approvals from SBI, HDFC, LIC',
        'Bajaj Finance & Sundaram Finance Approved',
        'Premium Location - Kompally-Bollarum'
      ],
      contact: {
        phone: '+91 40 4567 8900',
        email: 'info@alpineinfratech.com',
        website: 'www.alpineinfratech.com'
      }
    }
  };

  const developer = developers[developerId as keyof typeof developers];

  if (!developer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Developer Not Found</h1>
          <p className="text-muted-foreground">The developer you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Check if this is a property-detail style page
  const isPropertyDetail = 'propertyDetails' in developer;

  // Render property-detail layout for Forest Edge
  if (isPropertyDetail && developer.propertyDetails) {
    const pd = developer.propertyDetails;
    
    // Forest Edge carousel images
    const forestEdgeImages = [
      forestEdgeExterior,
      forestEdgeLiving1,
      forestEdgeLiving2,
      forestEdgeBedroom1,
      forestEdgeKitchen,
      forestEdgeLiving3,
      forestEdgeBedroom2
    ];
    
    return (
      <div className="min-h-screen bg-background">
        <Marquee />
        <Header />
        
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-7xl px-4 pt-24 pb-4">
          <div className="text-sm text-muted-foreground">
            Home / Hyderabad / Bachupally / <span className="text-foreground font-medium">{developer.name}</span>
          </div>
        </div>

        {/* Hero Section with Mixed Gallery Layout */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <PropertyGalleryCarousel 
            images={forestEdgeImages}
            autoScrollInterval={4000}
            className="shadow-2xl"
          />
        </section>

        {/* Property Header */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Property Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <img 
                  src={developer.logo} 
                  alt="Canny Life Spaces"
                  className="w-16 h-16 rounded-lg object-contain bg-white p-2 shadow-md"
                />
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{developer.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {pd.locality}, {pd.city}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">By Canny Life Spaces Pvt Ltd</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-red">
                    ₹{pd.price.min} Cr - ₹{pd.price.max} Cr
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    @ ₹{pd.price.perSqft}/Sft
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {pd.status}
                </div>
                <div className="text-sm text-muted-foreground">
                  Possession in {pd.possession}
                </div>
              </div>

              {/* Property Details Grid */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">SIZE CONFIGURATION</div>
                      <div className="font-semibold text-foreground">
                        {pd.configurations.map(c => c.type).join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">CARPET AREA</div>
                      <div className="font-semibold text-foreground">
                        {pd.configurations[0].sizes[0]} - {pd.configurations[pd.configurations.length - 1].sizes[pd.configurations[pd.configurations.length - 1].sizes.length - 1]}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">NO. OF UNITS</div>
                      <div className="font-semibold text-foreground">{pd.totalUnits}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">PROJECT AREA</div>
                      <div className="font-semibold text-foreground">{pd.projectArea}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefit Banner */}
              <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Leaf className="h-8 w-8 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Get Benefits worth ₹2 Lacs*
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Free site visit • Post site-visit subsidy • Expert insights on locations & neighborhoods
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-brand-red to-brand-maroon hover:from-brand-maroon hover:to-brand-maroon-dark">
                  Claim Now →
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 flex-wrap">
                <Button 
                  variant="outline" 
                  className="flex-1 min-w-[200px]"
                >
                  ⬇ Download Brochure
                </Button>
                <Button 
                  className="flex-1 min-w-[200px] bg-brand-red hover:bg-brand-maroon"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  Contact Builder →
                </Button>
              </div>
            </div>

            {/* Right Sidebar - Contact Form */}
            <div className="lg:w-96">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Why Search Alone?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Looking for your dream home?
                  </p>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-red rounded-full mt-2"></div>
                      <span>Free site visits to explore your options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-red rounded-full mt-2"></div>
                      <span>Expert insights on locations & neighborhoods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-red rounded-full mt-2"></div>
                      <span>Post a need & get properties viewed by you</span>
                    </li>
                  </ul>
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Padma"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="navijayatha3126@gmail.com"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="+91 9618630468"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <Button 
                    className="w-full bg-brand-red hover:bg-brand-maroon mb-4"
                    onClick={() => setIsContactFormOpen(true)}
                  >
                    Connect →
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-brand-red font-medium mb-2">
                      Ask a question about <span className="text-primary">the project</span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get a quick response & free Expert Advice now!
                    </p>
                    <textarea
                      placeholder="Type a question..."
                      className="w-full px-4 py-2 border rounded-lg mb-3 text-sm"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="What is the possession date of this project?"
                      className="w-full px-4 py-2 border rounded-lg mb-3 text-sm"
                    />
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      Ask Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <ul className="space-y-3">
                {pd.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full mt-2"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Floor Plans */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{developer.name} Floor Plans</h2>
                <Button variant="link" className="text-primary">View All →</Button>
              </div>
              <div className="flex gap-4 mb-6">
                {pd.configurations.map((config, index) => (
                  <Button 
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 ? "bg-brand-red hover:bg-brand-maroon" : ""}
                  >
                    {config.type}
                  </Button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {pd.configurations.slice(0, 2).map((config, index) => (
                  <div key={index} className="border rounded-xl p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-gray-400" />
                    </div>
                    <h3 className="font-bold mb-2">{config.type} Floor Plan</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Carpet Area : {config.sizes.join(', ')}
                    </p>
                    <Button variant="link" className="text-primary p-0">
                      Request Price →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Amenities */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Amenities in {developer.name}</h2>
                <Button variant="link" className="text-primary">View All →</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {pd.amenities.slice(0, 10).map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <Star className="h-8 w-8 text-brand-red" />
                    <span className="text-sm text-center">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* About the Project */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">About the {developer.name}</h2>
                <Button variant="link" className="text-primary">View All →</Button>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                {developer.description.split('. ').map((sentence, index) => (
                  sentence.trim() && (
                    <p key={index}>
                      {sentence.trim()}{index < developer.description.split('. ').length - 1 ? '.' : ''}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* About the Builder */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-950 text-white">
            <CardContent className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <img 
                  src={developer.logo} 
                  alt="Canny Life Spaces"
                  className="w-20 h-20 rounded-lg object-contain bg-white p-2"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">About the Builder</h2>
                  <h3 className="text-xl mb-4">Canny Life Spaces Pvt Ltd</h3>
                  <p className="text-sm mb-1">Years in business: <span className="font-semibold">{parseInt(new Date().getFullYear().toString()) - parseInt(developer.founded)} Years</span></p>
                  <p className="text-white/90 leading-relaxed">
                    Canny Life Spaces Pvt Ltd, has been one of the most premium real estate developer in India since its inception. 
                    It has firmly established itself as a brand to reckon with in the real estate in India and abroad...
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-blue-900 hover:bg-gray-100">
                Show more ↓
              </Button>
              
              {/* Projects Carousel */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">PROJECTS BY CANNY LIFE SPACES PVT LTD</h3>
                  <Button variant="link" className="text-white">View All →</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="aspect-video bg-white/20"></div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2">Forest Edge</h4>
                      <p className="text-sm text-white/80">2 BHK - 3 BHK</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reviews */}
        <section className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews of {developer.name}</h2>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">WRITE A REVIEW</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
                  ))}
                </div>
                <textarea
                  placeholder="Write about the project"
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                  rows={4}
                />
                <Button className="bg-brand-red hover:bg-brand-maroon">Post</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* RERA & Legal Certificates */}
        <section className="container mx-auto max-w-7xl px-4 pb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">{developer.name} - RERA & Legal Certificates</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">RERA Certificate</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The Real Estate (Regulation and Development) Act, 2016 is Act of the Parliament of India which seeks to 
                    protect home-buyers as well as boost investments in the real estate industry. The Act came into force on 1 May 2016.
                  </p>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Telangana RERA</p>
                      <p className="font-semibold">{pd.rera}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Certificate
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4">BENEFITS OF RERA</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Timely Dispute Resolution</h4>
                        <p className="text-sm text-muted-foreground">
                          Buyer can approach rera authorities within 60 days from date of problem identified
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Quality Assurance</h4>
                        <p className="text-sm text-muted-foreground">
                          Quality standards as set out by authorities must be followed by developers
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Transparency & Tracking</h4>
                        <p className="text-sm text-muted-foreground">
                          Allows buyers to track progress milestones and defects
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Buyer Protection</h4>
                        <p className="text-sm text-muted-foreground">
                          Buyers can get grievance redressed within project completion
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Footer />

        {/* Contact Form Modal */}
        <DeveloperContactForm 
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
          developerName={developer.name}
        />
      </div>
    );
  }

  // Default developer page layout for other developers
  return (
    <div className="min-h-screen bg-background">
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
                <img 
                  src={developer.logo} 
                  alt={`${developer.name} logo`} 
                  className="w-full h-full object-contain"
                />
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
                    {developer.description.split('. ').map((sentence, index) => (
                      sentence.trim() && (
                        <p key={index} className="leading-relaxed">
                          {sentence.trim()}{index < developer.description.split('. ').length - 1 ? '.' : ''}
                        </p>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Our Specializations</h3>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                    {developer.specializations.map((spec, index) => (
                      <div 
                        key={index} 
                        className="group flex items-center gap-3 p-4 bg-gradient-to-br from-secondary/50 to-background rounded-xl border-0 md:border md:border-border/50 md:hover:border-brand-red/30 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors">
                          <Star className="h-4 w-4 text-brand-red" />
                        </div>
                        <span className="font-medium text-sm md:text-base text-foreground">{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Projects */}
              <Card className="hover-lift border-0 md:border animate-fade-in">
                <CardContent className="p-5 sm:p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Key Projects</h3>
                  <div className="space-y-3 md:space-y-4">
                    {developer.keyProjects.map((project, index) => (
                      <div 
                        key={index} 
                        className="group flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-secondary/30 to-background rounded-xl hover:from-secondary/50 hover:to-background transition-all duration-300 hover:shadow-md border-0 md:border md:border-border/50 md:hover:border-brand-red/30"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300">
                          <ArrowRight className="h-4 w-4 text-brand-red group-hover:text-white transition-colors" />
                        </div>
                        <p className="font-medium text-sm md:text-base text-foreground leading-relaxed pt-1">{project}</p>
                      </div>
                    ))}
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
                    {developer.awards.map((award, index) => (
                      <div 
                        key={index} 
                        className="group flex items-start gap-3 p-4 bg-gradient-to-br from-brand-red/5 to-background border-0 md:border md:border-brand-red/20 md:hover:border-brand-red/40 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red/20 transition-colors mt-0.5">
                          <Award className="h-4 w-4 text-brand-red" />
                        </div>
                        <span className="font-medium text-sm md:text-base text-foreground leading-relaxed">{award}</span>
                      </div>
                    ))}
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
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-brand-red to-brand-maroon hover:from-brand-maroon hover:to-brand-maroon-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    onClick={() => setIsContactFormOpen(true)}
                  >
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
      <DeveloperContactForm 
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        developerName={developer.name}
      />
    </div>
  );
};

export default DeveloperPage;