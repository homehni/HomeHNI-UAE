// @ts-nocheck
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Save, X, Upload, MapPin, MoveUp, Wifi, AirVent, MessageCircle, Users, Waves, Flame, Car, Building2, Droplets, Trees, Sparkles, PersonStanding, Zap, ShieldCheck, ShoppingCart, Accessibility, PawPrint, Dumbbell, UtensilsCrossed } from 'lucide-react';

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
  // Newly surfaced fields
  who_will_show?: string;
  current_property_condition?: string;
  secondary_phone?: string;
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
        'road_width', 'gated_security', 'directions',
        // Newly compared fields
        'who_will_show', 'current_property_condition', 'secondary_phone'
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
          console.log('Google Maps extracted location data:', { city, state, pincode });
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
        // Handle amenities type conversion from Json to string[]
        const processedProperty = {
          ...propertyData,
          amenities: Array.isArray(propertyData.amenities)
            ? propertyData.amenities.reduce((acc: any, key: string) => ({ ...acc, [key]: 'Available' }), {})
            : (typeof propertyData.amenities === 'object' && propertyData.amenities)
              ? propertyData.amenities
              : {}
        } as Property;
        setProperty(processedProperty);
        setEditedProperty(processedProperty);
        setIsPGProperty(false);
        return;
      }

      // If not found in properties table, try property_submissions table
      const { data: submissionData, error: submissionError } = await supabase
        .from('property_submissions')
        .select('*')
        .eq('id', propertyId)
        .eq('user_id', user?.id)
        .single();


      if (submissionData && !submissionError) {
        // Parse the payload to get the actual property data
        let payload: any = {};
        try {
          payload = typeof submissionData.payload === 'string' ? JSON.parse(submissionData.payload) : (submissionData.payload || {});
        } catch {
          payload = {};
        }

        // Convert submission data to property format
        const propertyFromSubmission = {
          id: submissionData.id,
          user_id: submissionData.user_id,
          title: payload.title || submissionData.title || 'Untitled',
          property_type: payload.property_type || payload.propertyType || 'residential',
          listing_type: payload.listing_type || payload.listingType || 'sale',
          bhk_type: payload.bhk_type || null,
          expected_price: Number(payload.expected_price) || 0,
          super_area: Number(payload.super_area) || undefined,
          carpet_area: Number(payload.carpet_area) || undefined,
          bathrooms: payload.bathrooms || undefined,
          balconies: payload.balconies || undefined,
          city: payload.city || 'Unknown',
          locality: payload.locality || '',
          state: payload.state || 'Unknown',
          pincode: payload.pincode || '000000',
          description: payload.description || '',
          images: Array.isArray(payload.images) ? payload.images : [],
          videos: Array.isArray(payload.videos) ? payload.videos : [],
          status: submissionData.status,
          created_at: submissionData.created_at,
          updated_at: submissionData.updated_at,
          owner_name: payload.owner_name || undefined,
          owner_email: payload.owner_email || undefined,
          owner_phone: payload.owner_phone || undefined,
          owner_role: payload.owner_role || undefined,
          // Additional fields from payload
          property_age: payload.property_age,
          floor_type: payload.floor_type,
          total_floors: payload.total_floors,
          floor_no: payload.floor_no,
          amenities: payload.amenities,
          landmark: payload.landmark,
          plot_area: payload.plot_area,
          length: payload.length,
          width: payload.width,
          boundary_wall: payload.boundary_wall,
          floors_allowed: payload.floors_allowed,
          gated_project: payload.gated_project,
          water_supply: payload.water_supply,
          electricity_connection: payload.electricity_connection,
          sewage_connection: payload.sewage_connection,
          road_width: payload.road_width,
          gated_security: payload.gated_security,
          directions: payload.directions,
          // Newly mapped fields
          who_will_show: payload.who_will_show || payload.whoWillShow,
          current_property_condition: payload.current_property_condition || payload.currentPropertyCondition,
          secondary_phone: payload.secondary_phone || payload.secondaryNumber,
        };

        console.log('Property from submission:', propertyFromSubmission);
        console.log('Floor number from payload:', payload.floor_no);
        console.log('Total floors from payload:', payload.total_floors);
        console.log('Amenities from payload:', payload.amenities);
        console.log('Location data from payload:', {
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          locality: payload.locality
        });

        setProperty(propertyFromSubmission);
        setEditedProperty(propertyFromSubmission);
        setIsPGProperty(false);
        return;
      }

      // If not found in property_submissions table, try pg_hostel_properties table
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

      // If neither table has the property, try without user_id filter to see if property exists
      const { data: anyPropertyData, error: anyPropertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();


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
      if (isPGProperty) {
        // Handle PG property auto-save
        const pgProperty = editedProperty as PGProperty;
        const { error } = await supabase
          .from('pg_hostel_properties')
          .update({
            title: pgProperty.title,
            expected_rent: pgProperty.expected_rent,
            expected_deposit: pgProperty.expected_deposit,
            state: pgProperty.state,
            city: pgProperty.city,
            locality: pgProperty.locality,
            landmark: pgProperty.landmark,
            place_available_for: pgProperty.place_available_for,  
            preferred_guests: pgProperty.preferred_guests,
            available_from: pgProperty.available_from,
            food_included: pgProperty.food_included,
            gate_closing_time: pgProperty.gate_closing_time,
            description: pgProperty.description,
            available_services: pgProperty.available_services,
            amenities: pgProperty.amenities,
            parking: pgProperty.parking,
            images: pgProperty.images,
            videos: pgProperty.videos,
            updated_at: new Date().toISOString()
          })
          .eq('id', pgProperty.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Handle regular property auto-save
        const regularProperty = editedProperty as Property;
        const { error } = await supabase
          .from('properties')
          .update({
            title: regularProperty.title,
            property_type: regularProperty.property_type,
            listing_type: regularProperty.listing_type,
            bhk_type: regularProperty.bhk_type,
            expected_price: regularProperty.expected_price,
            super_area: regularProperty.super_area,
            carpet_area: regularProperty.carpet_area,
            bathrooms: regularProperty.bathrooms,
            balconies: regularProperty.balconies,
            city: regularProperty.city,
            locality: regularProperty.locality,
            state: regularProperty.state,
            pincode: regularProperty.pincode,
            description: regularProperty.description,
            images: regularProperty.images,
            videos: regularProperty.videos,
            owner_name: regularProperty.owner_name,
            owner_email: regularProperty.owner_email,
            owner_phone: regularProperty.owner_phone,
            owner_role: regularProperty.owner_role,
            updated_at: new Date().toISOString(),
            // Additional fields
            property_age: regularProperty.property_age,
            floor_type: regularProperty.floor_type,
            total_floors: regularProperty.total_floors,
            floor_no: regularProperty.floor_no,
            amenities: regularProperty.amenities,
            landmark: regularProperty.landmark,
            // Plot/Land specific fields
            plot_area: regularProperty.plot_area,
            length: regularProperty.length,
            width: regularProperty.width,
            boundary_wall: regularProperty.boundary_wall,
            floors_allowed: regularProperty.floors_allowed,
            gated_project: regularProperty.gated_project,
            water_supply: regularProperty.water_supply,
            electricity_connection: regularProperty.electricity_connection,
            sewage_connection: regularProperty.sewage_connection,
            road_width: regularProperty.road_width,
            gated_security: typeof regularProperty.gated_security === 'boolean' 
              ? regularProperty.gated_security 
              : regularProperty.gated_security === 'true' || regularProperty.gated_security === 'Yes',
            directions: regularProperty.directions
          })
          .eq('id', regularProperty.id)
          .eq('user_id', user.id);

        if (error) throw error;
      }

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
      // Check if this is a property submission (not yet approved)
      const isSubmission = property?.status === 'new' || property?.status === 'review' || property?.status === 'pending';
      
      if (isSubmission) {
        // Update property submission
        const updateData = {
          title: editedProperty.title,
          city: editedProperty.city,
          state: editedProperty.state,
          status: 'pending', // Keep as pending for review
          updated_at: new Date().toISOString(),
          payload: JSON.parse(JSON.stringify(isPGProperty ? editedProperty : {
            ...editedProperty,
            // Ensure all the property data is preserved in the payload
            title: editedProperty.title,
            property_type: editedProperty.property_type,
            ...(editedProperty as Property).listing_type && { listing_type: (editedProperty as Property).listing_type },
            ...(editedProperty as Property).bhk_type && { bhk_type: (editedProperty as Property).bhk_type },
            ...(editedProperty as Property).expected_price && { expected_price: (editedProperty as Property).expected_price },
            ...(editedProperty as Property).super_area && { super_area: (editedProperty as Property).super_area },
            ...(editedProperty as Property).carpet_area && { carpet_area: (editedProperty as Property).carpet_area },
            ...(editedProperty as Property).bathrooms && { bathrooms: (editedProperty as Property).bathrooms },
            ...(editedProperty as Property).balconies && { balconies: (editedProperty as Property).balconies },
            city: editedProperty.city,
            locality: editedProperty.locality,
            state: editedProperty.state,
            ...(editedProperty as Property).pincode && { pincode: (editedProperty as Property).pincode },
            description: editedProperty.description,
            images: editedProperty.images,
            videos: editedProperty.videos,
            ...(editedProperty as Property).property_age && { property_age: (editedProperty as Property).property_age },
            ...(editedProperty as Property).floor_type && { floor_type: (editedProperty as Property).floor_type },
            ...(editedProperty as Property).total_floors && { total_floors: (editedProperty as Property).total_floors },
            ...(editedProperty as Property).floor_no && { floor_no: (editedProperty as Property).floor_no },
            amenities: editedProperty.amenities,
            ...(editedProperty as Property).landmark && { landmark: (editedProperty as Property).landmark },
            ...(editedProperty as Property).plot_area && { plot_area: (editedProperty as Property).plot_area },
            ...(editedProperty as Property).length && { length: (editedProperty as Property).length },
            ...(editedProperty as Property).width && { width: (editedProperty as Property).width },
            ...(editedProperty as Property).boundary_wall && { boundary_wall: (editedProperty as Property).boundary_wall },
            ...(editedProperty as Property).floors_allowed && { floors_allowed: (editedProperty as Property).floors_allowed },
            ...(editedProperty as Property).gated_project && { gated_project: (editedProperty as Property).gated_project },
            ...(editedProperty as Property).water_supply && { water_supply: (editedProperty as Property).water_supply },
            ...(editedProperty as Property).electricity_connection && { electricity_connection: (editedProperty as Property).electricity_connection },
            ...(editedProperty as Property).sewage_connection && { sewage_connection: (editedProperty as Property).sewage_connection },
            ...(editedProperty as Property).road_width && { road_width: (editedProperty as Property).road_width },
            ...(editedProperty as Property).gated_security !== undefined && { gated_security: (editedProperty as Property).gated_security },
            ...(editedProperty as Property).directions && { directions: (editedProperty as Property).directions },
          }))
        };

        const { error } = await supabase
          .from('property_submissions')
          .update(updateData)
          .eq('id', editedProperty.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else if (isPGProperty) {
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
          // Newly added infrastructure fields
          water_supply: (editedProperty as Property).water_supply || null,
          electricity_connection: (editedProperty as Property).electricity_connection || null,
          sewage_connection: (editedProperty as Property).sewage_connection || null,
          road_width: (editedProperty as Property).road_width ?? null,
          gated_security: ((editedProperty as Property).gated_security === true || (editedProperty as Property).gated_security === 'true') ? true : false,
          directions: (editedProperty as Property).directions || null,
          // Newly added top-level details
          who_will_show: (editedProperty as any).who_will_show || null,
          current_property_condition: (editedProperty as any).current_property_condition || null,
          secondary_phone: (editedProperty as any).secondary_phone || null,
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

        console.log('EditPropertyInline saving amenities:', {
          amenities: updateData.amenities,
          updateData
        });

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
                    <p>
                      {editedProperty.locality}
                      {editedProperty.city && editedProperty.city !== 'Unknown' && `, ${editedProperty.city}`}
                    </p>
                    <p>
                      {editedProperty.state && editedProperty.state !== 'Unknown' ? editedProperty.state : ''}
                      {editedProperty.pincode && editedProperty.pincode !== '000000' && editedProperty.pincode !== 'Unknown' ? 
                        (editedProperty.state && editedProperty.state !== 'Unknown' ? ` - ${editedProperty.pincode}` : editedProperty.pincode) : 
                        ''
                      }
                    </p>
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
                      {(editedProperty.city === 'Unknown' || editedProperty.state === 'Unknown' || editedProperty.pincode === '000000') && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Location Data Missing:</strong> Please re-select your location from the dropdown suggestions to automatically extract city, state, and pincode information.
                          </p>
                        </div>
                      )}
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
                      <div className="grid grid-cols-2 gap-4">
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
                          <Select
                            value={
                              editedProperty.floor_no === 0 ? 'ground' :
                              editedProperty.floor_no === 'basement' ? 'basement' :
                              editedProperty.floor_no === '99+' ? '99+' :
                              editedProperty.floor_no?.toString() || ''
                            }
                            onValueChange={(value) => {
                              if (value === 'ground') {
                                handleFieldChange('floor_no', 0);
                              } else if (value === 'basement') {
                                handleFieldChange('floor_no', 'basement');
                              } else if (value === '99+') {
                                handleFieldChange('floor_no', '99+');
                              } else {
                                handleFieldChange('floor_no', parseInt(value));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Floor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basement">Basement</SelectItem>
                              <SelectItem value="ground">Ground Floor</SelectItem>
                              {[...Array(50)].map((_, i) => {
                                const floor = i + 1;
                                return (
                                  <SelectItem key={floor} value={floor.toString()}>
                                    {floor}
                                  </SelectItem>
                                );
                              })}
                              <SelectItem value="99+">50+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="total_floors">Total Floors</Label>
                          <Input
                            id="total_floors"
                            type="number"
                            value={editedProperty.total_floors || ''}
                            onChange={(e) => handleFieldChange('total_floors', Number(e.target.value))}
                            placeholder="Total floors in building"
                          />
                        </div>
                      </div>
                    )}

                    {/* Show editable amenities for regular properties */}
                    {editedProperty.property_type !== 'plot' && editedProperty.property_type !== 'land' && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">Amenities</h4>

                        {/* Key facilities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                            <Label htmlFor="gated_security">Gated Security</Label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant={(editedProperty.gated_security === false || editedProperty.gated_security === 'false') ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('gated_security', false)}
                              >
                                No
                              </Button>
                              <Button
                                type="button"
                                variant={(editedProperty.gated_security === true || editedProperty.gated_security === 'true') ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('gated_security', true)}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Pet Allowed*</Label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.petAllowed === false ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), petAllowed: false })}
                              >
                                No
                              </Button>
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.petAllowed === true ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), petAllowed: true })}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Gym*</Label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.gym === false ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), gym: false })}
                              >
                                No
                              </Button>
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.gym === true ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), gym: true })}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Non-Veg Allowed*</Label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.nonVegAllowed === false ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), nonVegAllowed: false })}
                              >
                                No
                              </Button>
                              <Button
                                type="button"
                                variant={editedProperty.amenities?.nonVegAllowed === true ? 'default' : 'outline'}
                                onClick={() => handleFieldChange('amenities', { ...(editedProperty.amenities || {}), nonVegAllowed: true })}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Available Amenities - match Post Property form */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3">Select the available amenities</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {/* Lift */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.lift === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    lift: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <MoveUp className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Lift</Label>
                              </div>

                              {/* Internet Services */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.internetServices === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    internetServices: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Wifi className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Internet Services</Label>
                              </div>

                              {/* Air Conditioner */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.airConditioner === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    airConditioner: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <AirVent className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Air Conditioner</Label>
                              </div>

                              {/* Club House */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.clubHouse === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    clubHouse: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Users className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Club House</Label>
                              </div>

                              {/* Intercom */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.intercom === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    intercom: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Intercom</Label>
                              </div>

                              {/* Swimming Pool */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.swimmingPool === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    swimmingPool: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Waves className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Swimming Pool</Label>
                              </div>

                              {/* Children Play Area */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.childrenPlayArea === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    childrenPlayArea: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Accessibility className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Children Play Area</Label>
                              </div>

                              {/* Fire Safety */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.fireSafety === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    fireSafety: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Flame className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Fire Safety</Label>
                              </div>

                              {/* Servant Room */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.servantRoom === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    servantRoom: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <PersonStanding className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Servant Room</Label>
                              </div>

                              {/* Shopping Center */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.shoppingCenter === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    shoppingCenter: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Shopping Center</Label>
                              </div>

                              {/* Gas Pipeline */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.gasPipeline === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    gasPipeline: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Flame className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Gas Pipeline</Label>
                              </div>

                              {/* Park */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.park === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    park: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Trees className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Park</Label>
                              </div>

                              {/* Rain Water Harvesting */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.rainWaterHarvesting === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    rainWaterHarvesting: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Droplets className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Rain Water Harvesting</Label>
                              </div>

                              {/* Sewage Treatment Plant */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.sewageTreatmentPlant === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    sewageTreatmentPlant: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Building2 className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Sewage Treatment Plant</Label>
                              </div>

                              {/* House Keeping */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.houseKeeping === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    houseKeeping: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Sparkles className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">House Keeping</Label>
                              </div>

                              {/* Power Backup */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.powerBackup === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    powerBackup: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Zap className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Power Backup</Label>
                              </div>

                              {/* Visitor Parking */}
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={editedProperty.amenities?.visitorParking === 'Available'}
                                  onCheckedChange={(checked) => handleFieldChange('amenities', {
                                    ...(editedProperty.amenities || {}),
                                    visitorParking: checked ? 'Available' : 'Not Available'
                                  })}
                                />
                                <Car className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-normal cursor-pointer">Visitor Parking</Label>
                              </div>
                            </div>
                          </div>

                          {/* Directions Tip */}
                          <div className="md:col-span-2">
                            <Label htmlFor="directionsTip">Directions Tip</Label>
                            <Textarea
                              id="directionsTip"
                              className="mt-1"
                              value={editedProperty.amenities?.directionsTip || ''}
                              onChange={(e) => handleFieldChange('amenities', {
                                ...(editedProperty.amenities || {}),
                                directionsTip: e.target.value
                              })}
                              placeholder="Eg. Take the road opposite to Amrita College, take right after 300m..."
                              rows={3}
                            />
                          </div>
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

                          {/* Who shows property and condition */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div>
                              <Label htmlFor="who_will_show">Who will show the property?*</Label>
                              <Select
                                value={(editedProperty as any).who_will_show || ''}
                                onValueChange={(value) => handleFieldChange('who_will_show', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="need-help">Need help</SelectItem>
                                  <SelectItem value="i-will-show">I will show</SelectItem>
                                  <SelectItem value="neighbours">Neighbours</SelectItem>
                                  <SelectItem value="friends-relatives">Friends/Relatives</SelectItem>
                                  <SelectItem value="security">Security</SelectItem>
                                  <SelectItem value="tenants">Tenants</SelectItem>
                                  <SelectItem value="others">Others</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="current_property_condition">Current Property Condition?</Label>
                              <Select
                                value={(editedProperty as any).current_property_condition || ''}
                                onValueChange={(value) => handleFieldChange('current_property_condition', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excellent">Excellent</SelectItem>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="average">Average</SelectItem>
                                  <SelectItem value="needs-renovation">Needs Renovation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Secondary Number */}
                          <div className="mt-4">
                            <Label htmlFor="secondary_phone">Secondary Number</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                                <span className="text-sm">+91</span>
                              </div>
                              <Input
                                id="secondary_phone"
                                placeholder="Secondary Number"
                                value={(editedProperty as any).secondary_phone || ''}
                                onChange={(e) => handleFieldChange('secondary_phone', e.target.value)}
                                className="rounded-l-none"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Label htmlFor="directions">Add Directions Tip for your buyers</Label>
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Don't want calls asking location?</p>
                            <p className="text-sm text-gray-600 mb-3">Add directions to reach using landmarks</p>
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
