import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });
  const {
    signInWithPassword,
    user
  } = useAuth();
  const {
    isAdmin
  } = useAdminAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter both email and password' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithPassword(email, password);
      setMessage({ type: 'success', text: 'Signed in successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-2 border-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Home HNI Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {/* Message Display */}
            {message.type && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </> : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
}
