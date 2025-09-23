import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';

const flattmatesLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  locality: z.string().optional(),
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
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);

  const form = useForm<FlattmatesLocationData>({
    resolver: zodResolver(flattmatesLocationSchema),
    defaultValues: {
      city: initialData.city || 'Bangalore', // Set default to Bangalore if none provided
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
    }
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
        console.log('=== Google Places Autocomplete Place Changed ===');
        console.log('Place:', place);
        console.log('Element:', el);
        
        const value = place?.formatted_address || place?.name || '';
        console.log('Selected value:', value);
        
        if (value) {
          el.value = value;
          console.log('Setting locality value:', value);
          form.setValue('locality', value, { shouldValidate: true });
          
          // Manually trigger form state update
          form.trigger('locality');
          console.log('Form state after setValue:', form.getValues());
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
          
          console.log('Parsed components:', { city, state, pincode });
          
          // Normalize city names to match dropdown options
          const normalizeCityName = (cityName: string): string => {
            const cityMap: { [key: string]: string } = {
              'Bangalore Division': 'Bangalore',
              'Bangalore Urban': 'Bangalore',
              'Mumbai Suburban': 'Mumbai',
              'Mumbai City': 'Mumbai',
              'Delhi': 'Delhi',
              'New Delhi': 'Delhi',
              'Chennai': 'Chennai',
              'Hyderabad': 'Hyderabad',
              'Pune': 'Pune',
              'Kolkata': 'Kolkata',
              'Ahmedabad': 'Ahmedabad',
              'Jaipur': 'Jaipur',
              'Lucknow': 'Lucknow',
              'Kanpur': 'Kanpur',
              'Nagpur': 'Nagpur',
              'Indore': 'Indore',
              'Thane': 'Thane',
              'Bhopal': 'Bhopal',
              'Visakhapatnam': 'Visakhapatnam',
              'Pimpri-Chinchwad': 'Pune',
              'Patna': 'Patna',
              'Vadodara': 'Vadodara',
              'Ludhiana': 'Ludhiana',
              'Agra': 'Agra',
              'Nashik': 'Nashik',
              'Faridabad': 'Faridabad',
              'Meerut': 'Meerut',
              'Rajkot': 'Rajkot',
              'Kalyan-Dombivali': 'Mumbai',
              'Vasai-Virar': 'Mumbai',
              'Varanasi': 'Varanasi',
              'Srinagar': 'Srinagar',
              'Aurangabad': 'Aurangabad',
              'Navi Mumbai': 'Mumbai',
              'Solapur': 'Solapur',
              'Vijayawada': 'Vijayawada',
              'Kolhapur': 'Kolhapur',
              'Amritsar': 'Amritsar',
              'Noida': 'Noida',
              'Ranchi': 'Ranchi',
              'Howrah': 'Kolkata',
              'Coimbatore': 'Coimbatore',
              'Raipur': 'Raipur',
              'Jabalpur': 'Jabalpur',
              'Gwalior': 'Gwalior',
              'Chandigarh': 'Chandigarh',
              'Tiruchirappalli': 'Tiruchirappalli',
              'Mysore': 'Mysore',
              'Bhubaneswar': 'Bhubaneswar',
              'Kochi': 'Kochi',
              'Bhavnagar': 'Bhavnagar',
              'Salem': 'Salem',
              'Warangal': 'Warangal',
              'Guntur': 'Guntur',
              'Bhiwandi': 'Mumbai',
              'Amravati': 'Amravati',
              'Nanded': 'Nanded',
              'Kolhapur': 'Kolhapur',
              'Sangli': 'Sangli',
              'Malegaon': 'Malegaon',
              'Ulhasnagar': 'Mumbai',
              'Jalgaon': 'Jalgaon',
              'Latur': 'Latur',
              'Ahmadnagar': 'Ahmadnagar',
              'Ichalkaranji': 'Ichalkaranji',
              'Jalna': 'Jalna',
              'Bhusawal': 'Bhusawal',
              'Panvel': 'Mumbai',
              'Akola': 'Akola',
              'Latur': 'Latur',
              'Dhule': 'Dhule',
              'Ahmednagar': 'Ahmednagar',
              'Chandrapur': 'Chandrapur',
              'Parbhani': 'Parbhani',
              'Ichalkaranji': 'Ichalkaranji',
              'Jalna': 'Jalna',
              'Bhusawal': 'Bhusawal',
              'Panvel': 'Mumbai',
              'Akola': 'Akola',
              'Latur': 'Latur',
              'Dhule': 'Dhule',
              'Ahmednagar': 'Ahmednagar',
              'Chandrapur': 'Chandrapur',
              'Parbhani': 'Parbhani'
            };
            
            // Check for exact match first
            if (cityMap[cityName]) {
              return cityMap[cityName];
            }
            
            // Check for partial matches
            for (const [key, value] of Object.entries(cityMap)) {
              if (cityName.includes(key) || key.includes(cityName)) {
                return value;
              }
            }
            
            // Return original if no match found
            return cityName;
          };
          
          const normalizedCity = normalizeCityName(city);
          console.log('Normalized city:', normalizedCity);
          
          // Update the form fields
          if (normalizedCity) {
            console.log('Setting city:', normalizedCity);
            form.setValue('city', normalizedCity, { shouldValidate: true });
            form.trigger('city');
          }
          if (state) {
            console.log('Setting state:', state);
            form.setValue('state', state, { shouldValidate: true });
            form.trigger('state');
          }
          if (pincode) {
            console.log('Setting pincode:', pincode);
            form.setValue('pincode', pincode, { shouldValidate: true });
            form.trigger('pincode');
          }
          
          console.log('Final form state:', form.getValues());
          console.log('=== Google Places Autocomplete Completed ===');
        }
        
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Location Details</h1>

      <Form {...form}>
        <form 
          id={formId || 'flatmates-step-form'} 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* City and Landmark Fields - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* City Field */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    City *
                  </FormLabel>
                  <Select onValueChange={(value) => {
                    console.log('City dropdown changed to:', value);
                    field.onChange(value);
                    console.log('Form state after city change:', form.getValues());
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white z-50">
                        <SelectValue placeholder="Choose city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Faridabad">Faridabad</SelectItem>
                      <SelectItem value="Ghaziabad">Ghaziabad</SelectItem>
                      <SelectItem value="Noida">Noida</SelectItem>
                      <SelectItem value="Greater Noida">Greater Noida</SelectItem>
                    </SelectContent>
                  </Select>
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
                      onChange={(e) => {
                        console.log('Locality input changed to:', e.target.value);
                        field.onChange(e);
                        console.log('Form state after locality change:', form.getValues());
                      }}
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