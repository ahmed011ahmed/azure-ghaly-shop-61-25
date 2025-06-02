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

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
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
          emailRedirectTo: undefined,
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

      // Send verification link
      const { data: linkData, error: linkError } = await supabase.functions.invoke('send-verification-link', {
        body: { 
          email, 
          user_id: data.user?.id 
        }
      });

      console.log('Verification link response:', { linkData, linkError });

      if (linkError) {
        console.error('Error sending verification link:', linkError);
        toast({
          title: 'خطأ',
          description: 'فشل في إرسال رابط التحقق، يرجى المحاولة مرة أخرى',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!linkData?.success) {
        console.error('Verification link failed:', linkData);
        toast({
          title: 'خطأ',
          description: linkData?.error || 'فشل في إرسال رابط التحقق',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Show success message
      setRegisteredEmail(email);
      setEmailSent(true);
      
      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: `تم إرسال رابط التحقق إلى ${email}. يرجى فتح بريدك الإلكتروني والنقر على الرابط لتأكيد حسابك.`,
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

  const handleBackToSignup = () => {
    setEmailSent(false);
    setIsLogin(false);
  };

  const handleResendLink = async () => {
    setIsLoading(true);
    
    try {
      console.log('Resending verification link for email:', registeredEmail);
      
      const { data, error } = await supabase.functions.invoke('send-verification-link', {
        body: { email: registeredEmail }
      });

      if (error) {
        console.error('Resend error:', error);
        throw error;
      }

      toast({
        title: 'تم إرسال الرابط',
        description: 'تم إرسال رابط تأكيد جديد إلى بريدك الإلكتروني',
      });
      
    } catch (error: any) {
      console.error('Error during resend:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: error.message || 'فشل في إرسال رابط التحقق',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show email sent confirmation if needed
  if (emailSent) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4 ${language === 'en' ? 'ltr' : ''}`}>
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className={`text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
              تأكيد البريد الإلكتروني
            </h1>
          </div>
          
          <Card className="gaming-card">
            <CardHeader className="text-center bg-slate-900">
              <CardTitle className="text-2xl font-bold text-white">
                تحقق من بريدك الإلكتروني
              </CardTitle>
              <CardDescription className="text-gray-300">
                تم إرسال رابط التأكيد إلى: {registeredEmail}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 bg-slate-950">
              <div className="text-center space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <Mail className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-400 mb-2">تم إرسال الرابط بنجاح!</h3>
                  <p className="text-gray-300 text-sm">
                    يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد لإكمال إنشاء حسابك.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    لم تتلق الرابط؟
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendLink}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'جاري الإرسال...' : 'إعادة إرسال رابط جديد'}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackToSignup}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    العودة للتسجيل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    setEmailSent(false);
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
