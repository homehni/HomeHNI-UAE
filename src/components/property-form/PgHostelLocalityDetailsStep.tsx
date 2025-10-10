import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { MapPin, X } from 'lucide-react';

const pgHostelLocationSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality/Area is required"),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type PgHostelLocationData = z.infer<typeof pgHostelLocationSchema>;

interface PgHostelLocalityDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export function PgHostelLocalityDetailsStep({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps
}: PgHostelLocalityDetailsStepProps) {
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialData.city || '');

  const form = useForm<PgHostelLocationData>({
    resolver: zodResolver(pgHostelLocationSchema),
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
        if (localityInputRef.current) {
          localityInputRef.current.value = '';
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedCity]);

  // Removed auto-save behavior to prevent auto-advancing to next step

  // Google Maps Places Autocomplete
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

    const initAutocomplete = () => {
      const google = (window as any).google;
      if (!google?.maps?.places) return;

      const options = {
        fields: ['formatted_address', 'name', 'address_components'],
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
      attach(cityInputRef.current, (place, el) => {
        const value = place?.formatted_address || place?.name || '';
        
        if (value) {
          el.value = value;
          form.setValue('city', value, { shouldValidate: true });
          setSelectedCity(value);
        }
      });

      // Attach autocomplete to locality field
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
      });
    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [form]);

  const onSubmit = (data: PgHostelLocationData) => {
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
    <div className="min-h-screen bg-background pb-32 sm:pb-24">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">
            Provide location details
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* City and Locality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Locality*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter location / society name"
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
            </div>

            {/* Landmark */}
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Landmark / Street</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Evergreen street"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons - Removed, using only sticky buttons */}
          </form>
        </Form>
      </div>
    </div>
  );
}