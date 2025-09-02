import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedPropertiesSkeleton = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8 md:mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      {/* Filter bar skeleton */}
      <div className="mb-6">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      
      {/* Property cards grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border overflow-hidden">
            <Skeleton className="h-24 w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-2" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const RealEstateSliderSkeleton = () => (
  <section className="pb-4 -mt-4 md:-mt-6 bg-gradient-to-br from-background to-secondary/20">
    <div className="container mx-auto px-4">
      <div className="relative max-w-6xl mx-auto">
        <div className="flex gap-4 overflow-x-auto px-4 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-none w-48 bg-card rounded-xl shadow-lg overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const HomeServicesSkeleton = () => (
  <section className="py-8 md:py-12 bg-white relative">
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center mb-6 md:mb-8">
        <Skeleton className="h-8 w-48" />
      </div>
      
      <div className="flex gap-6 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-60">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-48 overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="pt-2 px-4 text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const CustomerTestimonialsSkeleton = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg">
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const MobileAppSectionSkeleton = () => (
  <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <Skeleton className="h-8 w-3/4 mb-4 bg-white/20" />
          <Skeleton className="h-6 w-full mb-6 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 bg-white/20" />
            <Skeleton className="h-12 w-32 bg-white/20" />
          </div>
        </div>
        <div>
          <Skeleton className="h-64 w-full bg-white/20" />
        </div>
      </div>
    </div>
  </section>
);