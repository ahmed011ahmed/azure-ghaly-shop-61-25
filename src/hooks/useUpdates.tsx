
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Update {
  id?: number;
  title: string;
  description: string;
  version: string;
  target_level?: number;
  created_at?: string;
}

export const useUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لجلب التحديثات من Supabase
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      console.log('Fetching updates from Supabase...');
      
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching updates:', error);
        throw error;
      }

      console.log('Updates loaded from Supabase:', data);
      setUpdates(data || []);
    } catch (error) {
      console.error('Error in fetchUpdates:', error);
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
      console.log('Adding new update:', newUpdate);
      
      const { data, error } = await supabase
        .from('updates')
        .insert([newUpdate])
        .select()
        .single();

      if (error) {
        console.error('Error adding update:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setUpdates(prev => [data, ...prev]);
      
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
      
      const { data, error } = await supabase
        .from('updates')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating update:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setUpdates(prev => prev.map(update => 
        update.id === id ? data : update
      ));
      
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
      
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting update:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setUpdates(prev => prev.filter(update => update.id !== id));
      
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
