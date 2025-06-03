
import React, { useState } from 'react';
import { Plus, Loader2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { NewSubscriber, SUBSCRIPTION_LEVELS, SUBSCRIPTION_DURATIONS } from '../../types/subscriber';

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
  const [subscriptionDuration, setSubscriptionDuration] = useState<string>('30');
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
        subscription_level: parseInt(subscriptionLevel) as 1 | 2 | 3 | 4 | 5,
        subscription_duration: parseInt(subscriptionDuration)
      });

      // إعادة تعيين النموذج
      setEmail('');
      setNickname('');
      setSubscriptionLevel(defaultLevel?.toString() || '1');
      setSubscriptionDuration('30');
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

  const getDurationLabel = (duration: string) => {
    const durationNum = parseInt(duration);
    return SUBSCRIPTION_DURATIONS.find(d => d.value === durationNum)?.label || 'غير محدد';
  };

  return (
    <Card className="gaming-card">
      <CardHeader className="bg-slate-900">
        <CardTitle className="text-xl text-white flex items-center">
          <Plus className="w-5 h-5 mr-3 text-green-400" />
          إضافة مشترك جديد
        </CardTitle>
        <CardDescription className="text-gray-300">
          إضافة مشترك جديد مع تحديد مستوى ومدة الاشتراك
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-300">الاسم المستعار</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="أدخل الاسم المستعار..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">مستوى الاشتراك</Label>
              <Select value={subscriptionLevel} onValueChange={setSubscriptionLevel}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_LEVELS.map((level) => (
                    <SelectItem key={level.level} value={level.level.toString()}>
                      <div className="flex items-center gap-2">
                        <span className={level.color}>●</span>
                        المستوى {level.level} - {level.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getLevelInfo(subscriptionLevel) && (
                <p className="text-xs text-gray-400">
                  {getLevelInfo(subscriptionLevel)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                مدة الاشتراك
              </Label>
              <Select value={subscriptionDuration} onValueChange={setSubscriptionDuration}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                {getDurationLabel(subscriptionDuration)}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isAdding}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة المشترك
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
