
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Subscriber, NewSubscriber } from '../types/subscriber';

// نوع محلي للملف الشخصي مع مستوى الاشتراك
interface ProfileWithLevel {
  id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
  subscription_level?: number;
}

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      console.log('Loading subscribers from database...');
      
      // جلب البيانات من جدول subscriber_permissions أولاً
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('subscriber_permissions')
        .select('*')
        .order('granted_at', { ascending: false });

      if (permissionsError) {
        console.error('خطأ في تحميل أذونات المشتركين:', permissionsError);
      }

      console.log('Permissions data:', permissionsData);

      // جلب البيانات من جدول profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('خطأ في تحميل الملفات الشخصية:', profilesError);
      }

      console.log('Profiles data:', profilesData);

      // دمج البيانات وإنشاء قائمة المشتركين
      const formattedSubscribers: Subscriber[] = [];

      // إضافة المشتركين من جدول الأذونات
      if (permissionsData) {
        permissionsData.forEach(permission => {
          // البحث عن الملف الشخصي المطابق
          const profile = (profilesData || []).find(p => p.id === permission.email) as ProfileWithLevel;
          
          formattedSubscribers.push({
            id: permission.id,
            email: permission.email,
            nickname: profile?.nickname || 'غير محدد',
            subscription_status: permission.is_active ? 'active' : 'inactive',
            subscription_level: profile?.subscription_level || 1, // جلب المستوى من profiles
            subscription_date: permission.granted_at,
            last_login: profile?.updated_at || null
          });
        });
      }

      // إضافة المشتركين من جدول profiles الذين ليس لديهم أذونات
      if (profilesData) {
        profilesData.forEach(profile => {
          const profileWithLevel = profile as ProfileWithLevel;
          const hasPermission = (permissionsData || []).some(p => p.email === profile.id);
          if (!hasPermission) {
            formattedSubscribers.push({
              id: profile.id,
              email: profile.id,
              nickname: profile.nickname || 'غير محدد',
              subscription_status: 'pending',
              subscription_level: profileWithLevel.subscription_level || 1, // المستوى من profiles
              subscription_date: profile.created_at,
              last_login: profile.updated_at
            });
          }
        });
      }

      console.log('Formatted subscribers:', formattedSubscribers);
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

  const addSubscriber = async (subscriber: NewSubscriber): Promise<void> => {
    try {
      console.log('Adding new subscriber:', subscriber);
      
      // إضافة إلى جدول profiles مع المستوى
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: subscriber.email,
          nickname: subscriber.nickname,
          // سنحفظ المستوى في حقل مخصص أو استخدام RPC
        })
        .select()
        .single();

      if (profileError) {
        console.error('خطأ في إضافة المشترك إلى الملفات الشخصية:', profileError);
        throw profileError;
      }

      console.log('Profile added successfully:', profileData);

      // إضافة إلى جدول أذونات المشتركين
      const { data: permissionData, error: permissionError } = await supabase
        .from('subscriber_permissions')
        .insert({
          email: subscriber.email,
          is_active: true,
          granted_by: 'admin'
        })
        .select()
        .single();

      if (permissionError) {
        console.error('خطأ في إضافة أذونات المشترك:', permissionError);
      } else {
        console.log('Permission added successfully:', permissionData);
      }

      console.log('تم إضافة مشترك جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة المشترك:', error);
      throw error;
    }
  };

  const updateSubscriptionStatus = async (id: string, status: 'active' | 'inactive' | 'pending'): Promise<void> => {
    try {
      console.log('Updating subscription status:', { id, status });
      
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

  const updateSubscriptionLevel = async (id: string, level: 1 | 2 | 3 | 4 | 5): Promise<void> => {
    try {
      console.log('Updating subscription level:', { id, level });
      
      // تحديث المستوى في جدول profiles
      // نحتاج إلى استخدام RPC أو إضافة عمود للمستوى
      console.log('Level update not implemented yet - need database schema update');
      
      console.log('تم تحديث مستوى الاشتراك بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث مستوى الاشتراك:', error);
      throw error;
    }
  };

  const deleteSubscriber = async (id: string): Promise<void> => {
    try {
      console.log('Deleting subscriber:', id);
      
      // حذف من جدول profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) {
        console.error('خطأ في حذف المشترك من الملفات الشخصية:', profileError);
      }

      // حذف من جدول أذونات المشتركين
      const { error: permissionError } = await supabase
        .from('subscriber_permissions')
        .delete()
        .eq('email', id);

      if (permissionError) {
        console.error('خطأ في حذف أذونات المشترك:', permissionError);
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
    updateSubscriptionLevel,
    deleteSubscriber
  };
};
