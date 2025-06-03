
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Subscriber, NewSubscriber } from '../types/subscriber';

// نوع محلي للملف الشخصي
interface ProfileData {
  id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

// نوع محلي لمستوى الاشتراك
interface SubscriberLevelData {
  created_at: string;
  email: string;
  id: string;
  subscription_level: number;
  updated_at: string;
  updated_by: string | null;
}

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // حساب تاريخ انتهاء الاشتراك
  const calculateExpiryDate = (subscriptionDate: string, duration: number): string | null => {
    if (duration === 0) return null; // بلا حدود زمنية
    const startDate = new Date(subscriptionDate);
    const expiryDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
    return expiryDate.toISOString();
  };

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

      // جلب مستويات الاشتراك من قاعدة البيانات
      const { data: levelsData, error: levelsError } = await supabase
        .from('subscriber_levels')
        .select('*');

      if (levelsError) {
        console.error('خطأ في تحميل مستويات الاشتراك:', levelsError);
      }

      console.log('Levels data:', levelsData);

      // دمج البيانات وإنشاء قائمة المشتركين
      const formattedSubscribers: Subscriber[] = [];

      // إضافة المشتركين من جدول الأذونات
      if (permissionsData) {
        permissionsData.forEach(permission => {
          // البحث عن الملف الشخصي المطابق
          const profile = (profilesData || []).find(p => p.id === permission.email) as ProfileData;
          
          // البحث عن مستوى الاشتراك من قاعدة البيانات
          const levelRecord = (levelsData || []).find(l => l.email === permission.email) as SubscriberLevelData;
          const subscriptionLevel = (levelRecord?.subscription_level || 1) as 1 | 2 | 3 | 4 | 5;
          // استخدام مدة افتراضية 30 يوم حيث أن العمود غير موجود في قاعدة البيانات
          const subscriptionDuration = 30;
          
          // حساب تاريخ انتهاء الاشتراك
          const expiryDate = calculateExpiryDate(permission.granted_at, subscriptionDuration);
          
          formattedSubscribers.push({
            id: permission.email,
            email: permission.email,
            nickname: profile?.nickname || 'غير محدد',
            subscription_status: permission.is_active ? 'active' : 'inactive',
            subscription_level: subscriptionLevel,
            subscription_date: permission.granted_at,
            last_login: profile?.updated_at || null,
            subscription_duration: subscriptionDuration,
            expiry_date: expiryDate
          });
        });
      }

      // إضافة المشتركين من جدول profiles الذين ليس لديهم أذونات
      if (profilesData) {
        profilesData.forEach(profile => {
          const hasPermission = (permissionsData || []).some(p => p.email === profile.id);
          if (!hasPermission) {
            // البحث عن مستوى الاشتراك من قاعدة البيانات
            const levelRecord = (levelsData || []).find(l => l.email === profile.id) as SubscriberLevelData;
            const subscriptionLevel = (levelRecord?.subscription_level || 1) as 1 | 2 | 3 | 4 | 5;
            // استخدام مدة افتراضية 30 يوم
            const subscriptionDuration = 30;
            
            // حساب تاريخ انتهاء الاشتراك
            const expiryDate = calculateExpiryDate(profile.created_at, subscriptionDuration);
            
            formattedSubscribers.push({
              id: profile.id,
              email: profile.id,
              nickname: profile.nickname || 'غير محدد',
              subscription_status: 'pending',
              subscription_level: subscriptionLevel,
              subscription_date: profile.created_at,
              last_login: profile.updated_at,
              subscription_duration: subscriptionDuration,
              expiry_date: expiryDate
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

    // إنشاء channel مع اسم فريد للمشتركين
    const subscribersChannelId = `subscribers_profiles_${Date.now()}_${Math.random()}`;
    const profilesChannel = supabase
      .channel(subscribersChannelId)
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

    // إنشاء channel مع اسم فريد للأذونات
    const permissionsChannelId = `subscribers_permissions_${Date.now()}_${Math.random()}`;
    const permissionsChannel = supabase
      .channel(permissionsChannelId)
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

    // إنشاء channel مع اسم فريد لمستويات الاشتراك
    const levelsChannelId = `subscriber_levels_${Date.now()}_${Math.random()}`;
    const levelsChannel = supabase
      .channel(levelsChannelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriber_levels'
        },
        () => {
          console.log('تم تحديث بيانات مستويات الاشتراك');
          loadSubscribers();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscribers channels');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(permissionsChannel);
      supabase.removeChannel(levelsChannel);
    };
  }, []);

  const addSubscriber = async (subscriber: NewSubscriber): Promise<void> => {
    try {
      console.log('Adding new subscriber:', subscriber);
      
      // حفظ مستوى الاشتراك في قاعدة البيانات (بدون مدة الاشتراك لأن العمود غير موجود)
      const { error: levelError } = await supabase
        .from('subscriber_levels')
        .upsert({
          email: subscriber.email,
          subscription_level: subscriber.subscription_level,
          updated_by: 'admin'
        });

      if (levelError) {
        console.error('خطأ في حفظ مستوى الاشتراك:', levelError);
      }

      // إضافة إلى جدول أذونات المشتركين
      const { error: permissionError } = await supabase
        .from('subscriber_permissions')
        .insert({
          email: subscriber.email,
          is_active: true,
          granted_by: 'admin'
        });

      if (permissionError) {
        console.error('خطأ في إضافة أذونات المشترك:', permissionError);
        throw permissionError;
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
      
      const { error } = await supabase
        .from('subscriber_levels')
        .upsert({
          email: id,
          subscription_level: level,
          updated_by: 'admin'
        }, {
          onConflict: 'email'
        });

      if (error) {
        console.error('خطأ في تحديث مستوى الاشتراك في قاعدة البيانات:', error);
        throw error;
      }
      
      console.log('تم تحديث مستوى الاشتراك بنجاح في قاعدة البيانات');
      
      await loadSubscribers();
    } catch (error) {
      console.error('خطأ في تحديث مستوى الاشتراك:', error);
      throw error;
    }
  };

  // تحديث مدة الاشتراك - مؤقتاً معطل لأن العمود غير موجود في قاعدة البيانات
  const updateSubscriptionDuration = async (id: string, duration: number): Promise<void> => {
    try {
      console.log('Updating subscription duration (currently disabled):', { id, duration });
      
      // مؤقتاً سنعرض رسالة أن الميزة غير متاحة
      console.warn('تحديث مدة الاشتراك غير متاح حالياً - يجب إضافة عمود subscription_duration إلى جدول subscriber_levels');
      
      // تحديث البيانات المحلية فقط
      setSubscribers(prevSubscribers => 
        prevSubscribers.map(subscriber => 
          subscriber.id === id 
            ? { 
                ...subscriber, 
                subscription_duration: duration,
                expiry_date: calculateExpiryDate(subscriber.subscription_date || new Date().toISOString(), duration)
              }
            : subscriber
        )
      );
      
    } catch (error) {
      console.error('خطأ في تحديث مدة الاشتراك:', error);
      throw error;
    }
  };

  const deleteSubscriber = async (id: string): Promise<void> => {
    try {
      console.log('Deleting subscriber:', id);
      
      // حذف من جدول أذونات المشتركين
      const { error: permissionError } = await supabase
        .from('subscriber_permissions')
        .delete()
        .eq('email', id);

      if (permissionError) {
        console.error('خطأ في حذف أذونات المشترك:', permissionError);
      }

      // حذف من جدول مستويات الاشتراك
      const { error: levelError } = await supabase
        .from('subscriber_levels')
        .delete()
        .eq('email', id);

      if (levelError) {
        console.error('خطأ في حذف مستوى اشتراك المشترك:', levelError);
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
    updateSubscriptionDuration,
    deleteSubscriber
  };
};
