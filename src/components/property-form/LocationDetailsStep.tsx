import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, Home, MapPin } from 'lucide-react';


const locationDetailsSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality/Area is required"),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type LocationDetailsFormData = z.infer<typeof locationDetailsSchema>;

interface LocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const LocationDetailsStep: React.FC<LocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}) => {
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState<string>('');
  const form = useForm<LocationDetailsFormData>({
    resolver: zodResolver(locationDetailsSchema),
    mode: 'onBlur',
    defaultValues: {
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.city) {
      form.setValue('city', initialData.city);
    }
    if (initialData.locality) {
      form.setValue('locality', initialData.locality);
    }
    if (initialData.landmark) {
      form.setValue('landmark', initialData.landmark);
    }
  }, [initialData, form]);

  // Google Maps utility functions
  const loadGoogleMaps = () => {
    const apiKey = 'AIzaSyD2rlXeHN4cm0CQD-y4YGTsob9a_27YcwY';
    return new Promise<void>((resolve, reject) => {
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
  };

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
    
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: { country: 'in' as const }
    };

    const attach = (el: HTMLInputElement | null, onPlace: (place: any, el: HTMLInputElement) => void) => {
      if (!el) return;
      const ac = new google.maps.places.Autocomplete(el, options);
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        onPlace(place, el);
      });
    };

      // Attach autocomplete to city field
      if (cityInputRef.current) {
        const cityOptions = {
          fields: ['address_components', 'name'],
          types: ['(cities)'],
          componentRestrictions: { country: 'in' as const }
        };
        const cityAc = new google.maps.places.Autocomplete(cityInputRef.current, cityOptions);
        cityAc.addListener('place_changed', () => {
          const place = cityAc.getPlace();
          if (place?.address_components) {
            let cityName = '';
            place.address_components.forEach((component: any) => {
              if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                cityName = component.long_name;
              }
            });
            if (cityName && cityInputRef.current) {
              cityInputRef.current.value = cityName;
              form.setValue('city', cityName, { shouldValidate: true });
            }
          }
        });
      }

    attach(localityInputRef.current, (place, el) => {
      // Parse address components to extract city, state and pincode
      let cityName = '';
      let state = '';
      let pincode = '';
      
      if (place?.address_components) {
        place.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            cityName = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('postal_code')) {
            pincode = component.long_name;
          }
        });
      }
      
      // Set locality value from the place
      const localityValue = place?.formatted_address || place?.name || '';
      if (localityValue) {
        form.setValue('locality', localityValue, { shouldValidate: true });
      }
      
      // Update city field
      if (cityName) {
        form.setValue('city', cityName, { shouldValidate: true });
        if (cityInputRef.current) {
          cityInputRef.current.value = cityName;
        }
      }
      
      // Update state and pincode
      if (state) form.setValue('state', state, { shouldValidate: true });
      if (pincode) form.setValue('pincode', pincode, { shouldValidate: true });
      
      const loc = place?.geometry?.location;
      if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
    });
  };


  // Google Maps Places Autocomplete and Map preview
  useEffect(() => {
    loadGoogleMaps().then(() => {
      initAutocomplete();
    }).catch(console.error);
  }, [form]);


  const onSubmit = (data: LocationDetailsFormData) => {
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
        <h1 className="text-2xl font-semibold text-red-600 mb-2">Location Details</h1>
      </div>

              <Form {...form}>
                <form id="location-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* City Selection */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          City *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Search 'Bangalore', 'Mumbai', etc..." 
                              className="h-12 pl-10" 
                              {...field} 
                              ref={el => {
                                field.ref(el);
                                cityInputRef.current = el;
                              }} 
                            />
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Locality/Area and Landmark */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-2">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Locality/Area *
                          </FormLabel>
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
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <div className="min-h-[20px]">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem className="flex-1 space-y-2">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 opacity-0" />
                            Landmark (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Near Metro Station"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <div className="min-h-[20px]">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {showMap && (
                    <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
                      <div ref={mapContainerRef} className="w-full h-full" />
                    </div>
                  )}

                </form>
              </Form>
              
              {/* Hidden submit button for sticky bar */}
              <button type="submit" form="location-details-form" className="hidden" />
    </div>
  );
};