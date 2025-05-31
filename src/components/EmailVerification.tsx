
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
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code: verificationCode }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'تم التأكيد بنجاح!',
          description: 'تم تأكيد بريدك الإلكتروني، يمكنك الآن تسجيل الدخول',
        });
        onVerificationSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'خطأ في التأكيد',
        description: error.message || 'كود التأكيد غير صحيح',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      // Generate new verification code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, code: newCode }
      });

      if (error) throw error;

      toast({
        title: 'تم إرسال الكود',
        description: 'تم إرسال كود تأكيد جديد إلى بريدك الإلكتروني',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في الإرسال',
        description: error.message,
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
          تم إرسال كود التأكيد إلى: {email}
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
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
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
              {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الكود'}
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
