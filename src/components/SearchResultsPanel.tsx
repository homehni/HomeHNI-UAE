import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

interface PropertyResult {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  image: string | string[];
  propertyType: string;
  listingType?: string;
  isNew?: boolean;
  ownerId?: string; // Add owner ID for ownership detection
}

interface SearchResults {
  items: PropertyResult[];
  total: number;
  hasMore: boolean;
}

interface SearchResultsPanelProps {
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => void;
  onClearFilters: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((index) => (
      <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
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
          Top property matches near you
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
            <div className="grid gap-3">
              {results.items.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  area={property.area}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  image={property.image}
                  propertyType={property.propertyType}
                  listingType={property.listingType}
                  isNew={property.isNew}
                  size="compact"
                  rental_status="available"
                  ownerId={property.ownerId}
                  showOwnerActions={true}
                />
              ))}
            </div>
            
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

