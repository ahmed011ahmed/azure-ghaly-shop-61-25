
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SubscriberPermission {
  id: string;
  email: string;
  granted_at: string;
  granted_by: string;
  is_active: boolean;
}

export const useSubscriberPermissions = () => {
  const [permissions, setPermissions] = useState<SubscriberPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // جلب قائمة الأذونات من قاعدة البيانات
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      console.log('Fetching permissions from database');
      
      const { data, error } = await supabase
        .from('subscriber_permissions')
        .select('*')
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }

      console.log('Permissions loaded from database:', data);
      setPermissions(data || []);
    } catch (error) {
      console.error('Error in fetchPermissions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قائمة الأذونات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // التحقق من وجود إذن لبريد إلكتروني معين
  const checkPermission = (email: string): boolean => {
    return permissions.some(permission => 
      permission.email === email && permission.is_active
    );
  };

  // إضافة إذن جديد
  const addPermission = async (email: string) => {
    try {
      console.log('Adding permission for:', email);
      
      const { data, error } = await supabase
        .from('subscriber_permissions')
        .insert([{
          email: email.trim(),
          granted_by: 'admin',
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding permission:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في إضافة الإذن: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Permission added successfully:', data);
      toast({
        title: "تم بنجاح",
        description: `تم إضافة إذن الوصول للبريد: ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding permission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع في إضافة الإذن",
        variant: "destructive"
      });
      return false;
    }
  };

  // حذف إذن (تعطيله)
  const removePermission = async (id: string, email: string) => {
    try {
      console.log('Removing permission for:', email);
      
      const { error } = await supabase
        .from('subscriber_permissions')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error removing permission:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في حذف الإذن: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "تم الحذف",
        description: `تم حذف إذن الوصول للبريد: ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error removing permission:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الإذن",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPermissions();

    // إعداد التحديثات الفورية للأذونات
    const channel = supabase
      .channel('permissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriber_permissions'
        },
        (payload) => {
          console.log('Real-time permission update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setPermissions(prev => [payload.new as SubscriberPermission, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPermissions(prev => prev.map(permission => 
              permission.id === payload.new.id ? payload.new as SubscriberPermission : permission
            ));
          } else if (payload.eventType === 'DELETE') {
            setPermissions(prev => prev.filter(permission => permission.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    permissions,
    loading,
    checkPermission,
    addPermission,
    removePermission,
    refetch: fetchPermissions
  };
};
