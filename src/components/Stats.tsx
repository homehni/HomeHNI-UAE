
import { Home, Users, Building, Award } from 'lucide-react';
import { useCMSContent } from '@/hooks/useCMSContent';

const Stats = () => {
  const { content: cmsContent } = useCMSContent('stats');
  const defaultStats = [
    {
      icon: Home,
      number: '1,000+',
      label: 'Properties Listed',
      color: 'text-brand-red'
    },
    {
      icon: Users,
      number: '10,00+',
      label: 'Happy Customers',
      color: 'text-brand-maroon'
    },
    {
      icon: Building,
      number: '15+',
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

  const stats = cmsContent?.content?.stats || defaultStats;

  return (
    <section className="py-16 gradient-red-maroon">
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
