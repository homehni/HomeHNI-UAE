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

const flattmatesLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality/Area is required'),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type FlattmatesLocationData = z.infer<typeof flattmatesLocationSchema>;

interface FlattmatesLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  formId?: string;
}

export const FlattmatesLocationDetailsStep: React.FC<FlattmatesLocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps,
  formId
}) => {
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialData.city || '');

  const form = useForm<FlattmatesLocationData>({
    resolver: zodResolver(flattmatesLocationSchema),
    mode: 'onBlur',
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

      // City aliases for validation

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

        setLocationMismatchWarning('');
        
        // Set locality value from the place
        const localityValue = place?.formatted_address || place?.name || '';
        if (localityValue) {
          el.value = localityValue;
          form.setValue('locality', localityValue, { shouldValidate: true });
        }
        
        // Update city field
        if (cityName) {
          form.setValue('city', cityName, { shouldValidate: true });
          if (cityInputRef.current) {
            cityInputRef.current.value = cityName;
          }
          setSelectedCity(cityName);
        }
        
        // Update state and pincode
        if (state) form.setValue('state', state, { shouldValidate: true });
        if (pincode) form.setValue('pincode', pincode, { shouldValidate: true });
        
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
      });

    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [form]);

  const onSubmit = (data: FlattmatesLocationData) => {
    console.log('=== FlattmatesLocationDetailsStep onSubmit called ===');
    console.log('Form data received:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data || {}));
    console.log('Form errors:', form.formState.errors);
    console.log('Form isValid:', form.formState.isValid);
    console.log('Form isDirty:', form.formState.isDirty);
    
    // Let react-hook-form + zod handle validity. If invalid, onSubmit won't be called.
    
    // Convert to LocationDetails format and include parsed city, state, pincode
    const locationData: LocationDetails = {
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      landmark: data.landmark || '',
      pincode: data.pincode || '',
      societyName: initialData.societyName || ''
    };
    console.log('Converted locationData:', locationData);
    console.log('About to call onNext...');
    onNext(locationData);
    console.log('onNext called successfully');
    console.log('=== FlattmatesLocationDetailsStep onSubmit completed ===');
  };

  return (
    <div className="bg-background p-6">
      <div className="text-left mb-8 pt-4 md:pt-0">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">Location Details</h1>
      </div>

      <Form {...form}>
        <form 
          id={formId || 'flatmates-step-form'} 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* City and Landmark Fields - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
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

            {/* Landmark Field */}
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Landmark (Optional)
                  </FormLabel>
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

          {/* Locality/Area Field */}
          <FormField
            control={form.control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
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
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showMap && (
            <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>
          )}

        </form>
      </Form>
    </div>
  );
};