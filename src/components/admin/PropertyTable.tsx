import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, CheckCircle, XCircle, Trash2, Search, MoreHorizontal, EyeOff, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SecureDataMask } from './SecureDataMask';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type: string;
  state: string;
  city: string;
  locality: string;
  expected_price: number;
  super_area: number;
  description: string;
  images: string[];
  status: string;
  created_at: string;
  updated_at?: string;
  rejection_reason?: string;
  user_id: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  is_featured?: boolean;
  is_edited?: boolean;
  is_visible?: boolean;
  rental_status?: 'available' | 'inactive' | 'rented' | 'sold';
}

interface PropertyTableProps {
  properties: Property[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  featuredFilter?: boolean;
  onFeaturedFilterChange?: (featured: boolean) => void;
  stats?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deleted: number;
    featuredPending?: number;
    rented?: number;
    sold?: number;
  };
  onView: (property: Property) => void;
  onApprove: (id: string) => void;
  onReject: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string, isVisible: boolean) => void;
  actionLoading: boolean;
  // Multi-select functionality
  selectedProperties: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkDelete: (selectedIds: string[]) => void;
  onBulkAddToFeatured?: (selectedIds: string[]) => void;
  bulkActionLoading: boolean;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
    rented: 0,
    sold: 0
  },
  onView,
  onApprove,
  onReject,
  onDelete,
  onToggleVisibility,
  actionLoading,
  selectedProperties,
  onSelectionChange,
  onBulkDelete,
  onBulkAddToFeatured,
  bulkActionLoading,
}) => {
  // Multi-select functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(properties.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  const isAllSelected = properties.length > 0 && selectedProperties.length === properties.length;
  const isIndeterminate = selectedProperties.length > 0 && selectedProperties.length < properties.length;

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: { variant: 'default' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      rejected: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
      pending: { variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
      deleted: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full border-2 border-primary">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Property Listings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-48 bg-background border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending ({stats?.pending || 0})</SelectItem>
              <SelectItem value="edited-recently">Edited Recently</SelectItem>
              <SelectItem value="featured-pending">Featured Pending ({stats?.featuredPending || 0})</SelectItem>
              <SelectItem value="approved">Approved ({stats?.approved || 0})</SelectItem>
              <SelectItem value="rejected">Rejected ({stats?.rejected || 0})</SelectItem>
              <SelectItem value="deleted">Deleted ({stats?.deleted || 0})</SelectItem>
            </SelectContent>
          </Select>
          
          {onFeaturedFilterChange && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured-filter"
                checked={featuredFilter}
                onChange={(e) => onFeaturedFilterChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="featured-filter" className="text-sm text-gray-700">
                Featured Only
              </label>
            </div>
          )}
        </div>
      </CardHeader>
      
      {/* Bulk Actions Toolbar */}
      {selectedProperties.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProperties.length} propert{selectedProperties.length === 1 ? 'y' : 'ies'} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {onBulkAddToFeatured && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onBulkAddToFeatured(selectedProperties)}
                  disabled={bulkActionLoading}
                  className="h-8"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Add to Featured
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onBulkDelete(selectedProperties)}
                disabled={bulkActionLoading}
                className="h-8"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectionChange([])}
                className="h-8"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="p-0">
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className={isIndeterminate ? 'data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary' : ''}
                  />
                </TableHead>
                <TableHead className="font-semibold w-[300px]">Property</TableHead>
                <TableHead className="font-semibold w-[200px]">Owner</TableHead>
                <TableHead className="font-semibold w-[150px]">Location</TableHead>
                <TableHead className="font-semibold w-[120px]">Type</TableHead>
                <TableHead className="font-semibold w-[120px]">Price</TableHead>
                <TableHead className="font-semibold w-[180px]">Status</TableHead>
                <TableHead className="font-semibold w-[120px]">Date</TableHead>
                <TableHead className="font-semibold text-center w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow 
                  key={property.id} 
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    selectedProperties.includes(property.id) && "bg-blue-50"
                  )}
                >
                  <TableCell className="py-4 px-4">
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium py-4 px-4">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground text-sm leading-tight">
                        {property.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {property.bhk_type}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {property.is_edited && (
                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300 font-medium px-2 py-1">
                            ✏️ EDITED
                          </Badge>
                        )}
                        {property.is_featured && (
                          <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                            ⭐ Featured
                          </Badge>
                        )}
                        {property.is_visible === false && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300 font-medium px-2 py-1">
                            👁️‍🗨️ Hidden
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="space-y-2">
                      <div className="font-medium text-sm">
                        {property.owner_name || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <SecureDataMask 
                          data={property.owner_email || ''} 
                          type="email"
                          className="text-xs"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <SecureDataMask 
                          data={property.owner_phone || ''} 
                          type="phone"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{property.city}</div>
                      <div className="text-xs text-muted-foreground">{property.state}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{property.property_type}</div>
                      <div className="text-xs text-muted-foreground">{property.listing_type}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="font-semibold text-foreground">
                      ₹{property.expected_price?.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="space-y-2">
                      <div>
                        {getStatusBadge(property.status)}
                      </div>
                      {/* Property edited recently flag */}
                      {property.status === 'pending' && property.updated_at && property.created_at && 
                       new Date(property.updated_at) > new Date(property.created_at) && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300 font-medium px-2 py-1">
                          ✏️ Edited recently
                        </Badge>
                      )}
                      {/* Property rental status badge */}
                      {property.rental_status === 'rented' && (
                        <Badge className="text-xs bg-red-100 text-red-800 border-red-300 font-medium px-2 py-1">
                          Rented
                        </Badge>
                      )}
                      {property.rental_status === 'sold' && (
                        <Badge className="text-xs bg-green-100 text-green-800 border-green-300 font-medium px-2 py-1">
                          Sold
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(property.created_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(property)}
                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title="View Property"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {onToggleVisibility && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onToggleVisibility(property.id, !property.is_visible)}
                          disabled={actionLoading}
                          className={cn(
                            "h-9 w-9 p-0",
                            property.is_visible === false 
                              ? "hover:bg-green-50 hover:text-green-600" 
                              : "hover:bg-orange-50 hover:text-orange-600"
                          )}
                          title={property.is_visible === false ? "Show Property" : "Hide Property"}
                        >
                          {property.is_visible === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      )}
                      
                      {(property.status === 'pending' || property.status === 'new') && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApprove(property.id)}
                            disabled={actionLoading}
                            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600"
                            title="Approve Property"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(property)}
                            disabled={actionLoading}
                            className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600"
                            title="Reject Property"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {property.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onApprove(property.id)}
                          disabled={actionLoading}
                          className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600"
                          title="Re-Approve Property"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 hover:bg-gray-50"
                            title="More Options"
                            disabled={actionLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(property)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {property.status === 'approved' && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                onReject(property);
                              }}
                              className="text-orange-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          {property.status !== 'deleted' && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(property.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {properties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No properties found matching your filters.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};