import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, MapPin, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface RequirementsSidebarProps {
  requirements: PropertyRequirement[];
  selectedRequirement: PropertyRequirement | null;
  onSelectRequirement: (requirement: PropertyRequirement) => void;
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

export const RequirementsSidebar: React.FC<RequirementsSidebarProps> = ({
  requirements,
  selectedRequirement,
  onSelectRequirement
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      const payload = typeof req.payload === 'string' 
        ? JSON.parse(req.payload || '{}') 
        : req.payload || {};
      
      // Search filter
      const searchMatch = !searchQuery || 
        req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payload.propertyType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payload.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payload.city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const typeMatch = typeFilter === 'all' || 
        payload.intent?.toLowerCase() === typeFilter.toLowerCase();
      
      // Status filter
      const statusMatch = statusFilter === 'all' || req.status === statusFilter;
      
      return searchMatch && typeMatch && statusMatch;
    });
  }, [requirements, searchQuery, typeFilter, statusFilter]);

  const uniqueTypes = [...new Set(requirements.map(req => {
    const payload = typeof req.payload === 'string' ? JSON.parse(req.payload || '{}') : req.payload || {};
    return payload.intent;
  }).filter(Boolean))];

  return (
    <div className="h-full flex flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Requirements ({requirements.length})</h2>
          <Button size="sm" onClick={() => navigate('/post-service')}>
            <Plus className="h-4 w-4 mr-2" />
            Post New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Requirements List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRequirements.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No requirements found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredRequirements.map((requirement) => {
              const payload = typeof requirement.payload === 'string' 
                ? JSON.parse(requirement.payload || '{}') 
                : requirement.payload || {};
              
              const isSelected = selectedRequirement?.id === requirement.id;
              
              return (
                <Card
                  key={requirement.id}
                  className={`cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
                    isSelected ? 'bg-accent border-primary shadow-sm' : ''
                  }`}
                  onClick={() => onSelectRequirement(requirement)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between">
                        <Badge 
                          variant={payload.intent === 'Buy' ? 'default' : 
                                  payload.intent === 'Sell' ? 'secondary' : 
                                  payload.intent === 'Lease' ? 'outline' :
                                  payload.intent === 'Service' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {payload.intent || 'Requirement'}
                        </Badge>
                        
                        {requirement.status === 'new' && (
                          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                            new
                          </Badge>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {requirement.title || `${payload.propertyType || payload.serviceType} ${payload.intent}` || 'Property Requirement'}
                      </h4>
                      
                      {/* Location */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {payload.city || 'Not specified'}{payload.state ? `, ${payload.state}` : ''}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="text-sm font-medium text-primary">
                        {formatPrice(payload.budget?.min, payload.budget?.max)}
                      </div>
                      
                      {/* Date */}
                      <div className="text-xs text-muted-foreground">
                        {new Date(requirement.created_at).toLocaleDateString('en-IN', {
                          month: 'numeric',
                          day: 'numeric', 
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};