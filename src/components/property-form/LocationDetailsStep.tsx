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
import { StickyFormNavigation } from './StickyFormNavigation';


const locationDetailsSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().optional(),
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
  const localityInputRef = useRef<HTMLInputElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationMismatchWarning, setLocationMismatchWarning] = useState<string>('');
  const form = useForm<LocationDetailsFormData>({
    resolver: zodResolver(locationDetailsSchema),
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
    
    const selectedCity = form.getValues('city');
    const getCityBounds = (city: string) => {
      // Define approximate bounds for major Indian cities
      const cityBounds: { [key: string]: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } } } = {
        'Bangalore': { northeast: { lat: 13.173, lng: 77.727 }, southwest: { lat: 12.864, lng: 77.465 } },
        'Mumbai': { northeast: { lat: 19.270, lng: 72.978 }, southwest: { lat: 18.892, lng: 72.776 } },
        'Delhi': { northeast: { lat: 28.884, lng: 77.347 }, southwest: { lat: 28.404, lng: 76.838 } },
        'Pune': { northeast: { lat: 18.640, lng: 73.993 }, southwest: { lat: 18.412, lng: 73.739 } },
        'Chennai': { northeast: { lat: 13.233, lng: 80.348 }, southwest: { lat: 12.834, lng: 80.117 } },
        'Hyderabad': { northeast: { lat: 17.567, lng: 78.658 }, southwest: { lat: 17.271, lng: 78.220 } },
        'Gurgaon': { northeast: { lat: 28.504, lng: 77.113 }, southwest: { lat: 28.402, lng: 76.828 } },
        'Noida': { northeast: { lat: 28.595, lng: 77.391 }, southwest: { lat: 28.570, lng: 77.359 } },
        'Faridabad': { northeast: { lat: 28.432, lng: 77.342 }, southwest: { lat: 28.360, lng: 77.299 } },
        'Ghaziabad': { northeast: { lat: 28.686, lng: 77.449 }, southwest: { lat: 28.654, lng: 77.412 } },
        'Greater Noida': { northeast: { lat: 28.496, lng: 77.536 }, southwest: { lat: 28.464, lng: 77.504 } }
      };
      return cityBounds[city];
    };

    const bounds = selectedCity ? getCityBounds(selectedCity) : null;
    
    const options = {
      fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      types: ['geocode'],
      componentRestrictions: { country: 'in' as const },
      ...(bounds && { bounds: new google.maps.LatLngBounds(bounds.southwest, bounds.northeast) })
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
        
        console.log('Google Places detected city:', detectedCity);
        console.log('Selected city from form:', form.getValues('city'));
        
        // Validate if detected city matches selected city
        const selectedCity = form.getValues('city');
        if (selectedCity && detectedCity) {
          const cityAliases: { [key: string]: string[] } = {
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
          const isValidCity = selectedCityAliases.some(alias => 
            detectedCity.toLowerCase().includes(alias.toLowerCase()) || 
            alias.toLowerCase().includes(detectedCity.toLowerCase())
          );
          
          console.log('City validation result:', isValidCity);
          
          if (!isValidCity) {
            console.log('Setting location mismatch warning');
            setLocationMismatchWarning(`Please select another locality in ${selectedCity.toLowerCase()}`);
            // Clear the locality field
            form.setValue('locality', '', { shouldValidate: true });
            el.value = '';
            return;
          } else {
            setLocationMismatchWarning('');
          }
        }
        
        // Update the form fields
        if (state) form.setValue('state', state, { shouldValidate: true });
        if (pincode) form.setValue('pincode', pincode, { shouldValidate: true });
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
    const subscription = form.watch((value, { name }) => {
      if (name === 'city') {
        setLocationMismatchWarning('');
        // Clear locality when city changes
        form.setValue('locality', '', { shouldValidate: false });
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
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 pb-24">
        <h1 className="text-2xl font-semibold text-primary mb-6">Location Details</h1>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
...
                  </form>
                </Form>
      </div>

      <StickyFormNavigation
        onBack={onBack}
        onNext={() => form.handleSubmit(onSubmit)()}
        nextButtonText="Save & Continue"
      />
    </>
  );
};