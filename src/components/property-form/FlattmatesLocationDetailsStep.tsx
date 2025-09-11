import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';

const flattmatesLocationSchema = z.object({
  locality: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().optional(),
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
}

export const FlattmatesLocationDetailsStep: React.FC<FlattmatesLocationDetailsStepProps> = ({
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

  const form = useForm<FlattmatesLocationData>({
    resolver: zodResolver(flattmatesLocationSchema),
    defaultValues: {
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.locality) {
      form.setValue('locality', initialData.locality);
    }
    if (initialData.landmark) {
      form.setValue('landmark', initialData.landmark);
    }
  }, [initialData, form]);

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
          form.setValue('locality', value, { shouldValidate: true });
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
          
          // Update the form fields
          if (city) form.setValue('city', city, { shouldValidate: true });
          if (state) form.setValue('state', state, { shouldValidate: true });
          if (pincode) form.setValue('pincode', pincode, { shouldValidate: true });
        }
        
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
      });

    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [form]);

  const onSubmit = (data: FlattmatesLocationData) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">Location Details</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Locality/Area and Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Locality/Area *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Search 'Sector 12, Noida'..."
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
                  <p className="text-xs text-red-500 animate-pulse font-bold">
                    Type the name of the apartment/ the area of property/anything that could help us 😊
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Landmark (Optional)</FormLabel>
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

          {showMap && (
            <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="h-12 px-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="h-12 px-8">
              Save & Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};