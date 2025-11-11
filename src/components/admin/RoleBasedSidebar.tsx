import { useLocation, NavLink } from 'react-router-dom';
import {
  BarChart3,
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText,
  Calculator,
  Wallet,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Logo from '@/components/Logo';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  group: string;
  roles?: string[];
}

// Define navigation items for different roles
const financeNavigationItems: NavigationItem[] = [
  {
    title: 'Finance Overview',
    url: '/admin/finance',
    icon: BarChart3,
    group: 'Finance',
  },
  {
    title: 'Employee Payouts',
    url: '/admin/finance/payouts',
    icon: DollarSign,
    group: 'Finance',
  },
  {
    title: 'Transaction History',
    url: '/admin/finance/transactions',
    icon: CreditCard,
    group: 'Finance',
  },
  {
    title: 'Payroll Management',
    url: '/admin/finance/payroll',
    icon: Wallet,
    group: 'Finance',
  },
  {
    title: 'Financial Reports',
    url: '/admin/finance/reports',
    icon: FileText,
    group: 'Finance',
  },
];

const hrNavigationItems: NavigationItem[] = [
  {
    title: 'HR Overview',
    url: '/admin/hr',
    icon: BarChart3,
    group: 'HR',
  },
  {
    title: 'Employee Management',
    url: '/admin/employees',
    icon: Users,
    group: 'HR',
  },
];

const RoleBasedSidebar = () => {
  const location = useLocation();
  const { isFinanceAdmin, isHRAdmin, loading } = useEmployeeRole();
  const { isAdmin } = useAdminAuth();

  const getNavigationItems = (): NavigationItem[] => {
    if (isAdmin) {
      // Full admin gets all items
      return [...financeNavigationItems, ...hrNavigationItems];
    } else if (isFinanceAdmin) {
      return financeNavigationItems;
    } else if (isHRAdmin) {
      return hrNavigationItems;
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => {
    if (path === '/admin/finance') {
      return location.pathname === '/admin/finance';
    }
    if (path === '/admin/hr') {
      return location.pathname === '/admin/hr';
    }
    return location.pathname.startsWith(path);
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  if (loading) {
    return (
      <Sidebar collapsible="none" className="w-64 border-r bg-white text-gray-900">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            <Logo size="small" />
            <div>
              <h2 className="font-bold text-lg text-gray-900">Loading...</h2>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="none" className="w-64 border-r bg-white text-gray-900">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Logo size="small" />
          <div>
            <h2 className="font-bold text-lg text-gray-900">
              {isFinanceAdmin ? 'Finance Portal' : isHRAdmin ? 'HR Portal' : 'Admin Portal'}
            </h2>
            <p className="text-xs text-gray-600">
              {isFinanceAdmin ? 'Financial Management' : isHRAdmin ? 'Human Resources' : 'Management Portal'}
            </p>
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
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin/finance' || item.url === '/admin/hr'}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
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

export default RoleBasedSidebar;
