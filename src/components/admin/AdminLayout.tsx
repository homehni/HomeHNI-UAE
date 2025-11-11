import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import RoleBasedSidebar from './RoleBasedSidebar';
import AdminHeader from './AdminHeader';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLayout = () => {
  const { isEmployee } = useEmployeeRole();
  const { isAdmin } = useAdminAuth();

  // Show role-based sidebar for employees, full admin sidebar for full admins
  const SidebarComponent = (isEmployee && !isAdmin) ? RoleBasedSidebar : AdminSidebar;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <SidebarComponent />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
