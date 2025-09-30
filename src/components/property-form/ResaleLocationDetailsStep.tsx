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
import { useIsMobile } from '@/hooks/use-mobile';
const resaleLocationSchema = z.object({
  city: z.string().optional(),
  locality: z.string().optional(),
  landmark: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional()
});
type ResaleLocationData = z.infer<typeof resaleLocationSchema>;
interface ResaleLocationDetailsStepProps {
  initialData?: Partial<LocationDetails>;
  onNext: (data: LocationDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  formId?: string;
}
export const ResaleLocationDetailsStep: React.FC<ResaleLocationDetailsStepProps> = ({
  initialData = {},
  onNext,
  onBack,
  currentStep,
  totalSteps,
  formId
}) => {
  const isMobile = useIsMobile();
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState<string>('');
  const form = useForm<ResaleLocationData>({
    resolver: zodResolver(resaleLocationSchema),
    defaultValues: {
      city: initialData.city || '',
      locality: initialData.locality || '',
      landmark: initialData.landmark || '',
      state: initialData.state || '',
      pincode: initialData.pincode || ''
    }
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData.locality) {
      form.setValue('locality', initialData.locality);
    }
    if (initialData.landmark) {
      form.setValue('landmark', initialData.landmark);
    }
    if (initialData.city) {
      form.setValue('city', initialData.city);
    }
    if (initialData.state) {
      form.setValue('state', initialData.state);
    }
    if (initialData.pincode) {
      form.setValue('pincode', initialData.pincode);
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
        center: {
          lat,
          lng
        },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
      markerRef.current = new google.maps.Marker({
        position: {
          lat,
          lng
        },
        map: mapRef.current,
        title: title || 'Selected location'
      });
    } else {
      mapRef.current.setCenter({
        lat,
        lng
      });
      if (markerRef.current) {
        markerRef.current.setPosition({
          lat,
          lng
        });
        if (title) markerRef.current.setTitle(title);
      } else {
        markerRef.current = new google.maps.Marker({
          position: {
            lat,
            lng
          },
          map: mapRef.current,
          title
        });
      }
    }
    setShowMap(true);
  };
  const initAutocomplete = () => {
    const google = (window as any).google;
    if (!google?.maps?.places) return;
    const selectedCity = form.getValues('city');
    const getCityBounds = (city: string) => {
      // Define approximate bounds for major Indian cities
      const cityBounds: {
        [key: string]: {
          northeast: {
            lat: number;
            lng: number;
          };
          southwest: {
            lat: number;
            lng: number;
          };
        };
      } = {
        'Bangalore': {
          northeast: {
            lat: 13.173,
            lng: 77.727
          },
          southwest: {
            lat: 12.864,
            lng: 77.465
          }
        },
        'Mumbai': {
          northeast: {
            lat: 19.270,
            lng: 72.978
          },
          southwest: {
            lat: 18.892,
            lng: 72.776
          }
        },
        'Delhi': {
          northeast: {
            lat: 28.884,
            lng: 77.347
          },
          southwest: {
            lat: 28.404,
            lng: 76.838
          }
        },
        'Pune': {
          northeast: {
            lat: 18.640,
            lng: 73.993
          },
          southwest: {
            lat: 18.412,
            lng: 73.739
          }
        },
        'Chennai': {
          northeast: {
            lat: 13.233,
            lng: 80.348
          },
          southwest: {
            lat: 12.834,
            lng: 80.117
          }
        },
        'Hyderabad': {
          northeast: {
            lat: 17.567,
            lng: 78.658
          },
          southwest: {
            lat: 17.271,
            lng: 78.220
          }
        },
        'Gurgaon': {
          northeast: {
            lat: 28.504,
            lng: 77.113
          },
          southwest: {
            lat: 28.402,
            lng: 76.828
          }
        },
        'Noida': {
          northeast: {
            lat: 28.595,
            lng: 77.391
          },
          southwest: {
            lat: 28.570,
            lng: 77.359
          }
        },
        'Faridabad': {
          northeast: {
            lat: 28.432,
            lng: 77.342
          },
          southwest: {
            lat: 28.360,
            lng: 77.299
          }
        },
        'Ghaziabad': {
          northeast: {
            lat: 28.686,
            lng: 77.449
          },
          southwest: {
            lat: 28.654,
            lng: 77.412
          }
        },
        'Greater Noida': {
          northeast: {
            lat: 28.496,
            lng: 77.536
          },
          southwest: {
            lat: 28.464,
            lng: 77.504
          }
        }
      };
      return cityBounds[city];
    };
    const bounds = selectedCity ? getCityBounds(selectedCity) : null;
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: {
        country: 'in' as const
      },
      ...(bounds && {
        bounds: new google.maps.LatLngBounds(bounds.southwest, bounds.northeast)
      })
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
        form.setValue('locality', value, {
          shouldValidate: true
        });
      }

      // Parse address components to extract city, state, and pincode
      if (place?.address_components) {
        let detectedCity = '';
        let state = '';
        let pincode = '';
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

        // Validate if detected city matches selected city
        const selectedCity = form.getValues('city');
        if (selectedCity && detectedCity) {
          const cityAliases: {
            [key: string]: string[];
          } = {
            'Bangalore': ['Bengaluru', 'Bangalore'],
            'Mumbai': ['Mumbai', 'Bombay'],
            'Delhi': ['Delhi', 'New Delhi'],
            'Pune': ['Pune', 'Poona'],
            'Chennai': ['Chennai', 'Madras'],
            'Hyderabad': ['Hyderabad', 'Secunderabad'],
            'Gurgaon': ['Gurgaon', 'Gurugram'],
            'Noida': ['Noida'],
            'Faridabad': ['Faridabad'],
            'Ghaziabad': ['Ghaziabad'],
            'Greater Noida': ['Greater Noida']
          };
          const selectedCityAliases = cityAliases[selectedCity] || [selectedCity];
          const isValidCity = selectedCityAliases.some(alias => detectedCity.toLowerCase().includes(alias.toLowerCase()) || alias.toLowerCase().includes(detectedCity.toLowerCase()));
          if (!isValidCity) {
            setLocationMismatchWarning(`Please select another locality in ${selectedCity.toLowerCase()}`);
            // Clear the locality field
            form.setValue('locality', '', {
              shouldValidate: true
            });
            el.value = '';
            return;
          } else {
            setLocationMismatchWarning('');
          }
        }

        // Update the form fields
        if (state) form.setValue('state', state, {
          shouldValidate: true
        });
        if (pincode) form.setValue('pincode', pincode, {
          shouldValidate: true
        });
      }
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

  // Watch for city changes and reinitialize autocomplete
  useEffect(() => {
    const subscription = form.watch((value, {
      name
    }) => {
      if (name === 'city') {
        setLocationMismatchWarning('');
        // Clear locality when city changes
        form.setValue('locality', '', {
          shouldValidate: false
        });
        if (localityInputRef.current) {
          localityInputRef.current.value = '';
        }
        // Reinitialize autocomplete when city changes
        const reinitialize = async () => {
          try {
            await loadGoogleMaps();
            initAutocomplete();
          } catch (error) {
            console.error('Failed to reinitialize autocomplete:', error);
          }
        };
        setTimeout(reinitialize, 100);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  const onSubmit = (data: ResaleLocationData) => {
    // Convert to LocationDetails format and include parsed city, state, pincode
    const locationData: LocationDetails = {
      state: data.state || '',
      city: data.city || '',
      locality: data.locality || '',
      landmark: data.landmark || '',
      pincode: data.pincode || '',
      societyName: initialData.societyName || ''
    };
    console.log('ResaleLocationDetailsStep submitting:', locationData);
    onNext(locationData);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl mb-6 font-semibold text-red-600">Location Details</h1>

      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* City Selection */}
          <FormField control={form.control} name="city" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-sm font-medium">City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </FormItem>} />

          {/* Locality/Area and Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="locality" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Locality/Area *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Search 'Bellandur, Bengaluru, Karnataka'..." className="h-12 pl-10" {...field} ref={el => {
                  field.ref(el);
                  localityInputRef.current = el;
                }} />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {locationMismatchWarning && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-sm font-bold">✕</span>
                      </div>
                      <p className="text-sm text-red-600">{locationMismatchWarning}</p>
                    </div>}
                </FormItem>} />

            <FormField control={form.control} name="landmark" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-sm font-medium">Landmark (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Near Metro Station" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>

          {showMap && <div className="w-full h-64 md:h-80 rounded-lg border overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 md:pt-6" style={{
          visibility: 'hidden'
        }}>
            <Button type="button" variant="outline" onClick={onBack} className="h-10 px-4 md:h-12 md:px-8">
              {!isMobile && <ArrowLeft className="h-4 w-4 mr-2" />}
              Back
            </Button>
            <Button type="submit" className="h-10 px-4 md:h-12 md:px-8">
              Save & Continue
              {!isMobile && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>;
};