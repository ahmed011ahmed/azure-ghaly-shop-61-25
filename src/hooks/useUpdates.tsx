
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

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

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل التحديثات:', error);
        return;
      }

      setUpdates(data || []);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();

    // إعداد Real-time subscription
    const channel = supabase
      .channel('updates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'updates'
        },
        () => {
          console.log('تم تحديث بيانات التحديثات');
          loadUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addUpdate = async (update: Omit<Update, 'id' | 'created_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('updates')
        .insert(update);

      if (error) {
        console.error('خطأ في إضافة التحديث:', error);
        throw error;
      }

      console.log('تم إضافة تحديث جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة التحديث:', error);
      throw error;
    }
  };

  const updateUpdate = async (id: number, update: Omit<Update, 'id' | 'created_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('updates')
        .update(update)
        .eq('id', id);

      if (error) {
        console.error('خطأ في تحديث التحديث:', error);
        throw error;
      }

      console.log('تم تحديث التحديث بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث التحديث:', error);
      throw error;
    }
  };

  const deleteUpdate = async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف التحديث:', error);
        throw error;
      }

      console.log('تم حذف التحديث بنجاح');
    } catch (error) {
      console.error('خطأ في حذف التحديث:', error);
      throw error;
    }
  };

  return {
    updates,
    loading,
    addUpdate,
    updateUpdate,
    deleteUpdate
  };
};
