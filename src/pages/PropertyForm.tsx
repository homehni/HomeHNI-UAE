import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { MessageCircle } from 'lucide-react';

export const PropertyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    property_type: '',
    listing_type: '',
    bhk_type: '',
    bathrooms: '',
    balconies: '',
    super_area: '',
    carpet_area: '',
    expected_price: '',
    state: '',
    city: '',
    locality: '',
    pincode: '',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=property-form');
    }
  }, [user, navigate]);

  // Show WhatsApp modal after user starts filling the form
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsAppModal(true);
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to list your property.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.property_type || !formData.listing_type || !formData.super_area || !formData.expected_price || !formData.state || !formData.city || !formData.locality || !formData.pincode) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          bhk_type: formData.bhk_type || null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          balconies: formData.balconies ? parseInt(formData.balconies) : null,
          super_area: parseFloat(formData.super_area),
          carpet_area: formData.carpet_area ? parseFloat(formData.carpet_area) : null,
          expected_price: parseFloat(formData.expected_price),
          state: formData.state,
          city: formData.city,
          locality: formData.locality,
          pincode: formData.pincode,
          description: formData.description || null,
          user_id: user.id,
          availability_type: 'immediate',
          price_negotiable: true,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your property has been listed successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: "Failed to list your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOption = () => {
    setShowWhatsAppModal(true);
  };

  const handleContinueToForm = () => {
    setShowWhatsAppModal(false);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>List Your Property</CardTitle>
                  <CardDescription>
                    Fill in the details below to list your property on Home HNI
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsAppOption}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  List via WhatsApp
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Spacious 2BHK Apartment in Prime Location"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('property_type', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('listing_type', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.property_type !== 'plot' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bhk_type">BHK Type</Label>
                      <Select onValueChange={(value) => handleInputChange('bhk_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1rk">1RK</SelectItem>
                          <SelectItem value="1bhk">1BHK</SelectItem>
                          <SelectItem value="2bhk">2BHK</SelectItem>
                          <SelectItem value="3bhk">3BHK</SelectItem>
                          <SelectItem value="4bhk">4BHK</SelectItem>
                          <SelectItem value="5bhk">5BHK</SelectItem>
                          <SelectItem value="5bhk+">5BHK+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        placeholder="No. of bathrooms"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="balconies">Balconies</Label>
                      <Input
                        id="balconies"
                        type="number"
                        min="0"
                        placeholder="No. of balconies"
                        value={formData.balconies}
                        onChange={(e) => handleInputChange('balconies', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="super_area">Super Built-up Area (sqft) *</Label>
                    <Input
                      id="super_area"
                      type="number"
                      min="1"
                      placeholder="e.g., 1200"
                      value={formData.super_area}
                      onChange={(e) => handleInputChange('super_area', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="carpet_area">Carpet Area (sqft)</Label>
                    <Input
                      id="carpet_area"
                      type="number"
                      min="0"
                      placeholder="e.g., 1000"
                      value={formData.carpet_area}
                      onChange={(e) => handleInputChange('carpet_area', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expected_price">Expected Price (₹) *</Label>
                  <Input
                    id="expected_price"
                    type="number"
                    min="1"
                    placeholder="e.g., 5000000"
                    value={formData.expected_price}
                    onChange={(e) => handleInputChange('expected_price', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Mumbai"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locality">Locality *</Label>
                    <Input
                      id="locality"
                      placeholder="e.g., Bandra West"
                      value={formData.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="e.g., 400050"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, amenities, nearby facilities..."
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'List Property'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsAppOption}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    WhatsApp Instead
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        onContinueToForm={handleContinueToForm}
      />
    </div>
  );
};