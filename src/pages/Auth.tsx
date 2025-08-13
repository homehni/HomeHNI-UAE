import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chrome, Home, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export const Auth: React.FC = () => {
  const { user, signInWithGoogle, signInWithPassword, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirectTo');
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

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInLoading(true);
    try {
      await signInWithPassword(signInEmail, signInPassword);
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirectTo');
      navigate(redirectPath ? redirectPath : '/', { replace: true });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setSignInLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignUpLoading(true);
    try {
      await signUpWithEmail(signUpEmail, signUpPassword);
      toast({
        title: "Verify your email",
        description: "We sent a verification link to your inbox.",
      });
      setActiveTab('signin');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      {/* Marquee at the very top */}
      <Marquee />
      {/* Header overlapping with content */}
      <Header />
      {/* Auth content with proper spacing */}
      <div className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-brand-red shadow-lg shadow-brand-red/20">
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
                  Sign in to access your account and all features
                </CardDescription>
              </div>
              
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signInLoading}>
                  {signInLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative text-center text-sm text-muted-foreground">
                <span className="px-2 bg-background relative z-10">or</span>
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
                  Join Home HNI to access all features and connect with buyers
                </CardDescription>
              </div>

              <form onSubmit={handleEmailSignUp} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signUpLoading}>
                  {signUpLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="relative text-center text-sm text-muted-foreground">
                <span className="px-2 bg-background relative z-10">or</span>
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
    </div>
  );
};