import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Home, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';

export const Auth: React.FC = () => {
  const { user, profile, signInWithGoogle, signInWithPassword, signUpWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user && profile) {
      // Check if user needs to select a role (first time setup)
      if (profile.role === 'buyer' || profile.role === 'seller') {
        const urlParams = new URLSearchParams(location.search);
        const redirectPath = urlParams.get('redirectTo');
        navigate(redirectPath ? redirectPath : '/', { replace: true });
      } else {
        setShowRoleModal(true);
      }
    }
  }, [user, profile, navigate, location]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPassword(signInForm.email, signInForm.password);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (signUpForm.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signUpWithPassword(signUpForm.email, signUpForm.password, signUpForm.fullName);
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

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
              
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
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
                  Join Home HNI to start your property journey
                </CardDescription>
              </div>
              
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                      placeholder="Create a password (min 6 characters)"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Create Account
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
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

      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onComplete={() => setShowRoleModal(false)} 
      />
    </div>
  );
};