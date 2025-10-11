import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

const MaintenanceGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const location = useLocation();

  // Allow admin routes regardless of maintenance
  const isAdmin = location.pathname.startsWith('/admin');
  if (settings.maintenance_mode && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">We'll be back soon</h1>
          <p className="text-muted-foreground mb-6">
            The site is currently under maintenance. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceGate;