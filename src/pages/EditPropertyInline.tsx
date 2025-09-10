import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadPropertyImagesByType } from '@/services/fileUploadService';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Save, X, Upload, MapPin } from 'lucide-react';

interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  listing_type: string;
  bhk_type?: string;
  expected_price: number;
  super_area?: number;
  carpet_area?: number;
  bathrooms?: number;
  balconies?: number;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  description?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_role?: string;
  // Additional fields that exist in database
  property_age?: string;
  floor_type?: string;
  total_floors?: number;
  floor_no?: number;
  amenities?: string[];
  // Location specific fields
  landmark?: string;
  // Plot/Land specific fields (matching Post Property form)
  plot_area?: number;
  length?: number;
  width?: number;
  boundary_wall?: string;
  floors_allowed?: number;
  gated_project?: string;
  water_supply?: string;
  electricity_connection?: string;
  sewage_connection?: string;
  road_width?: number;
  gated_security?: boolean | string;
  directions?: string;
}

interface PGProperty {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  expected_rent: number;
  expected_deposit: number;
  state: string;
  city: string;
  locality: string;
  landmark?: string;
  place_available_for: string;
  preferred_guests: string;
  available_from?: string;
  food_included: boolean;
  gate_closing_time?: string;
  description?: string;
  available_services?: any;
  amenities?: any;
  parking?: string;
  images?: string[];
  videos?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export const EditPropertyInline: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { propertyId } = useParams<{ propertyId: string }>();
  const [searchParams] = useSearchParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<Property | PGProperty | null>(null);
  const [editedProperty, setEditedProperty] = useState<Property | PGProperty | null>(null);
  const [isPGProperty, setIsPGProperty] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Function to check if there are actual changes between original and edited property
  const hasChanges = () => {
    if (!property || !editedProperty) return false;
    
    if (isPGProperty) {
      // Compare PG/Hostel specific fields
      const pgFieldsToCompare: (keyof PGProperty)[] = [
        'title', 'expected_rent', 'expected_deposit', 'city', 'locality', 'state',
        'landmark', 'place_available_for', 'preferred_guests', 'available_from',
        'food_included', 'gate_closing_time', 'description', 'images', 'videos',
        'available_services', 'amenities', 'parking'
      ];
      
      return pgFieldsToCompare.some(field => {
        const original = (property as PGProperty)[field];
        const edited = (editedProperty as PGProperty)[field];
        
        // Handle arrays (like images)
        if (Array.isArray(original) && Array.isArray(edited)) {
          return JSON.stringify(original) !== JSON.stringify(edited);
        }
        
        // Handle other types
        return original !== edited;
      });
    } else {
      // Compare regular property fields (including plot-specific fields)
      const fieldsToCompare: (keyof Property)[] = [
        'title', 'property_type', 'listing_type', 'bhk_type', 'expected_price',
        'super_area', 'carpet_area', 'bathrooms', 'balconies', 'floor_no',
        'city', 'locality', 'state', 'pincode', 'description', 'images', 'videos',
        'landmark', 'property_age', 'floor_type', 'total_floors', 'amenities',
        // Plot/Land specific fields
        'plot_area', 'length', 'width', 'boundary_wall', 'floors_allowed', 
        'gated_project', 'water_supply', 'electricity_connection', 'sewage_connection',
        'road_width', 'gated_security', 'directions'
      ];
      
      return fieldsToCompare.some(field => {
        const original = (property as Property)[field];
        const edited = (editedProperty as Property)[field];
        
        // Handle arrays (like images)
        if (Array.isArray(original) && Array.isArray(edited)) {
          return JSON.stringify(original) !== JSON.stringify(edited);
        }
        
        // Handle other types
        return original !== edited;
      });
    }
  };
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  
  // Google Maps refs and state
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (propertyId && user) {
      fetchProperty();
    }
  }, [propertyId, user]);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['basic', 'location', 'details', 'images'].includes(tabParam)) {
      setActiveTab(tabParam);
      
      // Show a helpful message when directed from listing progress
      const tabNames = {
        'basic': 'Basic Information',
        'location': 'Location Details', 
        'details': 'Property Details',
        'images': 'Property Images'
      };
      
      toast({
        title: "Focus on this section",
        description: `You've been directed to ${tabNames[tabParam as keyof typeof tabNames]} to complete your listing.`,
      });
    }
  }, [searchParams, toast]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (propertyId) {
      const savedData = localStorage.getItem(`edit-property-${propertyId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setEditedProperty(parsedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
    }
  }, [propertyId]);

  // Google Maps autocomplete functionality
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if ((window as any).google?.maps?.places) {
          resolve((window as any).google);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve((window as any).google);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const setMapTo = (lat: number, lng: number, title: string) => {
      if (!mapContainerRef.current) return;

      const google = (window as any).google;
      if (!google?.maps) return;

      if (mapRef.current) {
        mapRef.current.setCenter({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
          markerRef.current.setTitle(title);
        } else {
          markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
            title: title,
          });
        }
      } else {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lat, lng },
          zoom: 15,
        });

        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          title: title,
        });
      }

      setShowMap(true);
    };

    const initAutocomplete = () => {
      const google = (window as any).google;
      if (!google?.maps?.places) return;
      
      const options = {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: { country: 'in' as const },
      };

      const attach = (el: HTMLInputElement | null, onPlace: (place: any, el: HTMLInputElement) => void) => {
        if (!el) return;
        const ac = new google.maps.places.Autocomplete(el, options);
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          onPlace(place, el);
        });
      };

      attach(localityInputRef.current, (place, el) => {
        const value = place?.formatted_address || place?.name || '';
        if (value) {
          el.value = value;
          handleFieldChange('locality', value);
        }
        
        // Parse address components to extract city, state, and pincode
        if (place?.address_components) {
          let city = '';
          let state = '';
          let pincode = '';
          
          place.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('postal_code')) {
              pincode = component.long_name;
            }
          });
          
          // Update the fields
          if (city) handleFieldChange('city', city);
          if (state) handleFieldChange('state', state);
          if (pincode) handleFieldChange('pincode', pincode);
        }
        
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
      });
    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [editedProperty]);

  // Save data to localStorage whenever editedProperty changes
  useEffect(() => {
    if (editedProperty && propertyId) {
      localStorage.setItem(`edit-property-${propertyId}`, JSON.stringify(editedProperty));
    }
  }, [editedProperty, propertyId]);

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges() && editedProperty) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 5000); // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [editedProperty, property]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      
      // First try to fetch from properties table
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('user_id', user?.id)
        .single();

      if (propertyData && !propertyError) {
        setProperty(propertyData);
        setEditedProperty(propertyData);
        setIsPGProperty(false);
        return;
      }

      // If not found in properties table, try pg_hostel_properties table
      const { data: pgData, error: pgError } = await supabase
        .from('pg_hostel_properties')
        .select('*')
        .eq('id', propertyId)
        .eq('user_id', user?.id)
        .single();

      if (pgData && !pgError) {
        setProperty(pgData);
        setEditedProperty(pgData);
        setIsPGProperty(true);
        return;
      }

      // If neither table has the property
      toast({
        title: "Property Not Found",
        description: "The property you're trying to edit doesn't exist or you don't have permission to edit it.",
        variant: "destructive"
      });
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (editedProperty) {
      setEditedProperty(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleAutoSave = async () => {
    if (!editedProperty || !user || !hasChanges()) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: editedProperty.title,
          property_type: editedProperty.property_type,
          listing_type: editedProperty.listing_type,
          bhk_type: editedProperty.bhk_type,
          expected_price: editedProperty.expected_price,
          super_area: editedProperty.super_area,
          carpet_area: editedProperty.carpet_area,
          bathrooms: editedProperty.bathrooms,
          balconies: editedProperty.balconies,
          city: editedProperty.city,
          locality: editedProperty.locality,
          state: editedProperty.state,
          pincode: editedProperty.pincode,
          description: editedProperty.description,
          images: editedProperty.images,
          videos: editedProperty.videos,
          owner_name: editedProperty.owner_name,
          owner_email: editedProperty.owner_email,
          owner_phone: editedProperty.owner_phone,
          owner_role: editedProperty.owner_role,
          updated_at: new Date().toISOString(),
          // Additional fields
          furnishing_status: editedProperty.furnishing_status,
          building_type: editedProperty.building_type,
          property_age: editedProperty.property_age,
          floor_type: editedProperty.floor_type,
          total_floors: editedProperty.total_floors,
          floor_no: editedProperty.floor_no,
          parking_type: editedProperty.parking_type,
          on_main_road: editedProperty.on_main_road,
          corner_property: editedProperty.corner_property,
          amenities: editedProperty.amenities,
          commercial_type: editedProperty.commercial_type,
          land_type: editedProperty.land_type,
          pg_type: editedProperty.pg_type,
          room_type: editedProperty.room_type,
          flatmates_type: editedProperty.flatmates_type
        })
        .eq('id', editedProperty.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHasUnsavedChanges(false);
      // Clear localStorage after successful save
      localStorage.removeItem(`edit-property-${propertyId}`);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save failures
    }
  };

  // Image compression utility with better quality handling
  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          // Only resize if image is larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Enable image smoothing for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Determine output format based on original file type
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const outputQuality = file.type === 'image/png' ? 0.9 : quality; // PNG gets higher quality
          
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(img.src); // Clean up object URL
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: outputType,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Canvas to blob conversion failed'));
              }
            },
            outputType,
            outputQuality
          );
        } catch (error) {
          URL.revokeObjectURL(img.src); // Clean up object URL
          reject(new Error(`Image processing failed: ${error}`));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Image loading failed'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (files: File[]) => {
    if (!editedProperty) return;
    
    setIsUploadingImages(true);
    setCompressionProgress(0);
    
    try {
      // Compress images silently before upload
      const compressedFiles: File[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedFile = await compressImage(file, 1920, 0.8);
        compressedFiles.push(compressedFile);
        
        // Update progress silently
        const progress = Math.round(((i + 1) / files.length) * 50); // First 50% for compression
        setCompressionProgress(progress);
      }

      // Update progress for upload phase
      setCompressionProgress(75);

      const uploadedImages = await uploadPropertyImagesByType(compressedFiles, editedProperty.property_type, user?.id);
      
      setCompressionProgress(100);
      
      // Extract URLs from the upload results
      const imageUrls = uploadedImages.map(result => result.url);
      const newImages = [...(editedProperty.images || []), ...imageUrls];
      handleFieldChange('images', newImages);
      
      // Show only final success message
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${files.length} image(s)`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImages(false);
      setCompressionProgress(0);
    }
  };

  const removeImage = (index: number) => {
    if (!editedProperty?.images) return;
    const newImages = editedProperty.images.filter((_, i) => i !== index);
    handleFieldChange('images', newImages);
  };

  const handleSave = async () => {
    if (!editedProperty || !user) return;

    setIsSubmitting(true);
    try {
      if (isPGProperty) {
        // Update PG/Hostel property
        const { error } = await supabase
          .from('pg_hostel_properties')
          .update({
            title: editedProperty.title,
            expected_rent: (editedProperty as PGProperty).expected_rent,
            expected_deposit: (editedProperty as PGProperty).expected_deposit,
            city: editedProperty.city,
            locality: editedProperty.locality,
            state: editedProperty.state,
            landmark: (editedProperty as PGProperty).landmark,
            place_available_for: (editedProperty as PGProperty).place_available_for,
            preferred_guests: (editedProperty as PGProperty).preferred_guests,
            available_from: (editedProperty as PGProperty).available_from,
            food_included: (editedProperty as PGProperty).food_included,
            gate_closing_time: (editedProperty as PGProperty).gate_closing_time,
            description: editedProperty.description,
            available_services: (editedProperty as PGProperty).available_services,
            amenities: (editedProperty as PGProperty).amenities,
            parking: (editedProperty as PGProperty).parking,
            images: editedProperty.images,
            videos: editedProperty.videos,
            status: 'pending', // Reset to pending for review - CRITICAL: prevents public visibility
            updated_at: new Date().toISOString()
          })
          .eq('id', editedProperty.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Update regular property - only include fields that exist in the database
        const updateData: any = {
          title: editedProperty.title,
          property_type: editedProperty.property_type,
          listing_type: (editedProperty as Property).listing_type,
          expected_price: (editedProperty as Property).expected_price,
          city: editedProperty.city,
          locality: editedProperty.locality,
          state: editedProperty.state,
          pincode: (editedProperty as Property).pincode,
          description: editedProperty.description,
          landmarks: (editedProperty as Property).landmark, // Map landmark to landmarks (database field)
          images: editedProperty.images,
          videos: editedProperty.videos,
          status: 'pending', // Reset to pending for review - CRITICAL: prevents public visibility
          updated_at: new Date().toISOString()
        };

        // Only include fields that exist in the database for the specific property type
        if (editedProperty.property_type === 'plot' || editedProperty.property_type === 'land') {
          // For plot/land properties, use super_area to store plot_area
          updateData.super_area = (editedProperty as Property).plot_area || (editedProperty as Property).super_area;
        } else {
          // For other property types, include the standard fields
          updateData.bhk_type = (editedProperty as Property).bhk_type;
          updateData.super_area = (editedProperty as Property).super_area;
          updateData.carpet_area = (editedProperty as Property).carpet_area;
          updateData.bathrooms = (editedProperty as Property).bathrooms;
          updateData.balconies = (editedProperty as Property).balconies;
          updateData.property_age = (editedProperty as Property).property_age;
          updateData.floor_type = (editedProperty as Property).floor_type;
          updateData.total_floors = (editedProperty as Property).total_floors;
          updateData.floor_no = (editedProperty as Property).floor_no;
          updateData.amenities = (editedProperty as Property).amenities;
        }

        const { error } = await supabase
          .from('properties')
          .update(updateData)
          .eq('id', editedProperty.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Verify the status was actually updated to prevent public visibility
        const { data: verifyData, error: verifyError } = await supabase
          .from('properties')
          .select('status')
          .eq('id', editedProperty.id)
          .eq('user_id', user.id)
          .single();
          
        if (verifyError) {
          console.error('Failed to verify property status update:', verifyError);
        } else if (verifyData?.status !== 'pending') {
          console.error('Property status was not properly updated to pending:', verifyData);
          // Force update the status again
          await supabase
            .from('properties')
            .update({ status: 'pending' })
            .eq('id', editedProperty.id)
            .eq('user_id', user.id);
        }
      }

      toast({
        title: "Property Updated!",
        description: "Your property has been updated successfully and is pending review.",
      });

      // Update the original property state
      setProperty(editedProperty);
      
      // Clear localStorage after successful save
      localStorage.removeItem(`edit-property-${propertyId}`);
      
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Marquee />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading property details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!property || !editedProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Marquee />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Marquee />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard?tab=properties')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-2">Update your property details in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Property Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{editedProperty.title}</h3>
                    <p className="text-sm text-gray-600">
                      {editedProperty.property_type.replace('_', ' ').toUpperCase()} • {editedProperty.listing_type.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="text-2xl font-bold text-green-600">
                    ₹{editedProperty.expected_price.toLocaleString()}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{editedProperty.locality}, {editedProperty.city}</p>
                    <p>{editedProperty.state} - {editedProperty.pincode}</p>
                  </div>
                  
                  {editedProperty.images && editedProperty.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {editedProperty.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        editedProperty.status === 'approved' ? 'bg-green-100 text-green-800' :
                        editedProperty.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {editedProperty.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${isPGProperty ? 'grid-cols-5' : 'grid-cols-4'}`}>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                {isPGProperty && <TabsTrigger value="pg-details">PG Details</TabsTrigger>}
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        value={editedProperty.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="Enter property title"
                      />
                    </div>

                    {isPGProperty ? (
                      // PG/Hostel specific fields
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expected_rent">Expected Rent (₹)</Label>
                            <Input
                              id="expected_rent"
                              type="number"
                              value={(editedProperty as PGProperty).expected_rent || ''}
                              onChange={(e) => handleFieldChange('expected_rent', Number(e.target.value))}
                              placeholder="Enter expected rent"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expected_deposit">Expected Deposit (₹)</Label>
                            <Input
                              id="expected_deposit"
                              type="number"
                              value={(editedProperty as PGProperty).expected_deposit || ''}
                              onChange={(e) => handleFieldChange('expected_deposit', Number(e.target.value))}
                              placeholder="Enter expected deposit"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="place_available_for">Place Available For</Label>
                            <Select
                              value={(editedProperty as PGProperty).place_available_for || ''}
                              onValueChange={(value) => handleFieldChange('place_available_for', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="co-living">Co-living</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="preferred_guests">Preferred Guests</Label>
                            <Select
                              value={(editedProperty as PGProperty).preferred_guests || ''}
                              onValueChange={(value) => handleFieldChange('preferred_guests', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred guests" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="working_professional">Working Professional</SelectItem>
                                <SelectItem value="any">Any</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="available_from">Available From</Label>
                            <Input
                              id="available_from"
                              type="date"
                              value={(editedProperty as PGProperty).available_from || ''}
                              onChange={(e) => handleFieldChange('available_from', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="food_included">Food Included</Label>
                            <Select
                              value={(editedProperty as PGProperty).food_included ? 'yes' : 'no'}
                              onValueChange={(value) => handleFieldChange('food_included', value === 'yes')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select food option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="gate_closing_time">Gate Closing Time</Label>
                          <Input
                            id="gate_closing_time"
                            type="time"
                            value={(editedProperty as PGProperty).gate_closing_time || ''}
                            onChange={(e) => handleFieldChange('gate_closing_time', e.target.value)}
                            placeholder="e.g., 10:00 PM"
                          />
                        </div>
                      </>
                    ) : (
                      // Regular property fields
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="property_type">Property Type</Label>
                          <Select
                            value={editedProperty.property_type}
                            onValueChange={(value) => handleFieldChange('property_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="independent_house">Independent House</SelectItem>
                              <SelectItem value="builder_floor">Builder Floor</SelectItem>
                              <SelectItem value="plot">Plot/Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="office">Office Space</SelectItem>
                              <SelectItem value="shop">Shop/Showroom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="listing_type">Listing Type</Label>
                          <Select
                            value={(editedProperty as Property).listing_type}
                            onValueChange={(value) => handleFieldChange('listing_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rent">For Rent</SelectItem>
                              <SelectItem value="sale">For Sale</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {!isPGProperty && (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Show BHK Type for residential properties */}
                        {(editedProperty.property_type === 'apartment' || 
                          editedProperty.property_type === 'villa' || 
                          editedProperty.property_type === 'independent_house' || 
                          editedProperty.property_type === 'builder_floor' || 
                          editedProperty.property_type === 'studio_apartment' || 
                          editedProperty.property_type === 'penthouse' || 
                          editedProperty.property_type === 'duplex') && (
                          <div>
                            <Label htmlFor="bhk_type">BHK Type</Label>
                            <Select
                              value={(editedProperty as Property).bhk_type || ''}
                              onValueChange={(value) => handleFieldChange('bhk_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select BHK type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="studio">Studio</SelectItem>
                                <SelectItem value="1rk">1 RK</SelectItem>
                                <SelectItem value="1bhk">1 BHK</SelectItem>
                                <SelectItem value="2bhk">2 BHK</SelectItem>
                                <SelectItem value="3bhk">3 BHK</SelectItem>
                                <SelectItem value="4bhk">4 BHK</SelectItem>
                                <SelectItem value="5bhk">5 BHK</SelectItem>
                                <SelectItem value="5bhk+">5+ BHK</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="expected_price">Price (₹)</Label>
                          <Input
                            id="expected_price"
                            type="number"
                            value={(editedProperty as Property).expected_price}
                            onChange={(e) => handleFieldChange('expected_price', Number(e.target.value))}
                            placeholder="Enter expected price"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editedProperty.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Enter property description"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Save Changes Button for Basic Info Tab */}
                <div className="mt-6 flex justify-between items-center">
                  {hasChanges() && (
                    <div className="text-sm text-orange-600 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      You have unsaved changes
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (hasChanges()) {
                          const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                          if (confirmLeave) {
                            localStorage.removeItem(`edit-property-${propertyId}`);
                            navigate('/dashboard?tab=properties');
                          }
                        } else {
                          navigate('/dashboard?tab=properties');
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !hasChanges()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Google Autocomplete Locality Input */}
                    <div className="space-y-2">
                      <Label htmlFor="locality" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Locality/Area *
                      </Label>
                      <div className="relative">
                        <Input
                          id="locality"
                          value={editedProperty.locality}
                          onChange={(e) => handleFieldChange('locality', e.target.value)}
                          placeholder="Search 'Bellandur, Bengaluru, Karnataka'..."
                          className="h-12 pl-10"
                          ref={localityInputRef}
                        />
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-red-500 animate-pulse font-bold">
                        Type the name of the apartment/ the area of property/anything that could help us 😊
                      </p>
                    </div>

                    {/* Landmark Input */}
                    <div className="space-y-2">
                      <Label htmlFor="landmark" className="text-sm font-medium">
                        Landmark (Optional)
                      </Label>
                      <Input
                        id="landmark"
                        value={editedProperty.landmark || ''}
                        onChange={(e) => handleFieldChange('landmark', e.target.value)}
                        placeholder="e.g., Near Metro Station"
                        className="h-12"
                      />
                    </div>

                    {/* Map Display */}
                    {showMap && (
                      <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
                        <div ref={mapContainerRef} className="w-full h-full" />
                      </div>
                    )}

                    {/* Hidden fields for backward compatibility */}
                    <div className="hidden">
                      <Input
                        value={editedProperty.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                      />
                      <Input
                        value={editedProperty.state}
                        onChange={(e) => handleFieldChange('state', e.target.value)}
                      />
                      <Input
                        value={editedProperty.pincode}
                        onChange={(e) => handleFieldChange('pincode', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Save Changes Button for Location Tab */}
                <div className="mt-6 flex justify-between items-center">
                  {hasChanges() && (
                    <div className="text-sm text-orange-600 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      You have unsaved changes
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (hasChanges()) {
                          const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                          if (confirmLeave) {
                            localStorage.removeItem(`edit-property-${propertyId}`);
                            navigate('/dashboard?tab=properties');
                          }
                        } else {
                          navigate('/dashboard?tab=properties');
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !hasChanges()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Note: Commercial-specific fields are not available in current database schema */}

                    {/* Only show bathroom, balcony, floor fields for non-plot properties */}
                    {editedProperty.property_type !== 'plot' && editedProperty.property_type !== 'land' && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={editedProperty.bathrooms || ''}
                            onChange={(e) => handleFieldChange('bathrooms', Number(e.target.value))}
                            placeholder="No. of bathrooms"
                          />
                        </div>
                        <div>
                          <Label htmlFor="balconies">Balconies</Label>
                          <Input
                            id="balconies"
                            type="number"
                            value={editedProperty.balconies || ''}
                            onChange={(e) => handleFieldChange('balconies', Number(e.target.value))}
                            placeholder="No. of balconies"
                          />
                        </div>
                        <div>
                          <Label htmlFor="floor_no">Floor Number</Label>
                          <Input
                            id="floor_no"
                            type="number"
                            value={editedProperty.floor_no || ''}
                            onChange={(e) => handleFieldChange('floor_no', Number(e.target.value))}
                            placeholder="Floor number"
                          />
                        </div>
                      </div>
                    )}

                    {/* Show plot-specific fields for plot/land properties */}
                    {(editedProperty.property_type === 'plot' || editedProperty.property_type === 'land') && (
                      <div className="space-y-6">
                        {/* Land/Plot Details */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Land/Plot Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="plot_area">Plot Area (sq.ft)</Label>
                              <Input
                                id="plot_area"
                                type="number"
                                value={editedProperty.plot_area || ''}
                                onChange={(e) => handleFieldChange('plot_area', Number(e.target.value))}
                                placeholder="e.g., 1200"
                              />
                            </div>
                            <div>
                              <Label htmlFor="boundary_wall">Boundary Wall</Label>
                              <Select
                                value={editedProperty.boundary_wall || ''}
                                onValueChange={(value) => handleFieldChange('boundary_wall', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select boundary wall status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes - Complete</SelectItem>
                                  <SelectItem value="partial">Partial</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="length">Length (ft)</Label>
                              <Input
                                id="length"
                                type="number"
                                value={editedProperty.length || ''}
                                onChange={(e) => handleFieldChange('length', Number(e.target.value))}
                                placeholder="e.g., 60"
                              />
                            </div>
                            <div>
                              <Label htmlFor="width">Width (ft)</Label>
                              <Input
                                id="width"
                                type="number"
                                value={editedProperty.width || ''}
                                onChange={(e) => handleFieldChange('width', Number(e.target.value))}
                                placeholder="e.g., 40"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="floors_allowed">Floors allowed for construction</Label>
                              <Input
                                id="floors_allowed"
                                type="number"
                                value={editedProperty.floors_allowed || ''}
                                onChange={(e) => handleFieldChange('floors_allowed', Number(e.target.value))}
                                placeholder="3"
                              />
                            </div>
                            <div>
                              <Label htmlFor="gated_project">Is the Land/Plot inside a gated project?</Label>
                              <Select
                                value={editedProperty.gated_project || ''}
                                onValueChange={(value) => handleFieldChange('gated_project', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="yes">Yes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Infrastructure & Amenities */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Infrastructure & Amenities</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="water_supply">Water Supply</Label>
                              <Select
                                value={editedProperty.water_supply || ''}
                                onValueChange={(value) => handleFieldChange('water_supply', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="municipal">Municipal Supply</SelectItem>
                                  <SelectItem value="borewell">Borewell</SelectItem>
                                  <SelectItem value="tank">Water Tank</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="electricity_connection">Electricity Connection</Label>
                              <Select
                                value={editedProperty.electricity_connection || ''}
                                onValueChange={(value) => handleFieldChange('electricity_connection', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="nearby">Nearby</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="sewage_connection">Sewage Connection</Label>
                              <Select
                                value={editedProperty.sewage_connection || ''}
                                onValueChange={(value) => handleFieldChange('sewage_connection', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="connected">Connected</SelectItem>
                                  <SelectItem value="septic_tank">Septic Tank</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="road_width">Width of Facing Road (ft.)</Label>
                              <Input
                                id="road_width"
                                type="number"
                                value={editedProperty.road_width || ''}
                                onChange={(e) => handleFieldChange('road_width', Number(e.target.value))}
                                placeholder="Width of facing road"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Label htmlFor="gated_security">Gated Security</Label>
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="gated_security"
                                  value="false"
                                  checked={editedProperty.gated_security === 'false' || editedProperty.gated_security === false}
                                  onChange={(e) => handleFieldChange('gated_security', e.target.value)}
                                />
                                <span>No</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="gated_security"
                                  value="true"
                                  checked={editedProperty.gated_security === 'true' || editedProperty.gated_security === true}
                                  onChange={(e) => handleFieldChange('gated_security', e.target.value)}
                                />
                                <span>Yes</span>
                              </label>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Label htmlFor="directions">Add Directions Tip for your buyers</Label>
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
                                NEW
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              Don't want calls asking location?
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              Add directions to reach using landmarks
                            </p>
                            <textarea
                              id="directions"
                              className="w-full p-3 border border-gray-300 rounded-md resize-none min-h-[100px]"
                              value={editedProperty.directions || ''}
                              onChange={(e) => handleFieldChange('directions', e.target.value)}
                              placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Save Changes Button for Details Tab */}
                <div className="mt-6 flex justify-between items-center">
                  {hasChanges() && (
                    <div className="text-sm text-orange-600 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      You have unsaved changes
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (hasChanges()) {
                          const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                          if (confirmLeave) {
                            localStorage.removeItem(`edit-property-${propertyId}`);
                            navigate('/dashboard?tab=properties');
                          }
                        } else {
                          navigate('/dashboard?tab=properties');
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !hasChanges()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {isPGProperty && (
                <TabsContent value="pg-details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>PG/Hostel Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="available_services_laundry">Laundry Service</Label>
                          <Select
                            value={(editedProperty as PGProperty).available_services?.laundry || ''}
                            onValueChange={(value) => handleFieldChange('available_services', {
                              ...(editedProperty as PGProperty).available_services,
                              laundry: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select laundry service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="not_available">Not Available</SelectItem>
                              <SelectItem value="paid">Paid Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="available_services_cleaning">Room Cleaning</Label>
                          <Select
                            value={(editedProperty as PGProperty).available_services?.room_cleaning || ''}
                            onValueChange={(value) => handleFieldChange('available_services', {
                              ...(editedProperty as PGProperty).available_services,
                              room_cleaning: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select cleaning service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="not_available">Not Available</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="available_services_warden">Warden Facility</Label>
                        <Select
                          value={(editedProperty as PGProperty).available_services?.warden_facility || ''}
                          onValueChange={(value) => handleFieldChange('available_services', {
                            ...(editedProperty as PGProperty).available_services,
                            warden_facility: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select warden facility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="not_available">Not Available</SelectItem>
                            <SelectItem value="24x7">24x7 Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="amenities">Available Amenities</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {[
                            { key: 'common_tv', label: 'Common TV' },
                            { key: 'refrigerator', label: 'Refrigerator' },
                            { key: 'power_backup', label: 'Power Backup' },
                            { key: 'mess', label: 'Mess' },
                            { key: 'wifi', label: 'WiFi' },
                            { key: 'lift', label: 'Lift' },
                            { key: 'cooking_allowed', label: 'Cooking Allowed' }
                          ].map((amenity) => (
                            <div key={amenity.key} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={amenity.key}
                                checked={(editedProperty as PGProperty).amenities?.[amenity.key] || false}
                                onChange={(e) => handleFieldChange('amenities', {
                                  ...(editedProperty as PGProperty).amenities,
                                  [amenity.key]: e.target.checked
                                })}
                                className="rounded"
                              />
                              <Label htmlFor={amenity.key} className="text-sm">{amenity.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="parking">Parking</Label>
                        <Select
                          value={(editedProperty as PGProperty).parking || ''}
                          onValueChange={(value) => handleFieldChange('parking', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select parking option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                            <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Save Changes Button for PG Details Tab */}
                  <div className="mt-6 flex justify-between items-center">
                    {hasChanges() && (
                      <div className="text-sm text-orange-600 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        You have unsaved changes
                      </div>
                    )}
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (hasChanges()) {
                            const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                            if (confirmLeave) {
                              localStorage.removeItem(`edit-property-${propertyId}`);
                              navigate('/dashboard?tab=properties');
                            }
                          } else {
                            navigate('/dashboard?tab=properties');
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSubmitting || !hasChanges()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="images" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            handleImageUpload(files);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploadingImages}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center space-y-2 ${
                          isUploadingImages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                      >
                        {isUploadingImages ? (
                          <>
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            <span className="text-sm text-blue-600">
                              Processing images...
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${compressionProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {compressionProgress}% complete
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Click to upload images or drag and drop
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB each
                            </span>
                            <span className="text-xs text-blue-600">
                              Images will be optimized for faster upload
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                    
                    {editedProperty.images && editedProperty.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {editedProperty.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Image failed to load:', image);
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', image);
                              }}
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Save Changes Button for Images Tab */}
                <div className="mt-6 flex justify-between items-center">
                  {hasChanges() && (
                    <div className="text-sm text-orange-600 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      You have unsaved changes
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (hasChanges()) {
                          const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                          if (confirmLeave) {
                            localStorage.removeItem(`edit-property-${propertyId}`);
                            navigate('/dashboard?tab=properties');
                          }
                        } else {
                          navigate('/dashboard?tab=properties');
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !hasChanges()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
