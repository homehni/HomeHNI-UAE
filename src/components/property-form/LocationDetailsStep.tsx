import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationDetails } from '@/types/property';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';


const locationDetailsSchema = z.object({
  state: z.string().min(1, 'Please select state'),
  city: z.string().min(1, 'Please select city'),
  locality: z.string().min(1, 'Please enter locality'),
  landmark: z.string().optional(),
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
  const [statesData, setStatesData] = useState<any>({});
  const [cities, setCities] = useState<string[]>([]);
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const landmarkInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const form = useForm<LocationDetailsFormData>({
    resolver: zodResolver(locationDetailsSchema),
    defaultValues: {
      state: initialData.state || '',
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
    },
  });

  const selectedState = form.watch('state');

  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Error loading states data:', error);
      }
    };
    loadStatesData();
  }, []);

  useEffect(() => {
    if (selectedState && statesData[selectedState]) {
      setCities(statesData[selectedState]);
      // Reset city if current city is not in the new state
      const currentCity = form.getValues('city');
      if (currentCity && !statesData[selectedState].includes(currentCity)) {
        form.setValue('city', '');
      }
    } else {
      setCities([]);
    }
  }, [selectedState, statesData, form]);

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
        const comps = place?.address_components || [];
        const stateCandidate = getComponent(comps, 'administrative_area_level_1');
        const cityCandidate = getComponent(comps, 'locality') || getComponent(comps, 'administrative_area_level_2') || getComponent(comps, 'sublocality') || getComponent(comps, 'sublocality_level_1');
        if (stateCandidate) {
          const matchedState = Object.keys(statesData).find((s) => s.toLowerCase() === stateCandidate.toLowerCase());
          if (matchedState) {
            handleStateChange(matchedState);
            const possibleCities = (statesData[matchedState] as string[]) || [];
            const matchedCity = possibleCities.find((c) => c.toLowerCase() === (cityCandidate || '').toLowerCase());
            if (matchedCity) {
              form.setValue('city', matchedCity, { shouldValidate: true });
            }
          }
        }
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected location');
      });

      attach(landmarkInputRef.current, (place, el) => {
        const value = place?.formatted_address || place?.name || '';
        if (value) {
          el.value = value;
          form.setValue('landmark', value, { shouldValidate: true });
        }
        const loc = place?.geometry?.location;
        if (loc) setMapTo(loc.lat(), loc.lng(), place?.name || 'Selected landmark');
      });
    };

    loadGoogleMaps().then(initAutocomplete).catch(console.error);
  }, [statesData, form]);

  const handleStateChange = (value: string) => {
    form.setValue('state', value);
    form.setValue('city', ''); // Reset city when state changes
  };
  const onSubmit = (data: LocationDetailsFormData) => {
    // Convert to LocationDetails format and add missing fields as empty/default values
    const locationData: LocationDetails = {
      ...data,
      pincode: initialData.pincode || '',
      societyName: initialData.societyName || ''
    };
    onNext(locationData);
  };

  const stateNames = Object.keys(statesData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-primary mb-6">Location Details</h1>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* State and City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">State*</FormLabel>
                          <Select onValueChange={handleStateChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stateNames.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">City*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Locality/Area and Landmark */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Locality/Area*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Sector 12, Koramangala"
                              className="h-12"
                              {...field}
                              ref={(el) => {
                                field.ref(el)
                                localityInputRef.current = el
                              }}
                            />
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
                              ref={(el) => {
                                field.ref(el)
                                landmarkInputRef.current = el
                              }}
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