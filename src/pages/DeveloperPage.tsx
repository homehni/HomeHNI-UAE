import React, { useState } from 'react';
import { Building2, MapPin, Calendar, Users, Award, Leaf, Star, Phone, Mail, Globe, ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { DeveloperContactForm } from "@/components/DeveloperContactForm";
import prestigeGroupLogo from '@/assets/prestige-group-logo.jpg';
import godrejPropertiesLogo from '@/assets/godrej-properties-logo.jpg';
import ramkyGroupLogo from '@/assets/ramky-group-logo.jpg';
import brigadeGroupLogo from '@/assets/brigade-group-logo.jpg';
import aparnaConstructionsLogo from '@/assets/aparna-constructions-logo.jpg';
import aliensGroupLogo from '@/assets/aliens-group-logo.jpg';
import cannyForestEdgeLogo from '@/assets/canny-forest-edge-logo.jpg';
import alpineInfratechLogo from '@/assets/alpine-infratech-logo.png';

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
      name: "Canny's Forest Edge",
      logo: cannyForestEdgeLogo,
      rank: 7,
      founded: '2010',
      headquarters: 'Bachupally, Hyderabad',
      highlights: '2BHK & 3BHK Luxurious Residences - Ready to move in, 66% open area with 200 acres forest view',
      description: "Canny's Forest Edge is a premium residential project spread across 1.52 acres with 197 flats in Bachupally, Hyderabad. The project offers 2BHK apartments of 1285 Sft and 3BHK apartments ranging from 1505 Sft to 2200 Sft with ready to move-in possession. TS RERA Approved (P02200003658). Experience luxurious living with 66% open area and breathtaking 200 acres of forest view, featuring wide cantilever balconies and impeccably landscaped surroundings.",
      specializations: [
        '2BHK - 1285 Sft Apartments',
        '3BHK - 1505 Sft to 2200 Sft Apartments',
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
        phone: '+91 80 4567 8900',
        email: 'info@cannylifespaces.com',
        website: 'www.cannylifespaces.com'
      }
    },
    'alpine-infratech': {
      name: 'Alpine Infratech',
      logo: alpineInfratechLogo,
      rank: 8,
      founded: '2008',
      headquarters: 'Hyderabad, India',
      highlights: 'Innovative infrastructure solutions, modern construction excellence',
      description: 'Alpine Infratech is a leading infrastructure and construction company known for delivering cutting-edge projects with precision and quality. They specialize in modern construction techniques and innovative infrastructure solutions that set new standards in the industry.',
      specializations: [
        'Infrastructure Development',
        'Modern Construction Techniques',
        'Smart Building Technology',
        'Quality Engineering',
        'Project Management Excellence'
      ],
      keyProjects: [
        'Alpine Heights - High-rise residential',
        'Tech Park Infrastructure - IT corridor',
        'Alpine Square - Commercial complex',
        'Infrastructure Solutions Portfolio'
      ],
      awards: [
        'Excellence in Infrastructure',
        'Engineering Innovation Award',
        'Quality Construction Recognition',
        'Best Emerging Developer'
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
      <section className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-light">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <Card className="card-border-accent hover-lift border-2 backdrop-blur-sm animate-fade-in">
                <CardContent className="p-6 md:p-8">
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
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {developer.description}
                  </p>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="card-border-accent hover-lift border-2 animate-fade-in">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Our Specializations</h3>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                    {developer.specializations.map((spec, index) => (
                      <div 
                        key={index} 
                        className="group flex items-center gap-3 p-4 bg-gradient-to-br from-secondary/50 to-background rounded-xl border border-border/50 hover:border-brand-red/30 transition-all duration-300 hover:shadow-md"
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
              <Card className="card-border-accent hover-lift border-2 animate-fade-in">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Key Projects</h3>
                  <div className="space-y-3 md:space-y-4">
                    {developer.keyProjects.map((project, index) => (
                      <div 
                        key={index} 
                        className="group flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-secondary/30 to-background rounded-xl hover:from-secondary/50 hover:to-background transition-all duration-300 hover:shadow-md border border-border/50 hover:border-brand-red/30"
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
              <Card className="card-border-accent hover-lift border-2 animate-fade-in">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-maroon flex items-center justify-center shadow-lg">
                      <Award className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      Awards & Recognition
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                    {developer.awards.map((award, index) => (
                      <div 
                        key={index} 
                        className="group flex items-start gap-3 p-4 bg-gradient-to-br from-brand-red/5 to-background border border-brand-red/20 rounded-xl hover:border-brand-red/40 hover:shadow-md transition-all duration-300"
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
            <div className="space-y-6 md:space-y-8 lg:sticky lg:top-24">
              
              {/* Company Details */}
              <Card className="card-border-accent hover-lift border-2 animate-fade-in">
                <CardContent className="p-6">
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
              <Card className="card-border-accent hover-lift border-2 animate-fade-in">
                <CardContent className="p-6">
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
              <Card className="card-border-red shadow-2xl bg-gradient-to-br from-brand-red/5 via-brand-red/10 to-brand-maroon/10 backdrop-blur-sm overflow-hidden relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent"></div>
                <CardContent className="p-6 md:p-8 text-center relative z-10">
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