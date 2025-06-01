
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  permissions: string[];
  created_at: string;
  is_active: boolean;
}

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // حفظ البيانات في localStorage مؤقتاً حتى يتم إنشاء جدول admin_users
  const STORAGE_KEY = 'admin_users_data';

  // جلب قائمة مستخدمي الإدارة من localStorage
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading admin users from localStorage');
      
      const storedData = localStorage.getItem(STORAGE_KEY);
      const users = storedData ? JSON.parse(storedData) : [];
      
      console.log('Admin users loaded from localStorage:', users);
      setAdminUsers(users);
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
  const addAdminUser = async (username: string, password: string, permissions: string[]) => {
    try {
      console.log('Adding admin user:', username, 'with permissions:', permissions);
      
      // التحقق من عدم وجود اسم المستخدم مسبقاً
      const storedData = localStorage.getItem(STORAGE_KEY);
      const existingUsers = storedData ? JSON.parse(storedData) : [];
      
      const existingUser = existingUsers.find((user: AdminUser) => 
        user.username === username && user.is_active
      );

      if (existingUser) {
        toast({
          title: "خطأ",
          description: "اسم المستخدم موجود بالفعل",
          variant: "destructive"
        });
        return false;
      }

      const newUser: AdminUser = {
        id: Date.now().toString(),
        username: username,
        permissions: permissions,
        created_at: new Date().toISOString(),
        is_active: true
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      setAdminUsers(updatedUsers);

      console.log('Admin user added successfully:', newUser);
      toast({
        title: "تم بنجاح",
        description: `تم إضافة مستخدم الإدارة: ${username}`
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
      
      const storedData = localStorage.getItem(STORAGE_KEY);
      const existingUsers = storedData ? JSON.parse(storedData) : [];
      
      const updatedUsers = existingUsers.map((user: AdminUser) =>
        user.id === userId ? { ...user, permissions } : user
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      setAdminUsers(updatedUsers);

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
  const removeAdminUser = async (userId: string, username: string) => {
    try {
      console.log('Removing admin user:', username);
      
      const storedData = localStorage.getItem(STORAGE_KEY);
      const existingUsers = storedData ? JSON.parse(storedData) : [];
      
      const updatedUsers = existingUsers.map((user: AdminUser) =>
        user.id === userId ? { ...user, is_active: false } : user
      ).filter((user: AdminUser) => user.is_active);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      setAdminUsers(updatedUsers);

      toast({
        title: "تم الحذف",
        description: `تم حذف مستخدم الإدارة: ${username}`
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
