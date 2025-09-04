import { Building2, MapPin, Calendar, Users, Award, Leaf, Star, Phone, Mail, Globe } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import prestigeGroupLogo from '@/assets/prestige-group-logo.jpg';
import godrejPropertiesLogo from '@/assets/godrej-properties-logo.jpg';
import ramkyGroupLogo from '@/assets/ramky-group-logo.jpg';
import brigadeGroupLogo from '@/assets/brigade-group-logo.jpg';
import aparnaConstructionsLogo from '@/assets/aparna-constructions-logo.jpg';
import aliensGroupLogo from '@/assets/aliens-group-logo.jpg';

const DeveloperPage = () => {
  const { developerId } = useParams();

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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-6 shadow-2xl">
                <img 
                  src={developer.logo} 
                  alt={`${developer.name} logo`} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{developer.name}</h1>
              <p className="text-xl text-white/90 max-w-3xl">
                {developer.highlights}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 flex items-center">
                    <Building2 className="h-8 w-8 mr-3 text-red-600" />
                    About {developer.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {developer.description}
                  </p>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Our Specializations</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {developer.specializations.map((spec, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                        <Star className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="font-medium">{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Projects */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Key Projects</h3>
                  <div className="space-y-4">
                    {developer.keyProjects.map((project, index) => (
                      <div key={index} className="p-4 border-l-4 border-red-600 bg-muted/30 rounded-r-lg">
                        <p className="font-medium text-foreground">{project}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Awards */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Award className="h-6 w-6 mr-3 text-red-600" />
                    Awards & Recognition
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {developer.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                        <Award className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="font-medium">{award}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Company Details */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Company Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold">Founded</div>
                        <div className="text-muted-foreground">{developer.founded}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold">Headquarters</div>
                        <div className="text-muted-foreground">{developer.headquarters}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 border-border shadow-lg shadow-red-200/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold">Phone</div>
                        <div className="text-muted-foreground">{developer.contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-muted-foreground text-sm">{developer.contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-semibold">Website</div>
                        <div className="text-muted-foreground text-sm">{developer.contact.website}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="border-2 border-red-600 shadow-lg shadow-red-200/50 bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4 text-red-800">Interested in Their Projects?</h3>
                  <p className="text-red-700 mb-6 text-sm">
                    Get in touch with {developer.name} for investment opportunities and project details.
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Contact Developer
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DeveloperPage;