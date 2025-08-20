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
      <div className="pt-20 min-h-screen relative overflow-hidden">
        {/* Enhanced background with overlapping gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-red-50/30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center justify-center p-4 min-h-screen">
          <Card className="w-full max-w-2xl backdrop-blur-md bg-white/90 border-2 border-white/20 shadow-2xl shadow-brand-red/10 rounded-3xl animate-fade-in hover:shadow-3xl hover:shadow-brand-red/20 transition-all duration-500 transform hover:scale-[1.02]">
            <CardContent className="px-12 py-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-gray-100 to-gray-50 p-1.5 rounded-2xl h-14 shadow-inner">
                  <TabsTrigger value="signin" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-brand-red font-medium transition-all duration-300 h-11">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-brand-red font-medium transition-all duration-300 h-11">
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-8 animate-fade-in">
                  <div className="text-center space-y-3">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Welcome Back</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Sign in to access your account and all features
                    </CardDescription>
                  </div>
                  
                  <form onSubmit={handleEmailSignIn} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="signin-email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                        className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="signin-password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                          placeholder="Enter your password"
                          required
                          className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 pr-14 text-base transition-all duration-300 hover:border-gray-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-4 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-red via-brand-red to-brand-red-dark hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 text-base font-semibold transform hover:scale-[1.02]" size="lg">
                      Sign In
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-6 text-gray-500 font-semibold">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-base font-semibold transform hover:scale-[1.02]"
                    variant="outline"
                    size="lg"
                  >
                    <Chrome className="h-6 w-6 mr-3 text-red-500" />
                    Continue with Google
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-8 animate-fade-in">
                  <div className="text-center space-y-3">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Create Account</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Join Home HNI to start your property journey
                    </CardDescription>
                  </div>
                  
                  <form onSubmit={handleEmailSignUp} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          value={signUpForm.fullName}
                          onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          required
                          className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 text-base transition-all duration-300 hover:border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                          placeholder="Enter your email"
                          required
                          className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 text-base transition-all duration-300 hover:border-gray-300"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              value={signUpForm.password}
                              onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                              placeholder="Min 6 characters"
                              required
                              className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 pr-14 text-base transition-all duration-300 hover:border-gray-300"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-4 top-4 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={signUpForm.confirmPassword}
                              onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                              placeholder="Confirm password"
                              required
                              className="h-14 rounded-2xl border-2 border-gray-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 pr-14 text-base transition-all duration-300 hover:border-gray-300"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-4 top-4 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-red via-brand-red to-brand-red-dark hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 text-base font-semibold transform hover:scale-[1.02]" size="lg">
                      Create Account
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-6 text-gray-500 font-semibold">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-base font-semibold transform hover:scale-[1.02]"
                    variant="outline"
                    size="lg"
                  >
                    <Chrome className="h-6 w-6 mr-3 text-red-500" />
                    Sign up with Google
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="text-center text-sm text-gray-500 mt-10 pt-8 border-t-2 border-gray-100">
                By continuing, you agree to our <span className="text-brand-red hover:underline cursor-pointer font-medium transition-colors">Terms of Service</span> and <span className="text-brand-red hover:underline cursor-pointer font-medium transition-colors">Privacy Policy</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onComplete={() => setShowRoleModal(false)} 
      />
    </div>
  );
};