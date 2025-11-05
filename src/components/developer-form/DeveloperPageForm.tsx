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
      heroCTAText: "Contact Us",
      highlights: "",
      aboutTitle: "About Us",
      aboutContent: "",
      videoSectionTitle: "",
      videoSectionSubtitle: "",
      stats: [],
      specializations: [],
      keyProjects: [],
      awards: [],
      floorPlans: [],
      amenities: [],
      locationTitle: "",
      locationDescription: "",
      locationMapUrl: "",
      locationHighlights: [],
      contactPhone: "",
      contactEmail: "",
      contactWebsite: "",
      contactAddress: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      isPublished: false
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      logo: logo,
      heroImage: heroImage,
      heroVideo: heroVideo,
      aboutImages: aboutImages,
      galleryImages: galleryImages,
      video: video,
      videoThumbnail: videoThumbnail
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Section
            </CardTitle>
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
              <FormLabel>About Images</FormLabel>
              <ImageUpload images={aboutImages} onImagesChange={setAboutImages} maxImages={10} />
            </div>
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
              Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload images={galleryImages} onImagesChange={setGalleryImages} maxImages={20} />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="locationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prime Location" {...field} />
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
                    <Textarea placeholder="Location details" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationMapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Google Maps embed URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
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
                      <Input placeholder="+91 XXXXXXXXXX" {...field} />
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
                    <Input placeholder="https://www.company.com" {...field} />
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
                    <Textarea placeholder="Full address" rows={3} {...field} />
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
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Page title for SEO" {...field} />
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
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Page description for SEO" rows={2} {...field} />
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
                    <div className="text-sm text-muted-foreground">Make this page visible to the public</div>
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
