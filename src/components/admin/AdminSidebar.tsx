import { useLocation, NavLink } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Home,
  Settings,
  FileText,
  MessageSquare,
  MapPin,
  Shield,
  Star,
  Globe,
  Menu,
  Building2,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Logo from '@/components/Logo';

const navigationItems = [
  {
    title: 'Overview',
    url: '/admin',
    icon: BarChart3,
    group: 'Main',
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
    group: 'Main',
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: TrendingUp,
    group: 'Main',
  },
  {
    title: 'Listings Management',
    url: '/admin/listings',
    icon: Building2,
    group: 'Content',
  },
  {
    title: 'Lead Management',
    url: '/admin/leads',
    icon: MessageSquare,
    group: 'Content',
  },
  {
    title: 'Featured Properties',
    url: '/admin/featured-properties',
    icon: Star,
    group: 'Content',
  },
  {
    title: 'Page Management',
    url: '/admin/pages',
    icon: FileText,
    group: 'Website',
  },
  {
    title: 'Website Content',
    url: '/admin/content',
    icon: Globe,
    group: 'Website',
  },
  {
    title: 'Regions & Localization',
    url: '/admin/regions',
    icon: MapPin,
    group: 'Configuration',
  },
  {
    title: 'Security & Audit',
    url: '/admin/security',
    icon: Shield,
    group: 'Configuration',
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
    group: 'Configuration',
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar className="w-64 border-r bg-white">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Logo size="small" />
          <div>
            <h2 className="font-bold text-lg text-gray-900">Admin Portal</h2>
            <p className="text-xs text-gray-600">Real Estate Platform</p>
          </div>
        </div>
      </div>

      <SidebarContent className="bg-white">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName} className="px-3 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === '/admin'}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-brand-red text-white shadow-sm'
                              : 'text-gray-900 hover:bg-gray-100 hover:text-brand-red'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;