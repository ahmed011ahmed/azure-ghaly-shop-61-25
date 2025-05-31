
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Update {
  id?: number;
  title: string;
  description: string;
  version: string;
  created_at?: string;
}

interface UpdateFromDB {
  id: number;
  title: string;
  description: string;
  version: string;
  created_at: string;
}

export const useUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لجلب التحديثات من Supabase
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      console.log('Fetching updates from Supabase');
      
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
      
      const updateData = {
        title: newUpdate.title,
        description: newUpdate.description,
        version: newUpdate.version
      };

      console.log('Update data to insert:', updateData);

      const { data, error } = await supabase
        .from('updates')
        .insert([updateData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في إضافة التحديث: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Update added successfully:', data);
      setUpdates(prev => [data as Update, ...prev]);
      
      toast({
        title: "نجح",
        description: "تم إضافة التحديث بنجاح"
      });
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع في إضافة التحديث",
        variant: "destructive"
      });
    }
  };

  // وظيفة لتحديث تحديث موجود
  const updateUpdate = async (id: number, updatedData: Omit<Update, 'id'>) => {
    try {
      console.log('Updating update:', id, updatedData);
      
      const updatePayload = {
        title: updatedData.title,
        description: updatedData.description,
        version: updatedData.version
      };

      const { data, error } = await supabase
        .from('updates')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating update:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في تحديث الإصدار: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

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
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في حذف التحديث: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

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
