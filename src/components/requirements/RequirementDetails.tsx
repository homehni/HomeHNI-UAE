import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Edit, 
  Copy, 
  MoreHorizontal, 
  ArrowLeft,
  Sparkles,
  Clock,
  Grid,
  List
} from 'lucide-react';
import { RequirementMatches } from '@/components/RequirementMatches';
import { toast } from 'sonner';

interface PropertyRequirement {
  id: string;
  user_id: string;
  title: string;
  payload: any;
  status: string;
  created_at: string;
  city?: string;
  state?: string;
}

interface RequirementDetailsProps {
  requirement: PropertyRequirement | null;
  onBack?: () => void;
  showBackButton?: boolean;
}

const formatPrice = (min?: number, max?: number) => {
  if (!min && !max) return 'Contact for Price';
  
  const formatNumber = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num.toLocaleString()}`;
  };

  if (min && max) return `${formatNumber(min)} - ${formatNumber(max)}`;
  return formatNumber(min || max || 0);
};

export const RequirementDetails: React.FC<RequirementDetailsProps> = ({
  requirement,
  onBack,
  showBackButton = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('best-match');
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Auto-refresh matches every 20 seconds
  useEffect(() => {
    if (!requirement) return;
    
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
      toast('Checking for new matches...', { duration: 2000 });
    }, 20000);

    return () => clearInterval(interval);
  }, [requirement]);

  if (!requirement) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-3">
          <Building className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-muted-foreground">Select a requirement</h3>
          <p className="text-sm text-muted-foreground">
            Choose a requirement from the sidebar to view real-time matches
          </p>
        </div>
      </div>
    );
  }

  const payload = typeof requirement.payload === 'string' 
    ? JSON.parse(requirement.payload || '{}') 
    : requirement.payload || {};

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mb-3 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Requirements
              </Button>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={payload.intent === 'Buy' ? 'default' : 
                        payload.intent === 'Sell' ? 'secondary' : 
                        payload.intent === 'Lease' ? 'outline' :
                        payload.intent === 'Service' ? 'destructive' : 'secondary'}
              >
                {payload.intent || 'Requirement'}
              </Badge>
              
              <Badge 
                variant={requirement.status === 'new' ? 'default' : 
                        requirement.status === 'active' ? 'secondary' : 'outline'}
                className={requirement.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          requirement.status === 'active' ? 'bg-green-100 text-green-800' : ''}
              >
                {requirement.status}
              </Badge>
            </div>
            
            <h1 className="text-xl font-semibold mb-2 line-clamp-2">
              {requirement.title || `${payload.propertyType || payload.serviceType} ${payload.intent}` || 'Property Requirement'}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{payload.city || 'Not specified'}{payload.state ? `, ${payload.state}` : ''}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(requirement.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="font-medium text-primary">
                {formatPrice(payload.budget?.min, payload.budget?.max)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="matches" className="h-full flex flex-col">
          <div className="border-b border-border px-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Real-time Matches
              </TabsTrigger>
              <TabsTrigger value="details">Requirement Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="matches" className="h-full m-0">
              <div className="p-4">
                {/* Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="best-match">Best Match</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Auto-refresh: 20s</span>
                    </div>
                    
                    <div className="flex border border-border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0 rounded-r-none"
                      >
                        <Grid className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0 rounded-l-none"
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Matches */}
                <RequirementMatches 
                  requirement={{
                    id: requirement.id,
                    title: requirement.title || 'Property Requirement',
                    payload: payload
                  }}
                  key={lastRefresh} // Force re-render on refresh
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="h-full m-0">
              <div className="p-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requirement Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <p className="text-sm mt-1">{payload.propertyType || payload.serviceType || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Intent</label>
                        <p className="text-sm mt-1">{payload.intent || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Budget Range</label>
                        <p className="text-sm mt-1">{formatPrice(payload.budget?.min, payload.budget?.max)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-sm mt-1">
                          {payload.city || 'Not specified'}{payload.state ? `, ${payload.state}` : ''}
                        </p>
                      </div>
                      
                      {payload.bhkType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">BHK Type</label>
                          <p className="text-sm mt-1">{payload.bhkType}</p>
                        </div>
                      )}
                      
                      {payload.furnishing && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Furnishing</label>
                          <p className="text-sm mt-1">{payload.furnishing}</p>
                        </div>
                      )}
                    </div>
                    
                    {payload.description && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{payload.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="h-full m-0">
              <div className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Requirement Created</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(requirement.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Matching Started</p>
                          <p className="text-xs text-muted-foreground">
                            Automatically searching for relevant properties and services
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
