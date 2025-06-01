
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Subscriber {
  id?: string;
  email: string;
  nickname: string;
  subscription_status: 'active' | 'inactive' | 'pending';
  subscription_date?: string;
  last_login?: string;
}

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      
      // جلب البيانات من جدول profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('خطأ في تحميل المشتركين:', profilesError);
        return;
      }

      // جلب البيانات من جدول subscriber_permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('subscriber_permissions')
        .select('*');

      if (permissionsError) {
        console.error('خطأ في تحميل أذونات المشتركين:', permissionsError);
      }

      // دمج البيانات
      const formattedSubscribers: Subscriber[] = (profilesData || []).map(profile => {
        const permission = (permissionsData || []).find(p => p.email === profile.id);
        return {
          id: profile.id,
          email: profile.id, // استخدام ID كإيميل مؤقتاً
          nickname: profile.nickname,
          subscription_status: permission?.is_active ? 'active' : 'inactive',
          subscription_date: profile.created_at,
          last_login: profile.updated_at
        };
      });

      setSubscribers(formattedSubscribers);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();

    // إعداد Real-time subscription للمشتركين
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('تم تحديث بيانات المشتركين');
          loadSubscribers();
        }
      )
      .subscribe();

    // إعداد Real-time subscription للأذونات
    const permissionsChannel = supabase
      .channel('permissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriber_permissions'
        },
        () => {
          console.log('تم تحديث بيانات أذونات المشتركين');
          loadSubscribers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(permissionsChannel);
    };
  }, []);

  const addSubscriber = async (subscriber: { email: string; nickname: string }): Promise<void> => {
    try {
      // إضافة إلى جدول profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          nickname: subscriber.nickname
        });

      if (profileError) {
        console.error('خطأ في إضافة المشترك:', profileError);
        throw profileError;
      }

      // إضافة إلى جدول أذونات المشتركين
      const { error: permissionError } = await supabase
        .from('subscriber_permissions')
        .insert({
          email: subscriber.email,
          is_active: true
        });

      if (permissionError) {
        console.error('خطأ في إضافة أذونات المشترك:', permissionError);
        // لا نرمي خطأ هنا لأن المشترك تم إضافته بالفعل
      }

      console.log('تم إضافة مشترك جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة المشترك:', error);
      throw error;
    }
  };

  const updateSubscriptionStatus = async (id: string, status: 'active' | 'inactive' | 'pending'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('subscriber_permissions')
        .update({ is_active: status === 'active' })
        .eq('email', id);

      if (error) {
        console.error('خطأ في تحديث حالة الاشتراك:', error);
        throw error;
      }

      console.log('تم تحديث حالة الاشتراك بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث حالة الاشتراك:', error);
      throw error;
    }
  };

  const deleteSubscriber = async (id: string): Promise<void> => {
    try {
      // حذف من جدول profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) {
        console.error('خطأ في حذف المشترك:', profileError);
        throw profileError;
      }

      // حذف من جدول أذونات المشتركين
      const { error: permissionError } = await supabase
        .from('subscriber_permissions')
        .delete()
        .eq('email', id);

      if (permissionError) {
        console.error('خطأ في حذف أذونات المشترك:', permissionError);
        // لا نرمي خطأ هنا لأن المشترك تم حذفه بالفعل
      }

      console.log('تم حذف المشترك بنجاح');
    } catch (error) {
      console.error('خطأ في حذف المشترك:', error);
      throw error;
    }
  };

  return {
    subscribers,
    loading,
    addSubscriber,
    updateSubscriptionStatus,
    deleteSubscriber
  };
};
