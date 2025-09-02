/**
 * Section Extractor Service
 * Extracts real content and structure from existing website pages
 * to create reusable section templates for the CMS
 */

export interface ExtractedSection {
  id: string;
  name: string;
  type: string;
  description: string;
  category: string;
  sourcePage: string;
  content: any;
  previewImage?: string;
  schema: any;
}

export interface PageSectionData {
  [key: string]: any;
}

/**
 * Extract sections from the Homepage (Index.tsx)
 */
export const extractHomepageSections = (): ExtractedSection[] => {
  return [
    {
      id: 'homepage-hero-search',
      name: 'Hero Search Section',
      type: 'hero_search',
      description: 'Main hero banner with property search functionality from homepage',
      category: 'Hero',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/a83d7fd3-19d0-43ed-9c71-0158ae789ae2.png',
      content: {
        title: 'Find Your Perfect Property',
        subtitle: 'Discover thousands of properties across India with zero brokerage',
        searchPlaceholder: 'Search by city, locality, or landmark',
        backgroundImage: '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png',
        primaryCTA: 'Search Properties',
        secondaryCTA: 'Post Your Property Free'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        background_image: 'image',
        search_placeholder: 'string',
        primary_cta: 'string',
        secondary_cta: 'string'
      }
    },
    {
      id: 'homepage-directory',
      name: 'Property Directory',
      type: 'directory',
      description: 'Comprehensive property listings organized by location and type from homepage',
      category: 'Listings',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/afeb45dd-0383-4b96-91d5-c7fa678d488c.png',
      content: {
        title: 'Browse Properties by Location',
        showTabs: true,
        locations: [
          'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'
        ],
        propertyTypes: [
          'Apartments', 'Villas', 'Plots', 'Commercial', 'Agricultural'
        ]
      },
      schema: {
        title: 'string',
        show_tabs: 'boolean',
        locations: 'array',
        property_types: 'array'
      }
    },
    {
      id: 'homepage-real-estate-slider',
      name: 'Real Estate Builders Slider',
      type: 'real_estate_slider',
      description: 'Carousel showcasing trusted real estate builders from homepage',
      category: 'Showcase',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/eed6e505-e2ef-4267-b0b6-ebe159e3a167.png',
      content: {
        title: 'Trusted by Leading Builders',
        builders: [
          { name: 'Brigade Group', logo: '/lovable-uploads/brigade-group-logo.jpg' },
          { name: 'Prestige Group', logo: '/lovable-uploads/prestige-group-logo.jpg' },
          { name: 'Godrej Properties', logo: '/lovable-uploads/godrej-properties-logo.jpg' },
          { name: 'Ramky Group', logo: '/lovable-uploads/ramky-group-logo.jpg' },
          { name: 'Aparna Constructions', logo: '/lovable-uploads/aparna-constructions-logo.jpg' },
          { name: 'Aliens Group', logo: '/lovable-uploads/aliens-group-logo.jpg' }
        ],
        autoScroll: true
      },
      schema: {
        title: 'string',
        builders: 'array',
        auto_scroll: 'boolean'
      }
    },
    {
      id: 'homepage-home-services',
      name: 'Home Services',
      type: 'home_services',
      description: 'Various home and property-related services from homepage',
      category: 'Services',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/eed6e505-e2ef-4267-b0b6-ebe159e3a167.png',
      content: {
        title: 'Complete Home Solutions',
        services: [
          {
            title: 'Legal Services',
            description: 'Property documentation and legal assistance',
            icon: '/lovable-uploads/legal-services.jpg',
            link: '/legal-services'
          },
          {
            title: 'Property Management',
            description: 'Professional property management services',
            icon: '/lovable-uploads/property-management.jpg',
            link: '/property-management'
          },
          {
            title: 'Interior Design',
            description: 'Expert interior design solutions',
            icon: '/lovable-uploads/interior-design.jpg',
            link: '/interior'
          },
          {
            title: 'Architects',
            description: 'Professional architectural services',
            icon: '/lovable-uploads/architects.jpg',
            link: '/architects'
          },
          {
            title: 'Painting & Cleaning',
            description: 'Home painting and cleaning services',
            icon: '/lovable-uploads/painting-cleaning.jpg',
            link: '/painting-cleaning'
          },
          {
            title: 'Handover Services',
            description: 'Property handover and inspection services',
            icon: '/lovable-uploads/handover-services.jpg',
            link: '/handover-services'
          }
        ],
        showOffers: true
      },
      schema: {
        title: 'string',
        services: 'array',
        show_offers: 'boolean'
      }
    },
    {
      id: 'homepage-featured-properties',
      name: 'Featured Properties',
      type: 'featured_properties',
      description: 'Showcase of premium property listings from homepage',
      category: 'Properties',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/property-grid-preview.jpg',
      content: {
        title: 'Featured Properties',
        description: 'Discover our handpicked selection of premium properties across India\'s top cities',
        showFilters: true,
        maxProperties: 20
      },
      schema: {
        title: 'string',
        description: 'string',
        max_properties: 'number',
        show_filters: 'boolean'
      }
    },
    {
      id: 'homepage-services',
      name: 'Our Services',
      type: 'services',
      description: 'Comprehensive real estate services from homepage',
      category: 'Services',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/dddc344b-7d00-4537-98d1-558ec4fc90a7.png',
      content: {
        title: 'Our Services',
        subtitle: 'Complete real estate solutions for all your needs',
        services: [
          {
            title: 'Property Search',
            description: 'Find your perfect property with advanced search filters',
            icon: 'search'
          },
          {
            title: 'Verified Listings',
            description: 'All properties are verified with authentic documents',
            icon: 'shield'
          },
          {
            title: 'Legal Assistance',
            description: 'Expert legal guidance for property documentation',
            icon: 'file-text'
          },
          {
            title: 'Property Management',
            description: 'Professional property management services',
            icon: 'home'
          }
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        services: 'array'
      }
    },
    {
      id: 'homepage-why-use',
      name: 'Why Choose Us',
      type: 'why_use',
      description: 'Benefits and advantages from homepage',
      category: 'Benefits',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/benefits-preview.jpg',
      content: {
        title: 'Why Choose HomeHNI?',
        benefits: [
          {
            title: 'Zero Brokerage',
            description: 'No hidden charges or broker fees',
            icon: 'shield'
          },
          {
            title: 'Verified Properties',
            description: 'All listings are verified and authentic',
            icon: 'check-circle'
          },
          {
            title: '24/7 Support',
            description: 'Round-the-clock customer support',
            icon: 'headphones'
          },
          {
            title: 'Transparent Process',
            description: 'Clear and honest property transactions',
            icon: 'eye'
          }
        ],
        showIcons: true
      },
      schema: {
        title: 'string',
        benefits: 'array',
        show_icons: 'boolean'
      }
    },
    {
      id: 'homepage-stats',
      name: 'Statistics Counter',
      type: 'stats',
      description: 'Business metrics with animated counters from homepage',
      category: 'Statistics',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/77255b7d-3088-40d7-8bff-d64bf3d0b561.png',
      content: {
        stats: [
          { number: '10,000+', label: 'Properties Listed', icon: 'home' },
          { number: '50,000+', label: 'Happy Customers', icon: 'users' },
          { number: '25+', label: 'Cities Covered', icon: 'map-pin' },
          { number: '100+', label: 'Awards Won', icon: 'award' }
        ],
        backgroundColor: 'red'
      },
      schema: {
        stats: 'array',
        background_color: 'string'
      }
    },
    {
      id: 'homepage-testimonials',
      name: 'Customer Testimonials',
      type: 'testimonials',
      description: 'Customer reviews and success stories from homepage',
      category: 'Social Proof',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/testimonials-preview.jpg',
      content: {
        title: 'What Our Customers Say',
        description: 'Real experiences from satisfied customers',
        showRatings: true,
        testimonials: [
          {
            name: 'Rajesh Kumar',
            location: 'Mumbai',
            rating: 5,
            review: 'Found my dream home without any broker hassle. Excellent service!',
            avatar: '/lovable-uploads/02059b14-d0f2-4231-af62-ec450cb13e82.png'
          },
          {
            name: 'Priya Sharma',
            location: 'Delhi',
            rating: 5,
            review: 'Professional team and transparent process. Highly recommended!',
            avatar: '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png'
          },
          {
            name: 'Amit Patel',
            location: 'Bangalore',
            rating: 5,
            review: 'Great platform for property search. Saved me time and money.',
            avatar: '/lovable-uploads/03a7a41f-3920-4412-aec8-9d2ab24226ae.png'
          }
        ]
      },
      schema: {
        title: 'string',
        description: 'string',
        testimonials: 'array',
        show_ratings: 'boolean'
      }
    },
    {
      id: 'homepage-mobile-app',
      name: 'Mobile App Promotion',
      type: 'mobile_app',
      description: 'Mobile app download section from homepage',
      category: 'Promotion',
      sourcePage: 'Homepage',
      previewImage: '/lovable-uploads/c0b01943-436f-4e6d-a35f-752876e4e8a4.png',
      content: {
        title: 'Download Our Mobile App',
        description: 'Search properties on the go with our mobile app',
        appStoreLink: 'https://apps.apple.com/app/homehni',
        playStoreLink: 'https://play.google.com/store/apps/details?id=com.homehni'
      },
      schema: {
        title: 'string',
        description: 'string',
        app_store_link: 'string',
        play_store_link: 'string'
      }
    }
  ];
};

/**
 * Extract sections from the About Us page
 */
export const extractAboutPageSections = (): ExtractedSection[] => {
  return [
    {
      id: 'about-hero',
      name: 'About Hero Section',
      type: 'hero',
      description: 'Hero banner with company introduction from About page',
      category: 'Hero',
      sourcePage: 'About Us',
      previewImage: '/lovable-uploads/43d4891e-82e4-406d-9a77-308cbaa66a93.png',
      content: {
        title: 'About HomeHNI',
        subtitle: 'Empowering you with seamless, transparent, and direct access to premium property listings',
        backgroundImage: '/lovable-uploads/43d4891e-82e4-406d-9a77-308cbaa66a93.png',
        description: 'At HomeHNI, we believe in empowering you with seamless, transparent, and direct access to premium property listings—without the middlemen. Guided by the principle of "making real estate simple for everyone", our mission is to transform the way you buy, sell, or rent by removing unnecessary barriers and fostering trust.'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        background_image: 'image',
        description: 'text'
      }
    },
    {
      id: 'about-story',
      name: 'Our Story',
      type: 'content_block',
      description: 'Company story and background from About page',
      category: 'Content',
      sourcePage: 'About Us',
      content: {
        title: '🌟 Our Story',
        content: 'Founded by real-estate enthusiasts who were frustrated with hidden fees and confusing broker hierarchies, we set out to build a platform that puts you in control. Following in the footsteps of trailblazers like 99acres—whose portal serves millions across India—and embracing NoBroker\'s model of fairness and direct connection, we combine technology and user-centric design to simplify property searches.'
      },
      schema: {
        title: 'string',
        content: 'text'
      }
    },
    {
      id: 'about-differences',
      name: 'What Makes Us Different',
      type: 'features_grid',
      description: 'Key differentiators and features from About page',
      category: 'Features',
      sourcePage: 'About Us',
      content: {
        title: '🛠 What Makes Us Different',
        features: [
          {
            title: 'Zero Brokerage, Zero Hassle',
            description: 'Enjoy a broker-free marketplace where property owners and seekers connect directly—no hidden charges, no negotiation drama.',
            icon: 'shield',
            color: 'red'
          },
          {
            title: 'Verified Listings Only',
            description: 'Every listing is hand-reviewed to ensure accuracy, authenticity, and clarity—so you can trust what you see.',
            icon: 'check-circle',
            color: 'blue'
          },
          {
            title: 'Smart Tools & Transparency',
            description: 'With intuitive filters, clear pricing, and rich media previews, you can find your ideal space from the comfort of your home.',
            icon: 'search',
            color: 'green'
          },
          {
            title: 'Customer-First Service',
            description: 'Our friendly support team is here to help—offering assistance without upselling or pushy sales tactics.',
            icon: 'headphones',
            color: 'purple'
          }
        ]
      },
      schema: {
        title: 'string',
        features: 'array'
      }
    },
    {
      id: 'about-vision',
      name: 'Our Vision',
      type: 'content_block',
      description: 'Company vision and mission from About page',
      category: 'Content',
      sourcePage: 'About Us',
      content: {
        title: '🎯 Our Vision',
        content: 'To become India\'s most reliable and user-first real estate destination—where every interaction is transparent, every property is accurate, and every user feels in control.'
      },
      schema: {
        title: 'string',
        content: 'text'
      }
    },
    {
      id: 'about-community',
      name: 'Join Our Community',
      type: 'content_block',
      description: 'Community invitation from About page',
      category: 'Content',
      sourcePage: 'About Us',
      content: {
        title: '🤝 Join Our Community',
        content: 'Whether you\'re selling your home, hunting for a dream space, or exploring rentals, HomeHNI is built around you—no brokers, no gimmicks, just a human-centered experience.'
      },
      schema: {
        title: 'string',
        content: 'text'
      }
    },
    {
      id: 'about-why-homehni',
      name: 'Why HomeHNI',
      type: 'benefits_list',
      description: 'Benefits and advantages from About page',
      category: 'Benefits',
      sourcePage: 'About Us',
      content: {
        title: 'Why HomeHNI?',
        benefits: [
          'Modeled on the success of 99acres.com, a trusted name since 2005',
          'Inspired by NoBroker\'s mission to eliminate unnecessary middlemen',
          'Committed to delivering honest, accurate listings and empathetic support'
        ]
      },
      schema: {
        title: 'string',
        benefits: 'array'
      }
    }
  ];
};

/**
 * Extract sections from the Legal Services page
 */
export const extractLegalServicesSections = (): ExtractedSection[] => {
  return [
    {
      id: 'legal-hero',
      name: 'Legal Services Hero',
      type: 'hero',
      description: 'Hero section for legal services page',
      category: 'Hero',
      sourcePage: 'Legal Services',
      previewImage: '/lovable-uploads/d1d3a477-5764-47c6-b08f-b0cad801e543.png',
      content: {
        title: 'Get Hassle-Free Property Legal Services Across India',
        subtitle: 'From online rental agreements to tenant verification — all at your doorstep.',
        backgroundImage: '/lovable-uploads/d1d3a477-5764-47c6-b08f-b0cad801e543.png',
        primaryCTA: 'Book a Legal Service',
        secondaryCTA: 'Learn More'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        background_image: 'image',
        primary_cta: 'string',
        secondary_cta: 'string'
      }
    },
    {
      id: 'legal-services-grid',
      name: 'Legal Services Grid',
      type: 'services_grid',
      description: 'Grid of legal services offered',
      category: 'Services',
      sourcePage: 'Legal Services',
      content: {
        title: 'Our Legal Services',
        subtitle: 'Comprehensive legal support for all your property needs',
        services: [
          {
            title: 'Rental Agreement',
            description: 'Legally valid rental agreements delivered at your doorstep.',
            icon: 'file-text'
          },
          {
            title: 'Tenant Verification',
            description: 'Protect your property with police-verified tenant checks.',
            icon: 'shield'
          },
          {
            title: 'Property Legal Assistance',
            description: 'Consult with certified legal experts before buying/selling property.',
            icon: 'scale'
          }
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        services: 'array'
      }
    },
    {
      id: 'legal-benefits',
      name: 'Why Choose Legal Services',
      type: 'benefits_list',
      description: 'Benefits of using legal services',
      category: 'Benefits',
      sourcePage: 'Legal Services',
      content: {
        title: 'Why Choose HomeHNI Legal Services?',
        subtitle: 'Experience the difference with our professional legal support',
        benefits: [
          'No Government Office Visits',
          'Personalised Legal Support',
          'Online Payment & Instant Booking',
          'Legally Valid Documentation',
          'Lowest Prices Guaranteed',
          '100% Convenience, 0% Stress'
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        benefits: 'array'
      }
    },
    {
      id: 'legal-coming-soon',
      name: 'Coming Soon Services',
      type: 'services_grid',
      description: 'Upcoming legal services',
      category: 'Services',
      sourcePage: 'Legal Services',
      content: {
        title: 'Coming Soon Services',
        subtitle: 'Expanding our legal services to serve you better',
        services: [
          {
            title: 'Police Intimation',
            description: 'Hassle-free police intimation for rental properties',
            icon: 'shield',
            status: 'coming-soon'
          },
          {
            title: 'Property Tax Filing',
            description: 'Expert assistance with property tax documentation',
            icon: 'file-text',
            status: 'coming-soon'
          },
          {
            title: 'Leave & License Agreement',
            description: 'Professional drafting of leave and license agreements',
            icon: 'scale',
            status: 'coming-soon'
          },
          {
            title: 'Legal Document Review',
            description: 'Expert review of property-related legal documents',
            icon: 'check-circle',
            status: 'coming-soon'
          }
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        services: 'array'
      }
    },
    {
      id: 'legal-testimonials',
      name: 'Legal Services Testimonials',
      type: 'testimonials',
      description: 'Customer reviews for legal services',
      category: 'Social Proof',
      sourcePage: 'Legal Services',
      content: {
        title: 'What Our Customers Say',
        subtitle: 'Real experiences from satisfied customers',
        testimonials: [
          {
            name: 'Rohit M.',
            location: 'Mumbai',
            rating: 5,
            review: 'Quick & efficient service for my rental agreement! Highly recommended.',
            avatar: '/lovable-uploads/02059b14-d0f2-4231-af62-ec450cb13e82.png'
          },
          {
            name: 'Neha S.',
            location: 'Delhi',
            rating: 5,
            review: 'Professional team. Got tenant verification done in 2 days.',
            avatar: '/lovable-uploads/02fc42a2-c12f-49f1-92b7-9fdee8f3a419.png'
          },
          {
            name: 'Vikas K.',
            location: 'Bangalore',
            rating: 5,
            review: 'Legal consultation helped me close my deal confidently.',
            avatar: '/lovable-uploads/03a7a41f-3920-4412-aec8-9d2ab24226ae.png'
          }
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        testimonials: 'array'
      }
    },
    {
      id: 'legal-features',
      name: 'Legal Service Features',
      type: 'features_list',
      description: 'Key features of legal services',
      category: 'Features',
      sourcePage: 'Legal Services',
      content: {
        title: 'Professional Legal Support',
        subtitle: 'Our team of experienced legal professionals ensures that all your property-related legal requirements are handled with utmost care and precision.',
        features: [
          {
            title: 'Quick Turnaround',
            description: 'Most services completed within 24-48 hours',
            icon: 'clock'
          },
          {
            title: 'Expert Consultation',
            description: 'Access to certified legal experts and advisors',
            icon: 'user'
          },
          {
            title: 'Transparent Pricing',
            description: 'No hidden costs, pay only for what you need',
            icon: 'credit-card'
          }
        ]
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        features: 'array'
      }
    },
    {
      id: 'legal-cta',
      name: 'Legal Services CTA',
      type: 'cta_banner',
      description: 'Call-to-action banner for legal services',
      category: 'CTA',
      sourcePage: 'Legal Services',
      content: {
        title: 'Need help with your legal property documents?',
        subtitle: 'Get expert legal assistance for all your property needs - anywhere in India',
        primaryCTA: 'Get Started Now',
        backgroundColor: 'red'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        primary_cta: 'string',
        background_color: 'string'
      }
    }
  ];
};

/**
 * Extract sections from the Contact Us page
 */
export const extractContactUsSections = (): ExtractedSection[] => {
  return [
    {
      id: 'contact-hero',
      name: 'Contact Hero Section',
      type: 'hero',
      description: 'Hero banner for contact page',
      category: 'Hero',
      sourcePage: 'Contact Us',
      previewImage: '/lovable-uploads/e92e33f3-73f5-4ce1-9011-5fb09b061ed9.png',
      content: {
        title: 'Get In Touch',
        subtitle: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        backgroundImage: '/lovable-uploads/e92e33f3-73f5-4ce1-9011-5fb09b061ed9.png'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        background_image: 'image'
      }
    },
    {
      id: 'contact-info',
      name: 'Contact Information',
      type: 'contact_info',
      description: 'Contact details and information',
      category: 'Contact',
      sourcePage: 'Contact Us',
      content: {
        title: 'Contact Information',
        contactDetails: [
          {
            type: 'email',
            label: 'Email',
            value: 'homehni8@gmail.com',
            icon: 'mail'
          },
          {
            type: 'phone',
            label: 'Phone',
            value: '+91 8074 017 388',
            icon: 'phone'
          },
          {
            type: 'address',
            label: 'Address',
            value: 'Plot No : 52 E/P\nCBI Colony Sahebnagar Kalan',
            icon: 'map-pin'
          }
        ]
      },
      schema: {
        title: 'string',
        contact_details: 'array'
      }
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      type: 'contact_form',
      description: 'Contact form for inquiries',
      category: 'Contact',
      sourcePage: 'Contact Us',
      content: {
        title: 'Send us a Message',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
          { name: 'message', label: 'Message', type: 'textarea', required: true }
        ],
        submitText: 'Send Message'
      },
      schema: {
        title: 'string',
        fields: 'array',
        submit_text: 'string'
      }
    },
    {
      id: 'contact-map',
      name: 'Contact Map',
      type: 'map',
      description: 'Location map for contact page',
      category: 'Contact',
      sourcePage: 'Contact Us',
      content: {
        title: 'Find Us',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.1111111111113!2d77.1111111111111!3d28.6111111111111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQwLjAiTiA3N8KwMDYnNDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123',
        height: '256px'
      },
      schema: {
        title: 'string',
        map_embed: 'string',
        height: 'string'
      }
    }
  ];
};

/**
 * Extract sections from the Property Management page
 */
export const extractPropertyManagementSections = (): ExtractedSection[] => {
  return [
    {
      id: 'property-mgmt-hero',
      name: 'Property Management Hero',
      type: 'hero',
      description: 'Hero section for property management services',
      category: 'Hero',
      sourcePage: 'Property Management',
      previewImage: '/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png',
      content: {
        title: 'Professional Property Management Services You Can Trust',
        subtitle: 'Maximize your rental income with our comprehensive property management solutions. From tenant screening to maintenance, we handle it all.',
        backgroundImage: '/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png',
        primaryCTA: 'Get Started Today'
      },
      schema: {
        title: 'string',
        subtitle: 'string',
        background_image: 'image',
        primary_cta: 'string'
      }
    },
    {
      id: 'property-mgmt-services',
      name: 'Property Management Services',
      type: 'services_grid',
      description: 'Comprehensive property management services',
      category: 'Services',
      sourcePage: 'Property Management',
      content: {
        title: 'Our Property Management Services',
        services: [
          {
            title: 'Tenant Management',
            description: 'Complete tenant screening, onboarding, and relationship management.',
            icon: 'users'
          },
          {
            title: 'Rent Collection',
            description: 'Automated rent collection with timely follow-ups and receipts.',
            icon: 'credit-card'
          },
          {
            title: 'Property Maintenance',
            description: '24/7 maintenance coordination and vendor management.',
            icon: 'wrench'
          },
          {
            title: 'Legal Compliance',
            description: 'Complete legal documentation and regulatory compliance.',
            icon: 'shield'
          },
          {
            title: 'Marketing & Leasing',
            description: 'Professional marketing to find quality tenants quickly.',
            icon: 'trending-up'
          },
          {
            title: 'Financial Reporting',
            description: 'Detailed monthly reports and transparent accounting.',
            icon: 'bar-chart-3'
          }
        ]
      },
      schema: {
        title: 'string',
        services: 'array'
      }
    },
    {
      id: 'property-mgmt-benefits',
      name: 'Property Management Benefits',
      type: 'features_grid',
      description: 'Benefits of property management services',
      category: 'Features',
      sourcePage: 'Property Management',
      content: {
        title: 'Why choose our property management services?',
        features: [
          {
            title: '24/7 Support',
            description: 'Round-the-clock support for tenants and property owners',
            icon: 'headphones'
          },
          {
            title: 'Professional Tenant Screening',
            description: 'Comprehensive background checks and verification process',
            icon: 'user-check'
          },
          {
            title: 'Transparent Reporting',
            description: 'Monthly financial reports with detailed income and expense tracking',
            icon: 'bar-chart-3'
          },
          {
            title: 'Legal Protection',
            description: 'Complete legal documentation and compliance support',
            icon: 'shield'
          },
          {
            title: 'Market-Rate Optimization',
            description: 'Regular market analysis to optimize rental rates and maximize income',
            icon: 'trending-up'
          },
          {
            title: 'Hassle-Free Management',
            description: 'Complete property management with minimal owner involvement',
            icon: 'settings'
          }
        ]
      },
      schema: {
        title: 'string',
        features: 'array'
      }
    },
    {
      id: 'property-mgmt-stats',
      name: 'Property Management Stats',
      type: 'stats',
      description: 'Statistics and achievements',
      category: 'Statistics',
      sourcePage: 'Property Management',
      content: {
        title: 'Trusted by Thousands',
        stats: [
          { number: '5000+', label: 'Properties Managed' },
          { number: '₹50Cr+', label: 'Monthly Rent Collected' },
          { number: '98%', label: 'Client Satisfaction' },
          { number: '10+', label: 'Years Experience' }
        ]
      },
      schema: {
        title: 'string',
        stats: 'array'
      }
    },
    {
      id: 'property-mgmt-comparison',
      name: 'Property Management Comparison',
      type: 'comparison_table',
      description: 'Comparison with competitors',
      category: 'Comparison',
      sourcePage: 'Property Management',
      content: {
        title: 'Why Home HNI is Better',
        features: [
          { feature: '24/7 Tenant Support', homeHNI: true, others: false },
          { feature: 'Professional Tenant Screening', homeHNI: true, others: false },
          { feature: 'Guaranteed Rent Collection', homeHNI: true, others: false },
          { feature: 'Emergency Maintenance', homeHNI: true, others: false },
          { feature: 'Legal Documentation', homeHNI: true, others: false },
          { feature: 'Transparent Reporting', homeHNI: true, others: false },
          { feature: 'Market-Rate Optimization', homeHNI: true, others: false },
          { feature: 'Dedicated Property Manager', homeHNI: true, others: false }
        ]
      },
      schema: {
        title: 'string',
        features: 'array'
      }
    },
    {
      id: 'property-mgmt-testimonials',
      name: 'Property Management Testimonials',
      type: 'testimonials',
      description: 'Customer testimonials for property management',
      category: 'Social Proof',
      sourcePage: 'Property Management',
      content: {
        title: 'What Our Clients Say',
        testimonials: [
          {
            name: 'Rajesh Sharma',
            role: 'Property Owner',
            rating: 5,
            review: 'My rental income increased by 20% and I don\'t have to deal with tenant issues anymore!',
            avatar: '/lovable-uploads/46a07bb4-9f10-4614-ad52-73dfb2de4f28.png'
          },
          {
            name: 'Priya Nair',
            role: 'NRI Investor',
            rating: 5,
            review: 'Perfect solution for managing my properties from abroad. Completely hassle-free!',
            avatar: '/lovable-uploads/5b898e4e-d9b6-4366-b58f-176fc3c8a9c3.png'
          },
          {
            name: 'Amit Gupta',
            role: 'Real Estate Investor',
            rating: 5,
            review: 'Professional service with excellent tenant quality. My properties are always occupied.',
            avatar: '/lovable-uploads/6e6c47cd-700c-49d4-bfee-85a69bb8353f.png'
          }
        ]
      },
      schema: {
        title: 'string',
        testimonials: 'array'
      }
    },
    {
      id: 'property-mgmt-target-audience',
      name: 'Target Audience',
      type: 'audience_grid',
      description: 'Who we serve',
      category: 'Audience',
      sourcePage: 'Property Management',
      content: {
        title: 'Who We Serve',
        audiences: [
          {
            title: 'Property Owners',
            description: 'Multiple property owners seeking professional management',
            icon: 'home'
          },
          {
            title: 'Real Estate Investors',
            description: 'Investors looking to maximize returns with minimal hassle',
            icon: 'trending-up'
          },
          {
            title: 'NRI Property Owners',
            description: 'Non-resident Indians needing remote property management',
            icon: 'globe'
          }
        ]
      },
      schema: {
        title: 'string',
        audiences: 'array'
      }
    },
    {
      id: 'property-mgmt-faq',
      name: 'Property Management FAQ',
      type: 'faq',
      description: 'Frequently asked questions',
      category: 'FAQ',
      sourcePage: 'Property Management',
      content: {
        title: 'Frequently Asked Questions',
        faqs: [
          {
            question: 'What properties do you manage?',
            answer: 'We manage residential and commercial properties including apartments, villas, offices, retail spaces, and warehouses across major Indian cities.'
          },
          {
            question: 'What are your management fees?',
            answer: 'Our management fees range from 8-12% of monthly rent depending on property type and services required. We offer transparent pricing with no hidden charges.'
          },
          {
            question: 'How do you screen tenants?',
            answer: 'We conduct comprehensive background checks including credit history, employment verification, reference checks, and police verification to ensure quality tenants.'
          },
          {
            question: 'How do you handle maintenance issues?',
            answer: 'We have a network of verified vendors and provide 24/7 emergency support. All maintenance is coordinated promptly with owner approval for major repairs.'
          },
          {
            question: 'How often do you provide reports?',
            answer: 'Monthly financial reports are provided with rent collection status, expenses, maintenance updates, and property performance metrics.'
          }
        ]
      },
      schema: {
        title: 'string',
        faqs: 'array'
      }
    }
  ];
};

/**
 * Get all extracted sections from all pages
 */
export const getAllExtractedSections = (): ExtractedSection[] => {
  return [
    ...extractHomepageSections(),
    ...extractAboutPageSections(),
    ...extractLegalServicesSections(),
    ...extractContactUsSections(),
    ...extractPropertyManagementSections()
  ];
};

/**
 * Get sections by source page
 */
export const getSectionsBySourcePage = (sourcePage: string): ExtractedSection[] => {
  const allSections = getAllExtractedSections();
  return allSections.filter(section => section.sourcePage === sourcePage);
};

/**
 * Get sections by category
 */
export const getSectionsByCategory = (category: string): ExtractedSection[] => {
  const allSections = getAllExtractedSections();
  return allSections.filter(section => section.category === category);
};

/**
 * Get section by ID
 */
export const getSectionById = (id: string): ExtractedSection | undefined => {
  const allSections = getAllExtractedSections();
  return allSections.find(section => section.id === id);
};
