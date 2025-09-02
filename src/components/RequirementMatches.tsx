import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  MessageCircle, 
  MapPin, 
  Building, 
  Star,
  Phone,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RequirementMatch {
  id: string;
  title: string;
  location: string;
  price?: number;
  type: string;
  image?: string;
  contact?: {
    phone?: string;
    whatsapp?: boolean;
  };
  rating?: number;
  badges?: string[];
  intent: 'Buy' | 'Sell' | 'Lease' | 'Service';
}

interface RequirementMatchesProps {
  requirement: {
    id: string;
    title: string;
    payload: any;
  };
}

const formatPrice = (price: number | null, intent?: string) => {
  if (price === null) return 'On Request';
  
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};

const MatchCard: React.FC<{ match: RequirementMatch }> = ({ match }) => (
  <Card className="hover:shadow-md transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <div className="relative w-20 h-16 flex-shrink-0">
          <img 
            src={match.image || '/placeholder.svg'} 
            alt={match.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {match.intent && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 font-medium"
            >
              {match.intent}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight mb-2 truncate text-foreground">
            {match.title}
          </h4>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{match.location}</span>
            </div>
            
            {match.rating && (
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{match.rating}</span>
                <span className="text-muted-foreground">rating</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-primary">
              {match.price ? formatPrice(match.price, match.intent.toLowerCase()) : 'Contact for Price'}
              {match.intent === 'Lease' && match.price && '/month'}
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <MessageCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {match.badges && match.badges.length > 0 && (
            <div className="flex gap-1 mt-2">
              {match.badges.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((index) => (
      <Card key={index}>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <Skeleton className="w-16 h-12 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-1/4" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const RequirementMatches: React.FC<RequirementMatchesProps> = ({ 
  requirement 
}) => {
  const [matches, setMatches] = useState<RequirementMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { payload } = requirement;
      
      if (payload.intent === 'Service') {
        // For service requirements, find matching service providers
        const mockServices: RequirementMatch[] = [
          {
            id: '1',
            title: 'Premium Property Services',
            location: `${payload.city}, ${payload.state}`,
            type: payload.serviceType || 'Service',
            intent: 'Service',
            rating: 4.5,
            badges: ['Verified', 'Premium'],
            contact: { phone: '+91 98765 43210', whatsapp: true },
            image: '/placeholder.svg'
          },
          {
            id: '2',  
            title: 'Expert Property Consultants',
            location: `${payload.city}, ${payload.state}`,
            type: payload.serviceType || 'Service',
            intent: 'Service',
            rating: 4.2,
            badges: ['Trusted'],
            contact: { phone: '+91 98765 43211', whatsapp: true },
            image: '/placeholder.svg'
          },
          {
            id: '3',
            title: 'Reliable Home Solutions',
            location: `${payload.city}, ${payload.state}`,
            type: payload.serviceType || 'Service',
            intent: 'Service',
            rating: 4.7,
            badges: ['Top Rated'],
            contact: { phone: '+91 98765 43212', whatsapp: true },
            image: '/placeholder.svg'
          }
        ];
        
        setMatches(mockServices);
      } else {
        // For property requirements (Buy/Sell/Lease), find matching properties
        const { data: properties, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'approved')
          .ilike('city', `%${payload.city}%`)
          .limit(8);

        if (propertyError) throw propertyError;

        const propertyMatches: RequirementMatch[] = (properties || []).map(property => ({
          id: property.id,
          title: property.title,
          location: `${property.locality}, ${property.city}`,
          price: property.expected_price,
          type: property.property_type,
          intent: property.listing_type === 'sale' ? 'Sell' : 
                  property.listing_type === 'rent' ? 'Lease' : 'Buy',
          badges: [
            property.bhk_type && `${property.bhk_type}`,
            property.furnishing && property.furnishing,
            property.is_featured && 'Featured'
          ].filter(Boolean),
          image: property.images?.[0] || '/placeholder.svg'
        }));

        setMatches(propertyMatches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [requirement]);

  const displayedMatches = isExpanded ? matches : matches.slice(0, 3);

  return (
    <Card className="border-l-4 border-l-primary/30 shadow-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Real-time Matches
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMatches}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-sm text-destructive mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchMatches}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No matches found yet</p>
            <p className="text-xs text-muted-foreground">We'll notify you when we find relevant matches</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3">
              {displayedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
            
            {matches.length > 3 && (
              <div className="pt-4 border-t border-border mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full text-primary hover:bg-primary/5"
                >
                  {isExpanded ? 'Show Less' : `View All ${matches.length} Matches`}
                  <Eye className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};