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

const commercialLocationDetailsSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality/Area is required"),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type CommercialLocationDetailsForm = z.infer<typeof commercialLocationDetailsSchema>;

interface CommercialLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CommercialLocationDetailsStep: React.FC<CommercialLocationDetailsStepProps> = ({
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
  const [locationMismatchWarning, setLocationMismatchWarning] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialData.city || '');

  const form = useForm<CommercialLocationDetailsForm>({
    resolver: zodResolver(commercialLocationDetailsSchema),
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
    if (initialData.state) {
      form.setValue('state', initialData.state);
    }
    if (initialData.pincode) {
      form.setValue('pincode', initialData.pincode);
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

      // City aliases for validation
      const cityAliases: { [key: string]: string[] } = {
        'Bangalore': ['Bangalore', 'Bengaluru', 'Bangalore Urban', 'Bengaluru Urban'],
        'Mumbai': ['Mumbai', 'Mumbai City', 'Mumbai Suburban', 'Bombay', 'Thane', 'Navi Mumbai'],
        'Delhi': ['Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
        'Chennai': ['Chennai', 'Madras'],
        'Hyderabad': ['Hyderabad', 'Secunderabad'],
        'Pune': ['Pune', 'Pimpri-Chinchwad', 'Pimpri Chinchwad'],
        'Gurgaon': ['Gurgaon', 'Gurugram'],
        'Faridabad': ['Faridabad'],
        'Ghaziabad': ['Ghaziabad'],
        'Noida': ['Noida'],
        'Greater Noida': ['Greater Noida'],
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
        const value = place?.formatted_address || place?.name || '';
        
        // Parse address components
        let state = '';
        let pincode = '';
        
        if (place?.address_components) {
          place.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('postal_code')) {
              pincode = component.long_name;
            }
          });
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

  const onSubmit = (data: CommercialLocationDetailsForm) => {
    console.log('=== LOCATION DETAILS STEP SUBMIT ===');
    console.log('Form data:', data);
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    
    // Convert to LocationDetails format and include parsed city, state, pincode
    const locationData: LocationDetails = {
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      landmark: data.landmark || '',
      pincode: data.pincode || '',
      societyName: initialData.societyName || ''
    };
    
    console.log('Location data being passed:', locationData);
    onNext(locationData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-red-600 mb-6 pt-4 md:pt-0">Location Details</h1>

      <Form {...form}>
        <form onSubmit={(e) => {
          console.log('=== LOCATION DETAILS FORM SUBMIT EVENT ===');
          console.log('Form submit event triggered');
          console.log('Form errors:', form.formState.errors);
          console.log('Form is valid:', form.formState.isValid);
          form.handleSubmit(onSubmit)(e);
        }} className="space-y-6">
          {/* City and Landmark */}
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

          {/* Locality/Area */}
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6" style={{ visibility: 'hidden' }}>
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