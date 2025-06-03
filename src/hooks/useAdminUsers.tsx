
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  password: string;
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

  // تنظيف البيانات القديمة وتحويلها للتنسيق الجديد
  const cleanAndMigrateData = (rawData: any[]) => {
    return rawData
      .filter(user => user.is_active) // فقط المستخدمين النشطين
      .map(user => {
        // إذا كان المستخدم يحتوي على username و password فهو بالتنسيق الصحيح
        if (user.username && user.password) {
          return user;
        }
        
        // إذا كان يحتوي على email فقط، تجاهله (بيانات قديمة غير مكتملة)
        if (user.email && !user.username) {
          return null;
        }
        
        return user;
      })
      .filter(user => user !== null); // إزالة القيم الفارغة
  };

  // جلب قائمة مستخدمي الإدارة من localStorage
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading admin users from localStorage');
      
      const storedData = localStorage.getItem(STORAGE_KEY);
      const rawUsers = storedData ? JSON.parse(storedData) : [];
      
      // تنظيف وتنسيق البيانات
      const cleanedUsers = cleanAndMigrateData(rawUsers);
      
      // حفظ البيانات المنظفة
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedUsers));
      
      console.log('Admin users loaded and cleaned:', cleanedUsers);
      setAdminUsers(cleanedUsers);
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
      console.log('Adding admin user:', username, 'with password:', password, 'and permissions:', permissions);
      
      // التحقق من عدم وجود اسم المستخدم مسبقاً
      const storedData = localStorage.getItem(STORAGE_KEY);
      const existingUsers = storedData ? JSON.parse(storedData) : [];
      
      const existingUser = existingUsers.find((user: AdminUser) => 
        user.username === username.trim() && user.is_active
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
        username: username.trim(),
        password: password.trim(),
        permissions: permissions,
        created_at: new Date().toISOString(),
        is_active: true
      };

      const updatedUsers = [...existingUsers, newUser];
      
      // حفظ جميع المستخدمين في localStorage (بما في ذلك غير النشطين)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // تحديث الحالة المحلية بالمستخدمين النشطين فقط
      const activeUsers = updatedUsers.filter(user => user.is_active);
      setAdminUsers(activeUsers);

      console.log('Admin user added successfully:', newUser);
      console.log('Updated users array in localStorage:', updatedUsers);
      console.log('Active users for display:', activeUsers);
      
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
      
      // تحديث الحالة المحلية بالمستخدمين النشطين فقط
      const activeUsers = updatedUsers.filter((user: AdminUser) => user.is_active);
      setAdminUsers(activeUsers);

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
      
      // تعطيل المستخدم بدلاً من حذفه
      const updatedUsers = existingUsers.map((user: AdminUser) =>
        user.id === userId ? { ...user, is_active: false } : user
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // تحديث الحالة المحلية بالمستخدمين النشطين فقط
      const activeUsers = updatedUsers.filter((user: AdminUser) => user.is_active);
      setAdminUsers(activeUsers);

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
