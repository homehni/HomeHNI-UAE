import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// Note: This section currently uses only UI data passed from the parent.

type UiProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  propertyType: string; // e.g., "Agricultural Land", "Industrial Land", "Commercial Land", "Residential Plot"
};

interface Props {
  properties: UiProperty[];
}

function formatLabel(label: string) {
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

const LandPlotSection = ({ properties }: Props) => {
  const groups = useMemo(() => {
    const g: Record<string, UiProperty[]> = {
      'Agricultural Land': [],
      'Industrial Land': [],
      'Commercial Land': [],
    };
    for (const p of properties) {
      const type = (p.propertyType || '').toLowerCase();
      if (type.includes('agricultural') && type.includes('land')) g['Agricultural Land'].push(p);
      else if (type.includes('industrial') && type.includes('land')) g['Industrial Land'].push(p);
      else if (type.includes('commercial') && type.includes('land')) g['Commercial Land'].push(p);
      // Any other land/plot types will be shown under "Commercial Land" as fallback for now
    }
    return g;
  }, [properties]);

  // Minimal feature list for now; can be extended to fetch land-specific fields later
  const renderBasicInfo = (prop: UiProperty) => {
    return (
      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Type</Badge>
          <span>{prop.propertyType}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Area</Badge>
          <span>{prop.area}</span>
        </div>
      </div>
    );
  };

  const sectionOrder = ['Agricultural Land', 'Industrial Land', 'Commercial Land'] as const;

  return (
    <div className="space-y-10">
      {sectionOrder.map((sectionKey) => {
        const items = groups[sectionKey];
        if (!items || items.length === 0) return null;
        return (
          <section key={sectionKey} aria-labelledby={`section-${sectionKey.replace(/\s+/g, '-')}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 id={`section-${sectionKey.replace(/\s+/g, '-')}`} className="text-xl font-semibold">{sectionKey}</h2>
              <Badge>{items.length}</Badge>
            </div>
            <Separator className="mb-4" />
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                return (
                  <Card key={p.id} className="overflow-hidden border border-red-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base leading-tight line-clamp-2">{p.title || p.propertyType}</CardTitle>
                      <div className="text-sm text-muted-foreground">{p.location}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">{p.price}</div>
                        <div className="text-muted-foreground">{p.area}</div>
                      </div>
                      {renderBasicInfo(p)}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default LandPlotSection;
