import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MessageCircle, ExternalLink, Star, MapPin } from 'lucide-react';
import { PropertyListing, ServiceProvider, SearchResults } from '@/hooks/usePropertySearch';

interface SearchResultsPanelProps {
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
  searchType: 'property' | 'service';
  onLoadMore: () => void;
  onClearFilters: () => void;
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

const PropertyCard: React.FC<{ property: PropertyListing }> = ({ property }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex gap-3">
        <div className="relative w-20 h-16 flex-shrink-0">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 text-xs px-1 py-0"
          >
            {property.type.split('/')[0]}
          </Badge>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-1 truncate">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.city}, {property.state}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-primary">
              {formatPrice(property.priceInr, property.intent)}
              {property.intent === 'lease' && '/month'}
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                Details
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <MessageCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {property.badges.length > 0 && (
            <div className="flex gap-1 mt-2">
              {property.badges.slice(0, 2).map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
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

const ServiceCard: React.FC<{ service: ServiceProvider }> = ({ service }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex gap-3">
        <div className="relative w-20 h-16 flex-shrink-0">
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {service.rating && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 text-xs px-1 py-0 flex items-center gap-1"
            >
              <Star className="w-2 h-2 fill-current" />
              {service.rating}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-1 truncate">
            {service.name}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{service.city}, {service.state}</span>
          </div>
          
          <div className="text-xs text-primary mb-2">
            {service.category}
          </div>
          
          <div className="flex items-center justify-between">
            {service.experience && (
              <div className="text-xs text-muted-foreground">
                {service.experience}
              </div>
            )}
            
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                Details
              </Button>
              {service.phone && (
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Phone className="w-3 h-3" />
                </Button>
              )}
              {service.whatsapp && (
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MessageCircle className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Skeleton className="w-20 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-1/4" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-12" />
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

const EmptyState: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
  <div className="text-center py-8 px-4">
    <div className="text-muted-foreground mb-4">
      <ExternalLink className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p className="text-sm">No matches yet.</p>
      <p className="text-xs">Try changing Property Type or City.</p>
    </div>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClearFilters}
      className="text-xs"
    >
      Clear filters
    </Button>
  </div>
);

export const SearchResultsPanel: React.FC<SearchResultsPanelProps> = ({
  results,
  isLoading,
  error,
  searchType,
  onLoadMore,
  onClearFilters
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 h-fit">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Real-time matches
        </h2>
        <p className="text-sm text-muted-foreground">
          Top providers & property partners near you
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {isLoading && results.items.length === 0 ? (
          <LoadingSkeleton />
        ) : results.items.length === 0 ? (
          <EmptyState onClearFilters={onClearFilters} />
        ) : (
          <>
            {results.items.map((item) => (
              <div key={item.id}>
                {searchType === 'property' ? (
                  <PropertyCard property={item as PropertyListing} />
                ) : (
                  <ServiceCard service={item as ServiceProvider} />
                )}
              </div>
            ))}
            
            {results.hasMore && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="w-full text-xs"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {results.total > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Showing {results.items.length} of {results.total} matches
          </p>
        </div>
      )}
    </div>
  );
};