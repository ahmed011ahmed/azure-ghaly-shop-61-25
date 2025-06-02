
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import EmailVerification from '@/components/EmailVerification';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!nickname.trim()) {
      toast({
        title: t('error.signup'),
        description: t('error.nickname.required'),
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting signup process for:', email);
      
      // Create user account with email confirmation DISABLED
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable automatic email
          data: {
            nickname: nickname,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('User already registered')) {
          toast({
            title: t('error.signup'),
            description: t('error.email.exists'),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('error.signup'),
            description: error.message,
            variant: 'destructive',
          });
        }
        setIsLoading(false);
        return;
      }

      console.log('User created successfully:', data.user?.id);

      // Generate verification code (6 digits)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send verification code
      const { data: codeData, error: codeError } = await supabase.functions.invoke('send-verification-code', {
        body: { 
          email, 
          code: verificationCode,
          user_id: data.user?.id 
        }
      });

      if (codeError) {
        console.error('Error sending verification code:', codeError);
        toast({
          title: 'خطأ',
          description: 'فشل في إرسال كود التحقق، يرجى المحاولة مرة أخرى',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Show email verification component
      setRegisteredEmail(email);
      setShowEmailVerification(true);
      
      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: `تم إرسال كود التحقق المكون من 6 أرقام إلى ${email}`,
      });

      // Clear form
      setEmail('');
      setPassword('');
      setNickname('');
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: t('error.signup'),
        description: error.message || t('error.unexpected'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting signin process for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: t('error.login'),
            description: t('error.credentials'),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('error.login'),
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        console.log('Signin successful');
        toast({
          title: t('success.welcome'),
          description: t('success.loginSuccess'),
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Unexpected signin error:', error);
      toast({
        title: t('error.login'),
        description: error.message || t('error.unexpected'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowEmailVerification(false);
    setIsLogin(true);
    toast({
      title: 'تم تأكيد الإيميل بنجاح!',
      description: 'يمكنك الآن تسجيل الدخول بحسابك',
    });
  };

  const handleBackToSignup = () => {
    setShowEmailVerification(false);
    setIsLogin(false);
  };

  // Show email verification component if needed
  if (showEmailVerification) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4 ${language === 'en' ? 'ltr' : ''}`}>
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className={`text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              تأكيد الإيميل
            </h1>
          </div>
          
          <EmailVerification 
            email={registeredEmail}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBackToSignup}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4 ${language === 'en' ? 'ltr' : ''}`}>
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className={`text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
            {isLogin ? t('auth.login.title') : t('auth.signup.title')}
          </h1>
        </div>

        <Card className="gaming-card">
          <CardHeader className="text-center bg-slate-900">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? t('auth.login.welcome') : t('auth.signup.welcome')}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? t('auth.login.subtitle') 
                : t('auth.signup.subtitle')
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 bg-slate-950">
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('auth.email')}</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  required
                />
              </div>

              {/* Nickname Field - Only for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-gray-300 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{t('auth.nickname')}</span>
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder={t('auth.nickname.placeholder')}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>{t('auth.password')}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password.placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-gray-800/50 border-gray-600 text-white ${language === 'ar' ? 'pr-12' : 'pl-12'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? t('auth.login.loading') : t('auth.signup.loading')) 
                  : (isLogin ? t('auth.login.button') : t('auth.signup.button'))
                }
              </Button>
            </form>

            {/* Toggle between login and signup */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setNickname('');
                  }}
                  className={`text-purple-400 hover:text-purple-300 font-medium ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                >
                  {isLogin ? t('auth.createAccount') : t('auth.loginInstead')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
