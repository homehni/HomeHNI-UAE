import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Bell, User, Settings, LogOut, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminHeader = () => {
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'Admin User';

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden text-gray-700 hover:text-brand-red" />
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Manage your real estate platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-brand-red font-medium"
          >
            <Home className="h-4 w-4 mr-2" />
            View Site
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url} 
                    alt={displayName}
                  />
                  <AvatarFallback className="bg-brand-red text-white font-semibold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end">
              <DropdownMenuLabel className="font-normal bg-gray-50">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-gray-600">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    <Badge 
                      variant={userRole === 'admin' || userRole === 'superadmin' ? 'default' : 'secondary'}
                      className="text-xs bg-brand-red text-white"
                    >
                      {userRole?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
