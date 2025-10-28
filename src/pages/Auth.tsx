import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  // Simple form states for Sign Up
  const [signUpData, setSignUpData] = useState({
    displayName: '',
    email: '',
    password: ''
  });

  // Simple form states for Sign In  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check URL params for mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpData.displayName.trim() || signUpData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }
    
    if (!signUpData.email.trim() || !signUpData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!signUpData.password || signUpData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signInData.email.trim() || !signInData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!signInData.password || signInData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUp()) {
      toast({
        title: "Validation Error",
        description: "Please check your input fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp(signUpData.email, signUpData.password, signUpData.displayName);
      if (!error) {
        toast({
          title: "Success!",
          description: "Check your email to confirm your account",
        });
        setIsSignUp(false);
        setSignUpData({ displayName: '', email: '', password: '' });
      }
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignIn()) {
      toast({
        title: "Validation Error", 
        description: "Please check your input fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      if (!error) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">DigitalTwin</h1>
          </div>
          <p className="text-muted-foreground">
            Industrial IoT & Digital Twin Platform
          </p>
        </div>

        <Card className="card-enterprise">
          <CardHeader className="text-center">
            <CardTitle>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Sign up to get started with your digital twin platform'
                : 'Sign in to your account to continue'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isSignUp ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.displayName}
                    onChange={(e) => {
                      setSignUpData(prev => ({...prev, displayName: e.target.value}));
                      if (errors.displayName) {
                        setErrors(prev => ({...prev, displayName: ''}));
                      }
                    }}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-destructive">{errors.displayName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signUpEmail">Email</Label>
                  <Input
                    id="signUpEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={signUpData.email}
                    onChange={(e) => {
                      setSignUpData(prev => ({...prev, email: e.target.value}));
                      if (errors.email) {
                        setErrors(prev => ({...prev, email: ''}));
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signUpPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signUpPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData(prev => ({...prev, password: e.target.value}));
                        if (errors.password) {
                          setErrors(prev => ({...prev, password: ''}));
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-enterprise" 
                  disabled={submitting}
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signInEmail">Email</Label>
                  <Input
                    id="signInEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={signInData.email}
                    onChange={(e) => {
                      setSignInData(prev => ({...prev, email: e.target.value}));
                      if (errors.email) {
                        setErrors(prev => ({...prev, email: ''}));
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signInPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signInPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData(prev => ({...prev, password: e.target.value}));
                        if (errors.password) {
                          setErrors(prev => ({...prev, password: ''}));
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-enterprise" 
                  disabled={submitting}
                >
                  {submitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            )}

            <Separator />
            
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setSignInData({ email: '', password: '' });
                  setSignUpData({ displayName: '', email: '', password: '' });
                  setErrors({});
                }}
                disabled={submitting}
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center space-y-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Demo Platform
            </Badge>
            <p className="text-sm text-muted-foreground">
              Create an account to access the industrial IoT platform features
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}