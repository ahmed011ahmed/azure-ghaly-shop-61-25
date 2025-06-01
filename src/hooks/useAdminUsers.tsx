
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  permissions: string[];
  created_at: string;
  is_active: boolean;
}

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // جلب قائمة مستخدمي الإدارة
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin users from database');
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin users:', error);
        throw error;
      }

      console.log('Admin users loaded from database:', data);
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error in fetchAdminUsers:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قائمة مستخدمي الإدارة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // إضافة مستخدم إدارة جديد
  const addAdminUser = async (email: string, password: string, permissions: string[]) => {
    try {
      console.log('Adding admin user:', email, 'with permissions:', permissions);
      
      // التحقق من عدم وجود البريد الإلكتروني مسبقاً
      const { data: existingUser, error: checkError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw checkError;
      }

      if (existingUser) {
        toast({
          title: "خطأ",
          description: "هذا البريد الإلكتروني موجود بالفعل",
          variant: "destructive"
        });
        return false;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          email: email,
          password_hash: password, // في التطبيق الحقيقي يجب تشفير كلمة المرور
          permissions: permissions,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding admin user:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في إضافة مستخدم الإدارة: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Admin user added successfully:', data);
      toast({
        title: "تم بنجاح",
        description: `تم إضافة مستخدم الإدارة: ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع في إضافة مستخدم الإدارة",
        variant: "destructive"
      });
      return false;
    }
  };

  // تحديث صلاحيات مستخدم إدارة
  const updateAdminUser = async (userId: string, permissions: string[]) => {
    try {
      console.log('Updating admin user permissions:', userId, permissions);
      
      const { error } = await supabase
        .from('admin_users')
        .update({ permissions: permissions })
        .eq('id', userId);

      if (error) {
        console.error('Error updating admin user:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في تحديث الصلاحيات: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث صلاحيات المستخدم بنجاح"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating admin user:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث صلاحيات المستخدم",
        variant: "destructive"
      });
      return false;
    }
  };

  // حذف مستخدم إدارة (تعطيله)
  const removeAdminUser = async (userId: string, email: string) => {
    try {
      console.log('Removing admin user:', email);
      
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        console.error('Error removing admin user:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في حذف مستخدم الإدارة: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "تم الحذف",
        description: `تم حذف مستخدم الإدارة: ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف مستخدم الإدارة",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAdminUsers();

    // إعداد التحديثات الفورية
    const channel = supabase
      .channel('admin_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_users'
        },
        (payload) => {
          console.log('Real-time admin user update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAdminUsers(prev => [payload.new as AdminUser, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAdminUsers(prev => prev.map(user => 
              user.id === payload.new.id ? payload.new as AdminUser : user
            ));
          } else if (payload.eventType === 'DELETE') {
            setAdminUsers(prev => prev.filter(user => user.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    adminUsers,
    loading,
    addAdminUser,
    updateAdminUser,
    removeAdminUser,
    refetch: fetchAdminUsers
  };
};
