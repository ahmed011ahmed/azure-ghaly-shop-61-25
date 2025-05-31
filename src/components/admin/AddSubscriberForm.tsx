
import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddSubscriberFormProps {
  onAdd: (subscriber: {
    email: string;
    nickname: string;
    subscription_level: 1 | 2 | 3 | 4 | 5;
  }) => Promise<void>;
  defaultLevel?: number;
}

const AddSubscriberForm = ({ onAdd, defaultLevel }: AddSubscriberFormProps) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [subscriptionLevel, setSubscriptionLevel] = useState<string>(defaultLevel?.toString() || '1');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !nickname.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAdding(true);
      await onAdd({
        email: email.trim(),
        nickname: nickname.trim(),
        subscription_level: parseInt(subscriptionLevel) as 1 | 2 | 3 | 4 | 5
      });
      
      // إعادة تعيين النموذج
      setEmail('');
      setNickname('');
      setSubscriptionLevel(defaultLevel?.toString() || '1');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة المشترك الجديد",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="gaming-card">
      <CardHeader className="bg-slate-900">
        <CardTitle className="text-white flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          إضافة مشترك جديد
          {defaultLevel && <span className="text-purple-400 mr-2">- المستوى {defaultLevel}</span>}
        </CardTitle>
        <CardDescription className="text-gray-300">
          إضافة مشترك جديد إلى النظام
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 pt-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-gray-800/50 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="nickname" className="text-gray-300">الاسم المستعار *</Label>
            <Input
              id="nickname"
              placeholder="اسم المشترك"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 bg-gray-800/50 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-300">مستوى الاشتراك</Label>
            <Select value={subscriptionLevel} onValueChange={setSubscriptionLevel}>
              <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">المستوى 1 - برونزي</SelectItem>
                <SelectItem value="2">المستوى 2 - فضي</SelectItem>
                <SelectItem value="3">المستوى 3 - ذهبي</SelectItem>
                <SelectItem value="4">المستوى 4 - بلاتيني</SelectItem>
                <SelectItem value="5">المستوى 5 - ماسي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة مشترك
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSubscriberForm;
