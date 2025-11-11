import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });
  
  const { user, isAdmin, signIn } = useAuth();

  // Redirect to admin dashboard if already logged in as admin
  if (user && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  // Redirect to home if logged in as non-admin
  if (user && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    const { error } = await signIn(email, password);
    
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Authentication failed. Please check your credentials.' });
    } else {
      setMessage({ type: 'success', text: 'Signed in successfully! Redirecting...' });
      // Navigation will be handled by the useAuth hook and redirects above
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-brand-red" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign in to access the administrative dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Message Display */}
            {message.type && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}
            
            <Button
              type="submit" 
              className="w-full bg-brand-red hover:bg-brand-maroon-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In to Admin Portal'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Main Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
