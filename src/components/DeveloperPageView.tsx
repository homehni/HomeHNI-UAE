import { DeveloperPage } from "@/hooks/useDeveloperPages";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, MapPin, Calendar } from "lucide-react";

interface DeveloperPageViewProps {
  developer: DeveloperPage;
}

export const DeveloperPageView = ({ developer }: DeveloperPageViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {(developer.hero_title || developer.hero_image_url || developer.hero_video_url) && (
        <section className="relative h-[60vh] min-h-[500px]">
          {developer.hero_video_url ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={developer.hero_video_url} type="video/mp4" />
            </video>
          ) : developer.hero_image_url ? (
            <img 
              src={developer.hero_image_url} 
              alt={developer.hero_title || developer.company_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start">
            {developer.logo_url && (
              <img 
                src={developer.logo_url} 
                alt={developer.company_name}
                className="h-20 w-auto mb-6 bg-white/10 backdrop-blur-sm p-4 rounded-lg"
              />
            )}
            
            {developer.hero_title && (
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {developer.hero_title}
              </h1>
            )}
            
            {developer.hero_subtitle && (
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                {developer.hero_subtitle}
              </p>
            )}
            
            {developer.highlights && (
              <p className="text-lg text-white/80 mb-8">
                {developer.highlights}
              </p>
            )}
            
            {developer.hero_cta_text && (
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {developer.hero_cta_text}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Stats Section */}
      {developer.stats && Array.isArray(developer.stats) && developer.stats.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {developer.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {(developer.about_title || developer.about_content || developer.description) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {developer.about_title || 'About Us'}
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  {developer.about_content && (
                    <p className="whitespace-pre-line">{developer.about_content}</p>
                  )}
                  {!developer.about_content && developer.description && (
                    <p>{developer.description}</p>
                  )}
                </div>
                
                {(developer.founded_year || developer.headquarters) && (
                  <div className="mt-6 space-y-2">
                    {developer.founded_year && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Founded: {developer.founded_year}</span>
                      </div>
                    )}
                    {developer.headquarters && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{developer.headquarters}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {developer.about_images && Array.isArray(developer.about_images) && developer.about_images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {developer.about_images.slice(0, 4).map((image: any, index: number) => (
                    <img 
                      key={index}
                      src={typeof image === 'string' ? image : image.url} 
                      alt={`About ${developer.company_name} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {developer.video_url && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            {developer.video_section_title && (
              <h2 className="text-3xl font-bold text-center mb-4">
                {developer.video_section_title}
              </h2>
            )}
            {developer.video_section_subtitle && (
              <p className="text-center text-muted-foreground mb-12">
                {developer.video_section_subtitle}
              </p>
            )}
            
            <div className="max-w-4xl mx-auto">
              <video 
                controls 
                poster={developer.video_thumbnail_url}
                className="w-full rounded-lg shadow-lg"
              >
                <source src={developer.video_url} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {developer.gallery_images && Array.isArray(developer.gallery_images) && developer.gallery_images.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {developer.gallery_images.map((image: any, index: number) => (
                <img 
                  key={index}
                  src={typeof image === 'string' ? image : image.url} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floor Plans */}
      {developer.floor_plans && Array.isArray(developer.floor_plans) && developer.floor_plans.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Floor Plans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developer.floor_plans.map((plan: any, index: number) => (
                <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={plan.image || plan.url} 
                    alt={plan.title || `Floor Plan ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  {plan.title && (
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{plan.title}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Amenities */}
      {developer.amenities && Array.isArray(developer.amenities) && developer.amenities.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {developer.amenities.map((amenity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">
                    {typeof amenity === 'string' ? amenity : amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {(developer.location_title || developer.location_description || developer.location_map_url) && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            {developer.location_title && (
              <h2 className="text-3xl font-bold mb-4 text-center">
                {developer.location_title}
              </h2>
            )}
            {developer.location_description && (
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {developer.location_description}
              </p>
            )}
            
            {developer.location_highlights && Array.isArray(developer.location_highlights) && developer.location_highlights.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {developer.location_highlights.map((highlight: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-card rounded-lg">
                    <h3 className="font-semibold mb-2">
                      {highlight.title || highlight.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description || highlight.distance}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {developer.location_map_url && (
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe 
                  src={developer.location_map_url} 
                  className="w-full h-full"
                  loading="lazy"
                  title="Location Map"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {(developer.contact_phone || developer.contact_email || developer.contact_website) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Contact Us</h2>
            <div className="max-w-2xl mx-auto grid md:grid-cols-3 gap-6">
              {developer.contact_phone && (
                <a 
                  href={`tel:${developer.contact_phone}`}
                  className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Phone className="h-8 w-8 text-primary" />
                  <span className="text-sm">{developer.contact_phone}</span>
                </a>
              )}
              
              {developer.contact_email && (
                <a 
                  href={`mailto:${developer.contact_email}`}
                  className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Mail className="h-8 w-8 text-primary" />
                  <span className="text-sm">{developer.contact_email}</span>
                </a>
              )}
              
              {developer.contact_website && (
                <a 
                  href={developer.contact_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Globe className="h-8 w-8 text-primary" />
                  <span className="text-sm break-all">{developer.contact_website}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
