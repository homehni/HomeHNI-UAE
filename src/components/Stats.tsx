
import { Home, Users, Building, Award } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

const Stats = () => {
  const { content: cmsContent } = useCMSContent('stats');
  const defaultStats = [
    {
      icon: Home,
      number: '1000+',
      label: 'Properties Listed',
      color: 'text-brand-red'
    },
    {
      icon: Users,
      number: '1000+',
      label: 'Happy Customers',
      color: 'text-brand-maroon'
    },
    {
      icon: Building,
      number: '7+',
      label: 'Countries Covered',
      color: 'text-brand-red'
    },
    {
      icon: Award,
      number: '50+',
      label: 'Awards Won',
      color: 'text-brand-maroon'
    }
  ];

  const content = cmsContent?.content as any;
  const stats = (() => {
    // If CMS provides an array of stats, normalize and use it
    if (Array.isArray(content?.stats) && content.stats.length) {
      return content.stats.map((s: any, idx: number) => ({
        icon: defaultStats[idx]?.icon || Home,
        number: s.number ?? s.value ?? defaultStats[idx]?.number,
        label: s.label ?? defaultStats[idx]?.label,
        color: defaultStats[idx]?.color || defaultStats[idx]?.color,
      }));
    }

    // Otherwise, support flat fields edited in the Visual Page Builder
    if (content) {
      const mapping = [
        { key: 'PropertiesListed', label: 'Properties Listed' },
        { key: 'HappyCustomers', label: 'Happy Customers' },
        { key: 'CountriesCovered', label: 'Countries Covered' },
        { key: 'AwardsWon', label: 'Awards Won' },
      ];

      return mapping.map((m, idx) => ({
        icon: defaultStats[idx].icon,
        number: content[m.key] ?? content[m.key.toLowerCase()] ?? defaultStats[idx].number,
        label: content[`${m.key}Label`] ?? m.label,
        color: defaultStats[idx].color,
      }));
    }

    // Fallback to defaults
    return defaultStats;
  })();

  return (
    <section className="hidden md:block py-8 bg-gradient-to-r from-[#800000] to-[#700000]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
