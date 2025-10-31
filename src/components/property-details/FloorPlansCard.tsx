import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';
import units3D1 from '@/assets/floor-plans/3d-units-1.jpg';
import units3D2 from '@/assets/floor-plans/3d-units-2.jpg';
import masterPlan from '@/assets/floor-plans/master-plan.jpg';
import clubFloorPlan from '@/assets/floor-plans/club-floor-plan.jpg';
import typicalFloorPlan from '@/assets/floor-plans/typical-floor-plan.jpg';

interface FloorPlansCardProps {
  propertyType?: string;
}

export const FloorPlansCard: React.FC<FloorPlansCardProps> = ({ propertyType }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const floorPlans = [
    { id: '3d-1', src: units3D1, title: '3D Unit Layouts', category: 'units' },
    { id: '3d-2', src: units3D2, title: '3D Unit Plans', category: 'units' },
    { id: 'master', src: masterPlan, title: 'Master Plan', category: 'site' },
    { id: 'club', src: clubFloorPlan, title: 'Club Floor Plan', category: 'amenities' },
    { id: 'typical', src: typicalFloorPlan, title: 'Typical Floor Plan', category: 'site' },
  ];

  const unitPlans = floorPlans.filter(plan => plan.category === 'units');
  const sitePlans = floorPlans.filter(plan => plan.category === 'site');
  const amenityPlans = floorPlans.filter(plan => plan.category === 'amenities');

  const ImageCard = ({ src, title }: { src: string; title: string }) => (
    <div className="relative group cursor-pointer" onClick={() => setSelectedImage(src)}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-md transition-all hover:shadow-xl">
        <img 
          src={src} 
          alt={title}
          className="w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground text-center">{title}</p>
    </div>
  );

  return (
    <>
      <Card className="bg-card rounded-lg border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Floor Plans & Layouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="units">Unit Layouts</TabsTrigger>
              <TabsTrigger value="site">Site Plans</TabsTrigger>
              <TabsTrigger value="amenities">Clubhouse</TabsTrigger>
            </TabsList>

            <TabsContent value="units" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unitPlans.map(plan => (
                  <ImageCard key={plan.id} src={plan.src} title={plan.title} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="site" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sitePlans.map(plan => (
                  <ImageCard key={plan.id} src={plan.src} title={plan.title} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                {amenityPlans.map(plan => (
                  <ImageCard key={plan.id} src={plan.src} title={plan.title} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-2">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Floor plan" 
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
