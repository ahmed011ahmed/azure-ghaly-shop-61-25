
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id?: number;
  title: string;
  description: string;
  version: string;
  created_at?: string;
}

export const useUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لجلب التحديثات من قاعدة البيانات
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      
      // نستخدم جدول global_settings لحفظ التحديثات
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('setting_key', 'updates');

      if (error) throw error;

      if (data && data.length > 0) {
        const updatesData = data[0].setting_value as Update[];
        setUpdates(updatesData || []);
      } else {
        // إذا لم توجد بيانات، نضع البيانات الافتراضية
        const defaultUpdates = [
          {
            id: 1,
            title: "تحديث البايباس الجديد",
            description: "تحديث شامل لنظام البايباس مع تحسينات في الأداء والأمان وإضافة ميزات جديدة لتجاوز أحدث أنظمة الحماية",
            version: "v2.1.4",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: "إصلاح أخطاء الإصدار السابق",
            description: "تم إصلاح المشاكل المتعلقة بالاتصال وتحسين استقرار البرنامج",
            version: "v2.1.3",
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setUpdates(defaultUpdates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديثات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لإضافة تحديث جديد
  const addUpdate = async (newUpdate: Omit<Update, 'id'>) => {
    try {
      const updateWithId = {
        id: Date.now(),
        ...newUpdate,
        created_at: new Date().toISOString()
      };

      const updatedList = [updateWithId, ...updates];
      
      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'updates',
          setting_value: updatedList,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setUpdates(updatedList);
      toast({
        title: "نجح",
        description: "تم إضافة التحديث بنجاح"
      });
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة التحديث",
        variant: "destructive"
      });
    }
  };

  // وظيفة لتحديث تحديث موجود
  const updateUpdate = async (id: number, updatedData: Omit<Update, 'id'>) => {
    try {
      const updatedList = updates.map(update => 
        update.id === id ? { ...update, ...updatedData } : update
      );

      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'updates',
          setting_value: updatedList,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setUpdates(updatedList);
      toast({
        title: "نجح",
        description: "تم تحديث الإصدار بنجاح"
      });
    } catch (error) {
      console.error('Error updating update:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإصدار",
        variant: "destructive"
      });
    }
  };

  // وظيفة لحذف تحديث
  const deleteUpdate = async (id: number) => {
    try {
      const updatedList = updates.filter(update => update.id !== id);

      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'updates',
          setting_value: updatedList,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setUpdates(updatedList);
      toast({
        title: "نجح",
        description: "تم حذف التحديث بنجاح"
      });
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف التحديث",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return {
    updates,
    loading,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    refetch: fetchUpdates
  };
};
