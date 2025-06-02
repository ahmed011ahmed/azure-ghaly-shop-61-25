
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const EmailVerification = ({ email, onVerificationSuccess, onBack }: EmailVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال كود مكون من 6 أرقام',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifying code:', verificationCode, 'for email:', email);
      
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code: verificationCode }
      });

      console.log('Verification response:', { data, error });

      if (error) {
        console.error('Verification error:', error);
        throw error;
      }

      if (data.success) {
        toast({
          title: 'تم التأكيد بنجاح!',
          description: 'تم تأكيد بريدك الإلكتروني، يمكنك الآن تسجيل الدخول',
        });
        onVerificationSuccess();
      } else {
        throw new Error(data.error || 'فشل في التحقق من الكود');
      }
    } catch (error: any) {
      console.error('Error during verification:', error);
      toast({
        title: 'خطأ في التأكيد',
        description: error.message || 'كود التأكيد غير صحيح أو منتهي الصلاحية',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      // Generate new verification code (6 digits)
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('Resending verification code for email:', email);
      
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, code: newCode }
      });

      console.log('Resend response:', { data, error });

      if (error) {
        console.error('Resend error:', error);
        throw error;
      }

      toast({
        title: 'تم إرسال الكود',
        description: 'تم إرسال كود تأكيد جديد مكون من 6 أرقام إلى بريدك الإلكتروني',
      });
      
      // Clear the input field
      setVerificationCode('');
    } catch (error: any) {
      console.error('Error during resend:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: error.message || 'فشل في إرسال كود التحقق',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="gaming-card">
      <CardHeader className="text-center bg-slate-900">
        <CardTitle className="text-2xl font-bold text-white">
          تأكيد البريد الإلكتروني
        </CardTitle>
        <CardDescription className="text-gray-300">
          تم إرسال كود مكون من 6 أرقام إلى: {email}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 bg-slate-950">
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verificationCode" className="text-gray-300">
              كود التأكيد (6 أرقام)
            </Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => {
                // Only allow numbers and limit to 6 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              className="bg-gray-800/50 border-gray-600 text-white text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-sm text-gray-400 text-center">
              أدخل الكود المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'جاري التأكيد...' : 'تأكيد الكود'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              لم تتلق الكود؟
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'جاري الإرسال...' : 'إعادة إرسال كود جديد'}
            </Button>
          </div>
          
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300"
            >
              العودة للتسجيل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
