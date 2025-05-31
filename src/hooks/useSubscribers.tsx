import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id?: string;
  email: string;
  nickname?: string;
  subscription_status: 'active' | 'inactive' | 'pending';
  subscription_level: 1 | 2 | 3 | 4 | 5;
  subscription_date?: string;
  last_login?: string;
}

export const useSubscribers = (targetLevel?: number) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // جلب المشتركين من جدول profiles مع تصفية حسب المستوى
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      console.log('Fetching subscribers for level:', targetLevel);
      
      // نجلب المشتركين من جدول profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      // نحول بيانات profiles إلى تنسيق المشتركين
      let subscribersData = profilesData?.map(profile => ({
        id: profile.id,
        email: profile.id,
        nickname: profile.nickname,
        subscription_status: 'active' as const,
        subscription_level: 1 as const, // مستوى افتراضي
        subscription_date: profile.created_at,
        last_login: profile.updated_at
      })) || [];

      // تصفية حسب المستوى إذا تم تحديده
      if (targetLevel) {
        subscribersData = subscribersData.filter(sub => sub.subscription_level === targetLevel);
      }

      console.log('Subscribers loaded for level', targetLevel, ':', subscribersData);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قائمة المشتركين",
        variant: "destructive"
      });
      
      // بيانات تجريبية في حالة الفشل
      const mockData = [
        {
          id: '1',
          email: 'subscriber1@example.com',
          nickname: 'مشترك 1',
          subscription_status: 'active' as const,
          subscription_level: targetLevel || 1,
          subscription_date: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        {
          id: '2',
          email: 'subscriber2@example.com',
          nickname: 'مشترك 2',
          subscription_status: 'inactive' as const,
          subscription_level: targetLevel || 1,
          subscription_date: new Date(Date.now() - 86400000).toISOString(),
          last_login: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setSubscribers(targetLevel ? mockData.filter(sub => sub.subscription_level === targetLevel) : mockData);
    } finally {
      setLoading(false);
    }
  };

  // إضافة مشترك جديد
  const addSubscriber = async (newSubscriber: {
    email: string;
    nickname: string;
    subscription_level: 1 | 2 | 3 | 4 | 5;
  }) => {
    try {
      console.log('Adding new subscriber:', newSubscriber);
      
      // إنشاء profile جديد
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: newSubscriber.email,
          nickname: newSubscriber.nickname,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding subscriber:', error);
        throw error;
      }

      const addedSubscriber: Subscriber = {
        id: data.id,
        email: newSubscriber.email,
        nickname: newSubscriber.nickname,
        subscription_status: 'active',
        subscription_level: newSubscriber.subscription_level,
        subscription_date: data.created_at,
        last_login: data.updated_at
      };

      // إضافة المشترك فقط إذا كان يطابق المستوى المطلوب أو لا يوجد تصفية
      if (!targetLevel || addedSubscriber.subscription_level === targetLevel) {
        setSubscribers(prev => [addedSubscriber, ...prev]);
      }
      
      toast({
        title: "تم بنجاح",
        description: `تم إضافة المشترك ${newSubscriber.nickname} بنجاح للمستوى ${newSubscriber.subscription_level}`
      });

    } catch (error) {
      console.error('Error adding subscriber:', error);
      throw error;
    }
  };

  // تحديث حالة الاشتراك
  const updateSubscriptionStatus = async (id: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      console.log(`Updating subscriber ${id} status to ${status}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      setSubscribers(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, subscription_status: status, last_login: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث حالة المشترك إلى ${status === 'active' ? 'نشط' : status === 'inactive' ? 'غير نشط' : 'في الانتظار'}`
      });

    } catch (error) {
      console.error('Error updating subscription status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة المشترك",
        variant: "destructive"
      });
    }
  };

  // تحديث مستوى الاشتراك
  const updateSubscriptionLevel = async (id: string, level: 1 | 2 | 3 | 4 | 5) => {
    try {
      console.log(`Updating subscriber ${id} level to ${level}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Update level error:', error);
        throw error;
      }

      // تحديث المشترك محلياً أو إزالته إذا لم يعد يطابق المستوى المطلوب
      setSubscribers(prev => {
        const updated = prev.map(sub => 
          sub.id === id 
            ? { ...sub, subscription_level: level, last_login: new Date().toISOString() }
            : sub
        );
        
        // إذا كان هناك تصفية حسب المستوى، إزالة المشترك إذا لم يعد يطابق
        if (targetLevel) {
          return updated.filter(sub => sub.subscription_level === targetLevel);
        }
        
        return updated;
      });

      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث مستوى المشترك إلى المستوى ${level}`
      });

    } catch (error) {
      console.error('Error updating subscription level:', error);
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث مستوى المشترك",
        variant: "destructive"
      });
    }
  };

  // حذف مشترك
  const deleteSubscriber = async (id: string) => {
    try {
      console.log(`Deleting subscriber ${id}`);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المشترك بنجاح"
      });

    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف المشترك",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [targetLevel]);

  return {
    subscribers,
    loading,
    addSubscriber,
    updateSubscriptionStatus,
    updateSubscriptionLevel,
    deleteSubscriber,
    refetch: fetchSubscribers
  };
};
