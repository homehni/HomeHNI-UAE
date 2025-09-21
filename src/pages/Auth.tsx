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
  
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  
  // Check for password recovery/reset mode immediately - needs to happen synchronously
  const urlParams = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));
  const isRecovery = hashParams.get('type') === 'recovery';
  const isResetMode = urlParams.get('mode') === 'reset-password' || isRecovery;
  
  // Password reset states
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(isResetMode);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    // Update password reset mode when location (including hash) changes
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    const isRecovery = hashParams.get('type') === 'recovery';
    setIsPasswordResetMode(mode === 'reset-password' || isRecovery);
  }, [location]);

  useEffect(() => {
    if (user && !employeeLoading && !adminLoading && !isPasswordResetMode) {
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
      
      // User is authenticated, redirect them to intended page or home
      navigate(redirectPath ? redirectPath : '/', { replace: true });
    }
  }, [user, profile, isEmployee, isFinanceAdmin, isHRAdmin, isAdmin, employeeLoading, adminLoading, navigate, location]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPassword(signInForm.email, signInForm.password);
    } catch (error: any) {
      const msg = (error?.message || '').toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
        // Offer verification path and resend the link automatically
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          await supabase.auth.resend({
            type: 'signup',
            email: signInForm.email,
            options: { emailRedirectTo: `${window.location.origin}/` }
          });
          toast({ title: 'Email not confirmed', description: 'We re-sent the verification link. Please check your inbox.', });
        } catch (_) {
          toast({ title: 'Email not confirmed', description: 'Please verify your email. We could not resend automatically.', variant: 'destructive' });
        }
      } else {
        toast({
          title: 'Sign in failed',
          description: error.message || 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
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
        title: "Check your email",
        description: "We've sent you a verification link. Please check your email and click the link to complete your registration.",
        variant: "default",
      });
      
      // Clear signup form
      setSignUpForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      console.log('Auth error caught:', error);
      
      // Handle specific error codes
      if (error.code === 'email_exists' || error.message?.includes('already registered')) {
        // Auto-switch to login tab and pre-fill email
        setSignInForm({ email: signUpForm.email, password: '' });
        setActiveTab('signin');
        
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please login or reset your password.",
          variant: "destructive",
        });
        return;
      }
      
      // Generic error handling
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "You can now login with your new password.",
      });

      // Reset form and redirect to login
      setNewPassword('');
      setConfirmNewPassword('');
      setIsPasswordResetMode(false);
      navigate('/auth', { replace: true });
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
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
              {isPasswordResetMode ? (
                // Password Reset Form
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <CardTitle className="text-xl font-semibold text-gray-800">Set New Password</CardTitle>
                    <CardDescription className="text-gray-600 text-sm mt-2">
                      Enter your new password below
                    </CardDescription>
                  </div>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                          required
                          autoComplete="new-password"
                          className="h-10 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="confirm-new-password" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-new-password"
                          type={showConfirmNewPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm your new password"
                          required
                          autoComplete="new-password"
                          className="h-10 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-gray-100"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                          {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="w-full h-10 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark hover:shadow-lg transition-all duration-200"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      className="text-sm text-gray-600 hover:text-brand-red p-0 h-auto"
                      onClick={() => {
                        setIsPasswordResetMode(false);
                        navigate('/auth', { replace: true });
                      }}
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              ) : (
                // Normal Login/Signup Tabs
                <>
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

                      <div className="text-center">
                        <Button 
                          variant="link" 
                          className="text-sm text-brand-red hover:underline p-0 h-auto"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>

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
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForgotPassword(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm">
            <Card className="backdrop-blur-sm bg-white/95 border-2 border-brand-red/30 shadow-2xl shadow-brand-red/10 rounded-2xl">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForgotPassword(false)}
                className="absolute right-4 top-4 z-10 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
              
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-xl font-semibold text-gray-800">Reset Password</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      className="h-10 rounded-xl border-gray-200 focus:border-brand-red focus:ring-brand-red/20"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      disabled={isResetLoading}
                      className="w-full h-10 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark hover:shadow-lg transition-all duration-200"
                    >
                      {isResetLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full h-10 rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};