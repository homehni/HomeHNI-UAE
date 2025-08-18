import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { ProfileForm } from '@/components/ProfileForm';

export const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <Marquee />
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <ProfileForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};