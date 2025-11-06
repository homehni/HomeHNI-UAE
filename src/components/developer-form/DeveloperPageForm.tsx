import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/property-form/ImageUpload";
import { VideoUpload } from "@/components/property-form/VideoUpload";
import { Building2, MapPin, Mail, Phone, Globe, Award, Image as ImageIcon, Video, Info } from "lucide-react";

interface DeveloperPageFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const DeveloperPageForm = ({ onSubmit, isSubmitting }: DeveloperPageFormProps) => {
  const [aboutImages, setAboutImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroVideo, setHeroVideo] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      companyName: "",
      tagline: "",
      description: "",
      headquarters: "",
      foundedYear: "",
      heroTitle: "",
      heroSubtitle: "",
      heroCTAText: "",
      highlights: "",
      aboutTitle: "",
      aboutContent: "",
      videoSectionTitle: "",
      videoSectionSubtitle: "",
      stats: "",
      specializations: "",
      keyProjects: "",
      awards: "",
      floorPlans: "",
      amenities: "",
      locationTitle: "",
      locationDescription: "",
      locationMapUrl: "",
      locationHighlights: "",
      contactPhone: "",
      contactEmail: "",
      contactWebsite: "",
      contactAddress: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isPublished: true,
      // Property-specific fields
      priceMin: "",
      priceMax: "",
      priceUnit: "Lacs",
      pricePerSqft: "",
      configurations: "",
      projectArea: "",
      totalUnits: "",
      status: "",
      possession: "",
      rera: "",
      brochureLink: "",
      features: "",
      // New fields for dynamic content
      locationLat: "",
      locationLng: "",
      builderTitle: "",
      builderDescription: "",
      builderYearsInBusiness: ""
    }
  });
  
  const [interiorImages, setInteriorImages] = useState<File[]>([]);
  const [floorPlanImages, setFloorPlanImages] = useState<File[]>([]);
  const [builderImages, setBuilderImages] = useState<File[]>([]);

  const handleFormSubmit = (data: any) => {
    // Parse multi-line text fields into arrays
    const parseLines = (text: string) => text?.split('\n').filter(line => line.trim()) || [];
    
    // Parse configurations (e.g., "2 BHK - 1200 Sft" becomes {type: "2 BHK", sizes: ["1200 Sft"]})
    const parseConfigurations = (text: string) => {
      if (!text) return [];
      return text.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('-').map(p => p.trim());
        return {
          type: parts[0] || '',
          sizes: parts[1] ? [parts[1]] : []
        };
      });
    };
    
    onSubmit({
      ...data,
      highlights: parseLines(data.highlights),
      stats: parseLines(data.stats),
      specializations: parseLines(data.specializations),
      keyProjects: parseLines(data.keyProjects),
      awards: parseLines(data.awards),
      amenities: parseLines(data.amenities),
      locationHighlights: parseLines(data.locationHighlights),
      floorPlans: parseLines(data.floorPlans),
      metaKeywords: parseLines(data.metaKeywords),
      features: parseLines(data.features),
      configurations: parseConfigurations(data.configurations),
      logo: logo,
      heroImage: heroImage,
      heroVideo: heroVideo,
      aboutImages: aboutImages,
      galleryImages: galleryImages,
      video: video,
      videoThumbnail: videoThumbnail,
      interiorImages: interiorImages,
      floorPlanImages: floorPlanImages,
      builderImages: builderImages
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Fill in the sections below to create your developer showcase page. Each section corresponds to a part of the final page layout. 
              Fields marked with <span className="font-semibold">(Optional)</span> can be left empty if not needed.
            </p>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Company details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Canny Developers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Company Logo</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Building Dreams, Creating Landmarks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief company overview" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="headquarters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2010" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>Main banner content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Main headline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Subtitle</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Supporting text" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroCTAText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTA Button Text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Contact Us" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Hero Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>

            <div>
              <FormLabel>Hero Video (Optional)</FormLabel>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setHeroVideo(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>

            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Key highlights (one per line)" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Company Stats
            </CardTitle>
            <CardDescription>Key numbers and achievements (one per line, e.g., "280+ Projects Delivered")</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="stats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statistics</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="280+ Projects Delivered&#10;140M+ Sq Ft Developed&#10;35+ Years of Excellence&#10;50,000+ Happy Families" 
                      rows={6} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Section
            </CardTitle>
            <CardDescription>Tell your company story</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="aboutTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., About Us" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aboutContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Company story and details" rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>About Images (Optional)</FormLabel>
              <ImageUpload images={aboutImages} onImagesChange={setAboutImages} maxImages={10} />
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
            <CardDescription>Areas of expertise (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Premium Residential Projects&#10;Commercial Complexes&#10;Mixed-use Developments&#10;Hospitality Projects" 
                      rows={6} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Key Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Key Projects</CardTitle>
            <CardDescription>Major projects and developments (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="keyProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Projects</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Project Name - Description&#10;Luxury Apartments - Premium residential complex&#10;Tech Park - IT park and commercial space" 
                      rows={6} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Awards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Awards & Recognition
            </CardTitle>
            <CardDescription>Awards and certifications (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="awards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Awards</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Best Developer Award 2024&#10;Excellence in Architecture&#10;Green Building Certification&#10;Customer Satisfaction Award" 
                      rows={6} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="videoSectionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., See Our Projects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoSectionSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Section Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Supporting text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Video</FormLabel>
              <VideoUpload video={video} onVideoChange={setVideo} />
            </div>

            <div>
              <FormLabel>Video Thumbnail</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setVideoThumbnail(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Gallery & Floor Plans
            </CardTitle>
            <CardDescription>Project images and floor plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <FormLabel>Gallery Images (Optional)</FormLabel>
              <ImageUpload images={galleryImages} onImagesChange={setGalleryImages} maxImages={20} />
            </div>

            <FormField
              control={form.control}
              name="floorPlans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Plans (URLs, one per line)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://example.com/floorplan1.jpg&#10;https://example.com/floorplan2.jpg" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>Property amenities (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Clubhouse&#10;Swimming Pool&#10;Fitness Center&#10;Kids Play Area&#10;Landscaped Gardens&#10;24/7 Security" 
                      rows={8} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>Property location and nearby highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="locationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prime Location in Hyderabad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed location information" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationHighlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Highlights (one per line)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="5 mins to Airport&#10;Near IT Hub&#10;Close to Shopping Malls&#10;Schools nearby" 
                      rows={5} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="locationLat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 17.5428" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="locationLng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 78.4060" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Tip: Open <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Maps</a>, 
              right-click on your location, and copy the coordinates.
            </p>

            <FormField
              control={form.control}
              name="locationMapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Google Maps embed URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Interior Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Interior Images
            </CardTitle>
            <CardDescription>Upload apartment/interior images for the carousel</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload images={interiorImages} onImagesChange={setInteriorImages} maxImages={20} />
          </CardContent>
        </Card>

        {/* Floor Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Floor Plans</CardTitle>
            <CardDescription>Upload floor plan images</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload images={floorPlanImages} onImagesChange={setFloorPlanImages} maxImages={10} />
          </CardContent>
        </Card>

        {/* About the Builder */}
        <Card>
          <CardHeader>
            <CardTitle>About the Builder</CardTitle>
            <CardDescription>Separate from "About" section - focuses on the building company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="builderTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Builder Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Canny Life Spaces Pvt Ltd" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="builderYearsInBusiness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Business</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 25 Years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="builderDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Builder Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Company history and credentials" rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Builder Images</FormLabel>
              <ImageUpload images={builderImages} onImagesChange={setBuilderImages} maxImages={5} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="www.company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full office address" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Property Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Details (Optional)
            </CardTitle>
            <CardDescription>Add property-specific information if this is a property showcase page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priceMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Min</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Max</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lacs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pricePerSqft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Sq Ft</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 6381" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configurations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configurations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="One per line, format: Type - Size&#10;e.g.,&#10;2 BHK - 1285 Sft&#10;3 BHK - 1650 Sft" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Area</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1.52 Acres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Units</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 197" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ready to Move" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="possession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ready to move" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RERA Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., P02200003658" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brochureLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brochure Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="One per line&#10;e.g.,&#10;Premium location&#10;Modern architecture" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SEO & Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Publishing</CardTitle>
            <CardDescription>Search engine optimization and visibility settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Page title for search engines" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description for search results" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Keywords (Optional, one per line)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="real estate&#10;property developer&#10;luxury apartments" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish Page</FormLabel>
                    <div className="text-sm text-muted-foreground">Make this page visible to the public (enabled by default)</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Developer Page"}
        </Button>
      </form>
    </Form>
  );
};
