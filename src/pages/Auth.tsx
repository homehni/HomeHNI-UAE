import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chrome, Home, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirect');
      navigate(redirectPath ? redirectPath : '/', { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-brand-red mr-2" />
            <span className="text-2xl font-bold text-brand-red">Home HNI</span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="flex items-center space-x-2">
                <LogIn size={16} />
                <span>Sign In</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center space-x-2">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="mt-2">
                  {location.search.includes('redirect=property-form') 
                    ? 'Sign in to list your property and access all features'
                    : 'Sign in to access your property listings and dashboard'
                  }
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full"
                variant="outline"
                size="lg"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="text-center">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="mt-2">
                  {location.search.includes('redirect=property-form') 
                    ? 'Create an account to list your property and access all features'
                    : 'Join Home HNI to list your property and connect with buyers'
                  }
                </CardDescription>
              </div>
              
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full"
                variant="outline"
                size="lg"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Sign up with Google
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
};