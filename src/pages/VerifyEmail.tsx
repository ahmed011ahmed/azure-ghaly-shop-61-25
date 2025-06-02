
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setVerificationStatus('error');
        setMessage('رابط التحقق غير صحيح');
        return;
      }

      try {
        console.log('Verifying email with token:', token, 'for email:', email);
        
        const { data, error } = await supabase.functions.invoke('verify-email-link', {
          body: { email, token }
        });

        console.log('Verification response:', { data, error });

        if (error) {
          console.error('Verification error:', error);
          throw error;
        }

        if (data.success) {
          setVerificationStatus('success');
          setMessage('تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول');
          
          toast({
            title: 'تم التأكيد بنجاح!',
            description: 'تم تأكيد بريدك الإلكتروني، يمكنك الآن تسجيل الدخول',
          });
        } else {
          throw new Error(data.error || 'فشل في التحقق من الرابط');
        }
      } catch (error: any) {
        console.error('Error during verification:', error);
        setVerificationStatus('error');
        setMessage(error.message || 'رابط التحقق غير صحيح أو منتهي الصلاحية');
        
        toast({
          title: 'خطأ في التحقق',
          description: error.message || 'رابط التحقق غير صحيح أو منتهي الصلاحية',
          variant: 'destructive',
        });
      }
    };

    verifyEmail();
  }, [token, email, toast]);

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'text-purple-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'جاري التحقق من البريد الإلكتروني...';
      case 'success':
        return 'تم التأكيد بنجاح!';
      case 'error':
        return 'فشل في التحقق';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mr-4">
            تأكيد البريد الإلكتروني
          </h1>
        </div>

        <Card className="gaming-card">
          <CardHeader className="text-center bg-slate-900">
            <CardTitle className="text-2xl font-bold text-white">
              تأكيد البريد الإلكتروني
            </CardTitle>
            <CardDescription className="text-gray-300">
              {email && `البريد الإلكتروني: ${email}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 bg-slate-950">
            <div className="text-center space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center">
                {getStatusIcon()}
              </div>

              {/* Status Title */}
              <h2 className={`text-xl font-bold ${getStatusColor()}`}>
                {getStatusTitle()}
              </h2>

              {/* Status Message */}
              <p className="text-gray-300">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                {verificationStatus === 'success' && (
                  <Button 
                    onClick={handleGoToLogin}
                    className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    انتقل إلى تسجيل الدخول
                  </Button>
                )}

                {verificationStatus === 'error' && (
                  <div className="space-y-2">
                    <Button 
                      onClick={handleGoToLogin}
                      className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      إنشاء حساب جديد
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      العودة للصفحة الرئيسية
                    </Button>
                  </div>
                )}

                {verificationStatus === 'loading' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    العودة للصفحة الرئيسية
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
