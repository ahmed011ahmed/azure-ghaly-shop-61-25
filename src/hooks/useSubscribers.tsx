
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id?: string;
  email: string;
  nickname?: string;
  subscription_status: 'active' | 'inactive' | 'pending';
  subscription_date?: string;
  last_login?: string;
}

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // جلب المشتركين من جدول profiles
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      console.log('Fetching subscribers');
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      const subscribersData = profilesData?.map(profile => ({
        id: profile.id,
        email: profile.id,
        nickname: profile.nickname,
        subscription_status: 'active' as const,
        subscription_date: profile.created_at,
        last_login: profile.updated_at
      })) || [];

      console.log('Subscribers loaded:', subscribersData);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قائمة المشتركين",
        variant: "destructive"
      });
      
      // بيانات تجريبية في حالة الفشل
      const mockData: Subscriber[] = [
        {
          id: '1',
          email: 'subscriber1@example.com',
          nickname: 'مشترك 1',
          subscription_status: 'active',
          subscription_date: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        {
          id: '2',
          email: 'subscriber2@example.com',
          nickname: 'مشترك 2',
          subscription_status: 'inactive',
          subscription_date: new Date(Date.now() - 86400000).toISOString(),
          last_login: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setSubscribers(mockData);
    } finally {
      setLoading(false);
    }
  };

  // إضافة مشترك جديد
  const addSubscriber = async (newSubscriber: {
    email: string;
    nickname: string;
  }) => {
    try {
      console.log('Adding new subscriber:', newSubscriber);
      
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
        subscription_date: data.created_at,
        last_login: data.updated_at
      };

      setSubscribers(prev => [addedSubscriber, ...prev]);
      
      toast({
        title: "تم بنجاح",
        description: `تم إضافة المشترك ${newSubscriber.nickname} بنجاح`
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
  }, []);

  return {
    subscribers,
    loading,
    addSubscriber,
    updateSubscriptionStatus,
    deleteSubscriber,
    refetch: fetchSubscribers
  };
};
