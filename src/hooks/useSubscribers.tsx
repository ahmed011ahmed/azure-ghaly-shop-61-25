
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
          const levelRecord = (levelsData || []).find(l => l.email === permission.email);
          const subscriptionLevel = (levelRecord?.subscription_level || 1) as 1 | 2 | 3 | 4 | 5;
          
          formattedSubscribers.push({
            id: permission.email,
            email: permission.email,
            nickname: profile?.nickname || 'غير محدد',
            subscription_status: permission.is_active ? 'active' : 'inactive',
            subscription_level: subscriptionLevel,
            subscription_date: permission.granted_at,
            last_login: profile?.updated_at || null
          });
        });
      }

      // إضافة المشتركين من جدول profiles الذين ليس لديهم أذونات
      if (profilesData) {
        profilesData.forEach(profile => {
          const hasPermission = (permissionsData || []).some(p => p.email === profile.id);
          if (!hasPermission) {
            // البحث عن مستوى الاشتراك من قاعدة البيانات
            const levelRecord = (levelsData || []).find(l => l.email === profile.id);
            const subscriptionLevel = (levelRecord?.subscription_level || 1) as 1 | 2 | 3 | 4 | 5;
            
            formattedSubscribers.push({
              id: profile.id,
              email: profile.id,
              nickname: profile.nickname || 'غير محدد',
              subscription_status: 'pending',
              subscription_level: subscriptionLevel,
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
      
      // التحقق من وجود المشترك مسبقاً في جدول profiles
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', subscriber.email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('خطأ في التحقق من وجود المشترك:', checkError);
        throw checkError;
      }

      // حفظ مستوى الاشتراك في قاعدة البيانات
      const { error: levelError } = await supabase
        .from('subscriber_levels')
        .upsert({
          email: subscriber.email,
          subscription_level: subscriber.subscription_level,
          updated_by: 'admin'
        });

      if (levelError) {
        console.error('خطأ في حفظ مستوى الاشتراك:', levelError);
        // لا نرمي الخطأ هنا لأن هذا لن يمنع إضافة المشترك
      }

      // إذا كان المشترك موجود بالفعل، نقوم بتحديث البيانات فقط
      if (existingProfile) {
        console.log('Subscriber already exists, updating data...');
        
        // تحديث البيانات في جدول profiles
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            nickname: subscriber.nickname,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriber.email);

        if (updateError) {
          console.error('خطأ في تحديث المشترك:', updateError);
          throw updateError;
        }

        // التحقق من وجود أذونات والتحديث أو الإضافة
        const { data: existingPermission, error: permissionCheckError } = await supabase
          .from('subscriber_permissions')
          .select('id')
          .eq('email', subscriber.email)
          .maybeSingle();

        if (permissionCheckError && permissionCheckError.code !== 'PGRST116') {
          console.error('خطأ في التحقق من أذونات المشترك:', permissionCheckError);
        }

        if (existingPermission) {
          // تحديث الأذونات الموجودة
          const { error: permissionUpdateError } = await supabase
            .from('subscriber_permissions')
            .update({
              is_active: true,
              granted_by: 'admin'
            })
            .eq('email', subscriber.email);

          if (permissionUpdateError) {
            console.error('خطأ في تحديث أذونات المشترك:', permissionUpdateError);
          }
        } else {
          // إضافة أذونات جديدة
          const { error: permissionError } = await supabase
            .from('subscriber_permissions')
            .insert({
              email: subscriber.email,
              is_active: true,
              granted_by: 'admin'
            });

          if (permissionError) {
            console.error('خطأ في إضافة أذونات المشترك:', permissionError);
          }
        }

        console.log('تم تحديث المشترك بنجاح');
        return;
      }

      // إضافة مشترك جديد
      console.log('Creating new subscriber profile...');
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: subscriber.email,
          nickname: subscriber.nickname
        });

      if (profileError) {
        console.error('خطأ في إضافة المشترك إلى الملفات الشخصية:', profileError);
        throw profileError;
      }

      console.log('Profile created successfully');

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
        // لا نرمي الخطأ هنا لأن المشترك تم إضافته بنجاح إلى profiles
      } else {
        console.log('Permission added successfully');
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
      
      // حفظ المستوى في قاعدة البيانات باستخدام upsert
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
      
      // إعادة تحميل البيانات فوراً
      await loadSubscribers();
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
    deleteSubscriber
  };
};
