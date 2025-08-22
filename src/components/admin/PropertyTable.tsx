import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, Trash2, Search, MoreHorizontal, Star } from 'lucide-react';
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
  rejection_reason?: string;
  user_id: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
}

interface PropertyTableProps {
  properties: Property[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onView: (property: Property) => void;
  onApprove: (id: string) => void;
  onReject: (property: Property) => void;
  onDelete: (id: string) => void;
  onPublish?: (id: string) => void;
  actionLoading: boolean;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onView,
  onApprove,
  onReject,
  onDelete,
  onPublish,
  actionLoading,
}) => {
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Property</TableHead>
                <TableHead className="font-semibold">Owner</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow 
                  key={property.id} 
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground truncate max-w-[200px]">
                        {property.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {property.bhk_type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm truncate max-w-[150px]">
                        {property.owner_name || 'N/A'}
                      </div>
                      <div className="text-xs truncate max-w-[150px]">
                        <SecureDataMask 
                          data={property.owner_email || ''} 
                          type="email"
                          className="text-xs"
                        />
                      </div>
                      <div className="text-xs">
                        <SecureDataMask 
                          data={property.owner_phone || ''} 
                          type="phone"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{property.city}</div>
                      <div className="text-xs text-muted-foreground">{property.state}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{property.property_type}</div>
                      <div className="text-xs text-muted-foreground">{property.listing_type}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      ₹{property.expected_price?.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(property.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(property.created_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(property)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {property.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onApprove(property.id)}
                            disabled={actionLoading}
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReject(property)}
                            disabled={actionLoading}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {property.status === 'approved' && onPublish && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPublish(property.id)}
                          disabled={actionLoading}
                          className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
                          title="Publish to Featured Properties"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(property)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {property.status !== 'deleted' && (
                            <DropdownMenuItem 
                              onClick={() => onDelete(property.id)}
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