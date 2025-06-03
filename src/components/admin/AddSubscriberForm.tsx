import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { NewSubscriber, SUBSCRIPTION_LEVELS } from '../../types/subscriber';
interface AddSubscriberFormProps {
  onAdd: (subscriber: NewSubscriber) => Promise<void>;
  defaultLevel?: number;
}
const AddSubscriberForm = ({
  onAdd,
  defaultLevel
}: AddSubscriberFormProps) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [subscriptionLevel, setSubscriptionLevel] = useState<string>(defaultLevel?.toString() || '1');
  const [isAdding, setIsAdding] = useState(false);
  const {
    toast
  } = useToast();
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
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المشترك الجديد بنجاح"
      });
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
  const getLevelInfo = (level: string) => {
    const levelNum = parseInt(level);
    return SUBSCRIPTION_LEVELS.find(l => l.level === levelNum);
  };
  return <Card className="gaming-card">
      
      
    </Card>;
};
export default AddSubscriberForm;