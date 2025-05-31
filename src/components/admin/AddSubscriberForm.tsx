
import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
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
}

const AddSubscriberForm = ({ onAdd }: AddSubscriberFormProps) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !nickname.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await onAdd({
        email: email.trim(),
        nickname: nickname.trim(),
        subscription_level: parseInt(level) as 1 | 2 | 3 | 4 | 5
      });
      
      // إعادة تعيين النموذج
      setEmail('');
      setNickname('');
      setLevel('1');
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المشترك بنجاح"
      });
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المشترك",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (levelNum: string) => {
    const levels = {
      '1': 'برونزي',
      '2': 'فضي', 
      '3': 'ذهبي',
      '4': 'بلاتيني',
      '5': 'ماسي'
    };
    return levels[levelNum as keyof typeof levels] || `المستوى ${levelNum}`;
  };

  return (
    <Card className="gaming-card">
      <CardHeader className="bg-slate-900">
        <CardTitle className="text-xl text-white flex items-center">
          <UserPlus className="w-5 h-5 mr-3 text-green-400" />
          إضافة مشترك جديد
        </CardTitle>
        <CardDescription className="text-gray-300">
          إضافة مشترك جديد مع تحديد مستوى الاشتراك
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">البريد الإلكتروني *</Label>
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
              <Label htmlFor="nickname" className="text-gray-300">الاسم المستعار *</Label>
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

          <div>
            <Label htmlFor="level" className="text-gray-300">مستوى الاشتراك</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {[1, 2, 3, 4, 5].map(levelNum => (
                  <SelectItem key={levelNum} value={levelNum.toString()} className="text-white">
                    المستوى {levelNum} - {getLevelName(levelNum.toString())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                إضافة المشترك
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSubscriberForm;
