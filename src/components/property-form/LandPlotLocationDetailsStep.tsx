import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';

const landPlotLocationSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality/Area is required"),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type LandPlotLocationData = z.infer<typeof landPlotLocationSchema>;

interface LandPlotLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const LandPlotLocationDetailsStep: React.FC<LandPlotLocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialData.city || '');

  const form = useForm<LandPlotLocationData>({
    resolver: zodResolver(landPlotLocationSchema),
    defaultValues: {
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
      state: initialData.state || '',
      pincode: initialData.pincode || '',
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.city) {
      form.setValue('city', initialData.city);
      setSelectedCity(initialData.city);
    }
    if (initialData.locality) {
      form.setValue('locality', initialData.locality);
    }
    if (initialData.landmark) {
      form.setValue('landmark', initialData.landmark);
    }
  }, [initialData, form]);

  // Watch for city changes and clear locality
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'city' && value.city !== selectedCity) {
        form.setValue('locality', '');
        form.setValue('state', '');
        form.setValue('pincode', '');
        setSelectedCity(value.city || '');
        setLocationMismatchWarning('');
        setShowMap(false);
        if (localityInputRef.current) {
          localityInputRef.current.value = '';
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedCity]);

  // Google Maps Places Autocomplete and Map preview
  useEffect(() => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';

    const loadGoogleMaps = () => new Promise<void>((resolve, reject) => {
      if ((window as any).google?.maps?.places) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[data-gmaps]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=IN&language=en-IN`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-gmaps', 'true');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });

    const getComponent = (components: any[], type: string) =>
      components.find((c) => c.types?.includes(type))?.long_name as string | undefined;

    const setMapTo = (lat: number, lng: number, title?: string) => {
      const google = (window as any).google;
      if (!google || !mapContainerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapRef.current,
          title: title || 'Selected location',
        });
      } else {
        mapRef.current.setCenter({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
          if (title) markerRef.current.setTitle(title);
        } else {
          markerRef.current = new google.maps.Marker({ position: { lat, lng }, map: mapRef.current, title });
        }
      }
      setShowMap(true);
    };

    const initAutocomplete = () => {
      const google = (window as any).google;
      if (!google?.maps?.places) return;

      const currentCity = form.getValues('city');
      
      // City bounds for restricting search
      const cityBounds: { [key: string]: any } = {
        'bangalore': new google.maps.LatLngBounds(
          new google.maps.LatLng(12.7342, 77.3795),
          new google.maps.LatLng(13.1737, 77.8565)
        ),
        'mumbai': new google.maps.LatLngBounds(
          new google.maps.LatLng(18.8920, 72.7767),
          new google.maps.LatLng(19.2695, 72.9810)
        ),
        'delhi': new google.maps.LatLngBounds(
          new google.maps.LatLng(28.4041, 76.8388),
          new google.maps.LatLng(28.8833, 77.3465)
        ),
        'chennai': new google.maps.LatLngBounds(
          new google.maps.LatLng(12.8345, 80.0532),
          new google.maps.LatLng(13.2345, 80.2955)
        ),
        'hyderabad': new google.maps.LatLngBounds(
          new google.maps.LatLng(17.2145, 78.2578),
          new google.maps.LatLng(17.5645, 78.6378)
        ),
        'pune': new google.maps.LatLngBounds(
          new google.maps.LatLng(18.4088, 73.7389),
          new google.maps.LatLng(18.6298, 73.9897)
        ),
        'kolkata': new google.maps.LatLngBounds(
          new google.maps.LatLng(22.3882, 88.2244),
          new google.maps.LatLng(22.6882, 88.4644)
        ),
      };

      const options = {
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        types: ['geocode'],
        componentRestrictions: { country: 'in' as const },
        bounds: currentCity ? cityBounds[currentCity] : undefined,
        strictBounds: currentCity ? true : false,
      };

      const attach = (el: HTMLInputElement | null, onPlace: (place: any, el: HTMLInputElement) => void) => {
        if (!el) return;
        const ac = new google.maps.places.Autocomplete(el, options);
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          onPlace(place, el);
        });
      };

      // City aliases for validation (lowercase keys to match dropdown values)
      const cityAliases: { [key: string]: string[] } = {
        'bangalore': ['Bangalore', 'Bengaluru', 'Bangalore Urban', 'Bengaluru Urban'],
        'mumbai': ['Mumbai', 'Mumbai City', 'Mumbai Suburban', 'Bombay', 'Thane', 'Navi Mumbai'],
        'delhi': ['Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
        'chennai': ['Chennai', 'Madras'],
        'hyderabad': ['Hyderabad', 'Secunderabad'],
        'pune': ['Pune', 'Pimpri-Chinchwad', 'Pimpri Chinchwad'],
        'kolkata': ['Kolkata', 'Calcutta', 'Howrah'],
        'ahmedabad': ['Ahmedabad'],
        'jaipur': ['Jaipur'],
        'surat': ['Surat'],
        'lucknow': ['Lucknow'],
        'kanpur': ['Kanpur'],
        'nagpur': ['Nagpur'],
        'indore': ['Indore'],
        'thane': ['Thane', 'Mumbai'],
        'bhopal': ['Bhopal'],
        'visakhapatnam': ['Visakhapatnam', 'Vizag'],
        'pimpri-chinchwad': ['Pimpri-Chinchwad', 'Pimpri Chinchwad', 'Pune'],
        'patna': ['Patna'],
        'vadodara': ['Vadodara', 'Baroda'],
      };

      attach(localityInputRef.current, (place, el) => {
        const value = place?.formatted_address || place?.name || '';
        
        // Parse address components first
        let detectedCity = '';
        let state = '';
        let pincode = '';
        
        if (place?.address_components) {
          place.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              detectedCity = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('postal_code')) {
              pincode = component.long_name;
            }
          });
        }

        // Validate city match
        const selectedCityValue = form.getValues('city');
        const aliases = selectedCityValue ? cityAliases[selectedCityValue] || [selectedCityValue] : [];
        const isCityMatch = aliases.some(alias => 
          detectedCity.toLowerCase().includes(alias.toLowerCase()) ||
          alias.toLowerCase().includes(detectedCity.toLowerCase())
        );

        if (selectedCityValue && detectedCity && !isCityMatch) {
          setLocationMismatchWarning(selectedCityValue);
          el.value = '';
          form.setValue('locality', '', { shouldValidate: true });
          setShowMap(false);
          return;
        }

        setLocationMismatchWarning('');
        
        if (value) {
          el.value = value;
          form.setValue('locality', value, { shouldValidate: true });
        }
        
        // Update other fields
        if (state) form.setValue('state', state, { shouldValidate: true });
        if (pincode) form.setValue('pincode', pincode, { shouldValidate: true });
        
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
      });

    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [form]);

  const onSubmit = (data: LandPlotLocationData) => {
    // Convert to LocationDetails format and include parsed city, state, pincode
    const locationData: LocationDetails = {
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      landmark: data.landmark || '',
      pincode: data.pincode || '',
      societyName: initialData.societyName || ''
    };
    onNext(locationData);
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Location Details</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* City Field and Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">City</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose city" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                        <SelectItem value="kolkata">Kolkata</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                        <SelectItem value="jaipur">Jaipur</SelectItem>
                        <SelectItem value="surat">Surat</SelectItem>
                        <SelectItem value="lucknow">Lucknow</SelectItem>
                        <SelectItem value="kanpur">Kanpur</SelectItem>
                        <SelectItem value="nagpur">Nagpur</SelectItem>
                        <SelectItem value="indore">Indore</SelectItem>
                        <SelectItem value="thane">Thane</SelectItem>
                        <SelectItem value="bhopal">Bhopal</SelectItem>
                        <SelectItem value="visakhapatnam">Visakhapatnam</SelectItem>
                        <SelectItem value="pimpri-chinchwad">Pimpri-Chinchwad</SelectItem>
                        <SelectItem value="patna">Patna</SelectItem>
                        <SelectItem value="vadodara">Vadodara</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Landmark (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Near Metro Station"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Locality/Area */}
          <FormField
            control={form.control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">Locality/Area</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search 'Bellandur, Bengaluru, Karnataka'..."
                      className="h-12 pl-10"
                      {...field}
                      ref={(el) => {
                        field.ref(el)
                        localityInputRef.current = el
                      }}
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                {locationMismatchWarning && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">
                      Please select another locality in {locationMismatchWarning}
                    </p>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {showMap && (
            <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>
          )}

          {/* Navigation Buttons - Removed, using sticky buttons instead */}
        </form>
      </Form>
    </div>
  );
};