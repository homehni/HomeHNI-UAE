import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployeeRole } from '@/hooks/useEmployeeRole';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Home, UserPlus, LogIn, Eye, EyeOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import Index from './Index';

// Auth component with separate password visibility states
export const Auth: React.FC = () => {
  const { user, profile, signInWithGoogle, signInWithPassword, signUpWithPassword } = useAuth();
  const { isFinanceAdmin, isHRAdmin, isEmployee, loading: employeeLoading } = useEmployeeRole();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    return mode === 'signup' ? 'signup' : 'signin';
  });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user && !employeeLoading && !adminLoading) {
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirectTo');
      
      // Check if user is an employee first
      if (isEmployee) {
        if (isFinanceAdmin) {
          navigate('/admin/finance', { replace: true });
          return;
        } else if (isHRAdmin) {
          navigate('/admin/hr', { replace: true });
          return;
        } else {
          // Other employee types - redirect to general employee dashboard
          navigate('/admin', { replace: true });
          return;
        }
      }
      
      // Check if user is a full admin
      if (isAdmin) {
        navigate('/admin', { replace: true });
        return;
      }
      
      if (profile) {
        // Profile exists, check if user needs to select a role
        const validRoles = ['buyer', 'seller', 'agent', 'builder'];
        if (!validRoles.includes(profile.role)) {
          setShowRoleModal(true);
        } else {
          // User has a valid role, redirect them
          navigate(redirectPath ? redirectPath : '/', { replace: true });
        }
      } else {
        // Profile doesn't exist yet (first-time user) - show role selection
        setTimeout(() => {
          if (!profile) {
            setShowRoleModal(true);
          }
        }, 1000); // Wait 1 second for profile to load
      }
    }
  }, [user, profile, isEmployee, isFinanceAdmin, isHRAdmin, isAdmin, employeeLoading, adminLoading, navigate, location]);

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
      
      // Switch to signin tab and pre-fill email
      setSignInForm({ email: signUpForm.email, password: '' });
      setActiveTab('signin');
      
      toast({
        title: "Account created successfully!",
        description: "You can now login with your credentials.",
      });
      
      // Clear signup form
      setSignUpForm({ fullName: '', email: '', password: '', confirmPassword: '' });
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

  const handleCloseModal = () => {
    navigate('/');
  };

  return (
    <>
      {/* Background: render the actual homepage behind the modal (no extra images) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Index />
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop - Dark overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        ></div>
        
        {/* Modal Content */}
        <div className="relative w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/95 border-2 border-brand-red/30 shadow-2xl shadow-brand-red/10 rounded-2xl animate-fade-in hover:border-brand-red/50 transition-colors duration-300">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
            <CardHeader className="text-center pb-3 pt-4">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/lovable-uploads/b90cb5cf-9777-4b49-b4e5-6fb3a504a2b0.png?v=1"
                  alt="Home HNI Logo" 
                  className="h-12 w-auto"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/80 p-1 rounded-xl">
                  <TabsTrigger value="signin" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <LogIn size={16} />
                    <span>Login</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <UserPlus size={16} />
                    <span>Sign Up</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={signInForm.email}
                          onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                          placeholder="Enter your email"
                          required
                          autoComplete="email"
                          className="h-10 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20"
                        />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showSignInPassword ? "text" : "password"}
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                          className="h-10 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                        >
                          {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-10 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark hover:shadow-lg transition-all duration-200">
                      Login
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    className="w-full h-10 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    variant="outline"
                  >
                    <Chrome className="h-4 w-4 mr-2 text-red-500" />
                    Continue with Google
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-3">
                  <div className="text-center">
                    <CardTitle className="text-xl font-semibold text-gray-800">Create Account</CardTitle>
                    <CardDescription className="mt-1 text-gray-600 text-sm">
                      Join Home HNI to start your property journey
                    </CardDescription>
                  </div>
                  
                  <form onSubmit={handleEmailSignUp} className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signUpForm.fullName}
                        onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                        autoComplete="name"
                        className="h-9 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        className="h-9 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignUpPassword ? "text" : "password"}
                          value={signUpForm.password}
                          onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                          placeholder="Create a password (min 6 characters)"
                          required
                          autoComplete="new-password"
                          className="h-9 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1.5 h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                          {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signUpForm.confirmPassword}
                          onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          required
                          autoComplete="new-password"
                          className="h-9 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1.5 h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-9 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark hover:shadow-lg transition-all duration-200 mt-3">
                      Create Account
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    className="w-full h-9 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    variant="outline"
                  >
                    <Chrome className="h-4 w-4 mr-2 text-red-500" />
                    Sign up with Google
                  </Button>
                </TabsContent>
              </Tabs>
              
             <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
  By continuing, you agree to our{" "}
  <Link 
    to="/terms-and-conditions" 
    className="text-brand-red hover:underline cursor-pointer"
  >
    Terms of Service
  </Link>{" "}
  and{" "}
  <Link 
    to="/privacy-policy" 
    className="text-brand-red hover:underline cursor-pointer"
  >
    Privacy Policy
  </Link>
</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onComplete={() => {
          setShowRoleModal(false);
          // After role selection, redirect to intended page
          const urlParams = new URLSearchParams(location.search);
          const redirectPath = urlParams.get('redirectTo');
          navigate(redirectPath ? redirectPath : '/', { replace: true });
        }} 
      />
    </>
  );
};