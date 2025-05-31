import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EmailVerification from '@/components/EmailVerification';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { toast } = useToast();
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
        title: 'خطأ',
        description: 'يرجى إدخال النكنيم',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create user without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'خطأ',
            description: 'هذا الإيميل مسجل بالفعل. جرب تسجيل الدخول بدلاً من ذلك.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'خطأ في التسجيل',
            description: error.message,
            variant: 'destructive',
          });
        }
        setIsLoading(false);
        return;
      }

      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Send verification code
      const { error: codeError } = await supabase.functions.invoke('send-verification-code', {
        body: { 
          email, 
          code: verificationCode,
          user_id: data.user?.id
        }
      });

      if (codeError) {
        console.error('Error sending verification code:', codeError);
        toast({
          title: 'تم إنشاء الحساب',
          description: 'تم إنشاء حسابك، لكن حدث خطأ في إرسال كود التأكيد. يمكنك المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم إنشاء الحساب!',
          description: 'تم إرسال كود التأكيد إلى بريدك الإلكتروني',
        });
      }

      setPendingEmail(email);
      setShowVerification(true);
    } catch (error: any) {
      toast({
        title: 'خطأ في التسجيل',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: 'الإيميل أو كلمة المرور غير صحيحة',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'مرحباً بك!',
        description: 'تم تسجيل الدخول بنجاح',
      });
      navigate('/');
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerification(false);
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setNickname('');
    setPendingEmail('');
    toast({
      title: 'تم التأكيد بنجاح!',
      description: 'يمكنك الآن تسجيل الدخول بحسابك',
    });
  };

  const handleBackToSignup = () => {
    setShowVerification(false);
    setPendingEmail('');
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToSignup}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mr-4">
              تأكيد البريد الإلكتروني
            </h1>
          </div>
          
          <EmailVerification
            email={pendingEmail}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBackToSignup}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mr-4">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
        </div>

        <Card className="gaming-card">
          <CardHeader className="text-center bg-slate-900">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? 'مرحباً بعودتك!' : 'انضم إلينا الآن'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? 'سجل دخولك للوصول إلى حسابك' 
                : 'أنشئ حساباً جديداً للبدء في التسوق'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 bg-slate-950">
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>البريد الإلكتروني</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
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
                    <span>النكنيم</span>
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="أدخل النكنيم الخاص بك"
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
                  <span>كلمة المرور</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
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
                  ? (isLogin ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...') 
                  : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد')
                }
              </Button>
            </form>

            {/* Toggle between login and signup */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setNickname('');
                  }}
                  className="text-purple-400 hover:text-purple-300 font-medium mr-2"
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
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
