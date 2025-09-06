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
  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm">
    <CardContent className="p-4 h-[120px]">
      <div className="flex gap-4 h-full">
        <div className="relative w-20 h-16 flex-shrink-0">
          <img 
            src={match.image || '/placeholder.svg'} 
            alt={match.title}
            className="w-full h-full object-cover rounded-lg border border-border/20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {match.intent && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-primary text-primary-foreground"
            >
              {match.intent}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm leading-tight truncate text-foreground">
              {match.title}
            </h4>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{match.location}</span>
            </div>
            
            <div className="text-sm font-bold text-primary truncate">
              {match.price ? formatPrice(match.price, match.intent.toLowerCase()) : 'Contact for Price'}
              {match.intent === 'Lease' && match.price && '/month'}
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-2">
            <div className="flex gap-1 flex-shrink-0">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-primary/20 hover:border-primary hover:bg-primary/5">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-primary/10">
                <MessageCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
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

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { payload } = requirement;
      
      if (payload.intent === 'Service') {
        // For service requirements, find matching service providers
        // This is a mock implementation - you can enhance with real service providers
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
          .limit(5);

        if (propertyError) throw propertyError;

        const propertyMatches: RequirementMatch[] = (properties || []).map(property => ({
          id: property.id,
          title: property.title,
          location: property.locality || '',
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

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building className="w-4 h-4" />
            Real-time Matches ({matches.length})
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMatches}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Properties and services matching your requirements
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-xs text-destructive mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchMatches}>
              Try Again
            </Button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-4">
            <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">No matches found yet</p>
            <p className="text-xs text-muted-foreground">We'll notify you when we find matches</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            
            {matches.length >= 5 && (
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                View All Matches ({matches.length + 10}+)
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};