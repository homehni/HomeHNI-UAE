import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Mail, CheckCircle } from 'lucide-react';

export const PostProperty: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  useEffect(() => {
    if (user && user.email_confirmed_at) {
      setShowWhatsAppModal(true);
    }
  }, [user]);

  const handleContinueToForm = () => {
    setShowWhatsAppModal(false);
    navigate('/post-property/form');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!user.email_confirmed_at) {
    navigate('/verify-email');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Building className="h-12 w-12 text-brand-red" />
            </div>
            <CardTitle className="text-3xl">List Your Property</CardTitle>
            <CardDescription>
              Welcome back! Your email is verified and you're ready to list your property.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Email Verified</div>
                <div className="text-sm text-green-600">{user.email}</div>
              </div>
            </div>
            
            <div className="text-center text-muted-foreground">
              Choose how you'd like to proceed with listing your property.
            </div>
          </CardContent>
        </Card>
      </div>

      <WhatsAppModal
        open={showWhatsAppModal}
        onOpenChange={setShowWhatsAppModal}
        onContinueToForm={handleContinueToForm}
      />
    </div>
  );
};