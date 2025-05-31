
import { useState, useEffect } from 'react';
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

  // وظيفة لجلب التحديثات من localStorage أو البيانات الافتراضية
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      console.log('Fetching updates from localStorage...');
      
      // محاولة جلب البيانات من localStorage أولاً
      const storedUpdates = localStorage.getItem('updates_data');
      
      if (storedUpdates) {
        try {
          const parsedUpdates = JSON.parse(storedUpdates);
          console.log('Updates loaded from localStorage:', parsedUpdates);
          setUpdates(parsedUpdates);
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
          loadDefaultUpdates();
        }
      } else {
        // إذا لم توجد بيانات في localStorage، استخدم البيانات الافتراضية
        loadDefaultUpdates();
      }
    } catch (error) {
      console.error('Error in fetchUpdates:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديثات",
        variant: "destructive"
      });
      loadDefaultUpdates();
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لتحميل البيانات الافتراضية
  const loadDefaultUpdates = () => {
    console.log('Loading default updates');
    const defaultUpdates: Update[] = [
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
    // حفظ البيانات الافتراضية في localStorage
    localStorage.setItem('updates_data', JSON.stringify(defaultUpdates));
  };

  // وظيفة مساعدة لحفظ البيانات في localStorage
  const saveUpdates = async (updatedList: Update[]) => {
    try {
      console.log('Saving updates to localStorage:', updatedList);
      localStorage.setItem('updates_data', JSON.stringify(updatedList));
      console.log('Updates saved successfully to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving updates to localStorage:', error);
      throw error;
    }
  };

  // وظيفة لإضافة تحديث جديد
  const addUpdate = async (newUpdate: Omit<Update, 'id'>) => {
    try {
      console.log('Adding new update:', newUpdate);
      
      const updateWithId: Update = {
        id: Date.now(),
        ...newUpdate,
        created_at: new Date().toISOString()
      };

      const updatedList = [updateWithId, ...updates];
      
      await saveUpdates(updatedList);
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
      console.log('Updating update:', id, updatedData);
      
      const updatedList = updates.map(update => 
        update.id === id ? { ...update, ...updatedData } : update
      );

      await saveUpdates(updatedList);
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
      console.log('Deleting update:', id);
      
      const updatedList = updates.filter(update => update.id !== id);

      await saveUpdates(updatedList);
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
