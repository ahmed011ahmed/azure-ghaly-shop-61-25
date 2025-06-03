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
  const [durationDays, setDurationDays] = useState<string>('30'); // افتراضي 30 يوم
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

    const duration = parseInt(durationDays);
    if (isNaN(duration) || duration < 1) {
      toast({
        title: "خطأ في المدة",
        description: "يرجى إدخال مدة صحيحة (أكبر من 0)",
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
        duration_days: duration
      });

      // إعادة تعيين النموذج
      setEmail('');
      setNickname('');
      setSubscriptionLevel(defaultLevel?.toString() || '1');
      setDurationDays('30');
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
      <CardHeader className="bg-slate-900">
        <CardTitle className="text-xl text-white flex items-center">
          <Plus className="w-5 h-5 mr-3 text-purple-400" />
          إضافة مشترك جديد
        </CardTitle>
        <CardDescription className="text-gray-300">
          أضف مشترك جديد مع تحديد المستوى والمدة
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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

          <div>
            <Label htmlFor="nickname" className="text-gray-300">اسم المستخدم</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="أدخل اسم المستخدم..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="subscription-level" className="text-gray-300">مستوى الاشتراك</Label>
            <Select value={subscriptionLevel} onValueChange={setSubscriptionLevel}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {SUBSCRIPTION_LEVELS.map((level) => (
                  <SelectItem key={level.level} value={level.level.toString()}>
                    <div className="flex items-center">
                      <span className={`${level.color} font-semibold`}>{level.name}</span>
                      <span className="text-gray-400 ml-2">- {level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="text-gray-300">مدة الاشتراك (بالأيام)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="أدخل المدة بالأيام..."
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white"
              min="1"
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              القيمة الافتراضية: 30 يوم
            </p>
          </div>

          {subscriptionLevel && (
            <div className="p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">المستوى المحدد:</span>
                <span className={`font-semibold ${getLevelInfo(subscriptionLevel)?.color}`}>
                  {getLevelInfo(subscriptionLevel)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-300">المدة:</span>
                <span className="text-green-400 font-semibold">
                  {durationDays} يوم
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isAdding}
            className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
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
        </form>
      </CardContent>
    </Card>;
};
export default AddSubscriberForm;