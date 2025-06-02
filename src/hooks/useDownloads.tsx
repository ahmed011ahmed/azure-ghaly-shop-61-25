import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Download {
  id?: number;
  name: string;
  description: string;
  version: string;
  download_url: string;
  file_size?: string;
  created_at?: string;
  minimum_level?: number; // إضافة هذه الخاصية
}

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل روابط التحميل:', error);
        return;
      }

      // إضافة minimum_level افتراضي للتحميلات الموجودة
      const downloadsWithLevel = (data || []).map(download => ({
        ...download,
        minimum_level: 1 // المستوى الافتراضي
      }));

      setDownloads(downloadsWithLevel);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();

    // إعداد Real-time subscription
    const channel = supabase
      .channel('downloads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'download_links'
        },
        () => {
          console.log('تم تحديث بيانات روابط التحميل');
          loadDownloads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDownload = async (download: Omit<Download, 'id' | 'created_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('download_links')
        .insert(download);

      if (error) {
        console.error('خطأ في إضافة رابط التحميل:', error);
        throw error;
      }

      console.log('تم إضافة رابط تحميل جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة رابط التحميل:', error);
      throw error;
    }
  };

  const updateDownload = async (id: number, download: Omit<Download, 'id' | 'created_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('download_links')
        .update(download)
        .eq('id', id);

      if (error) {
        console.error('خطأ في تحديث رابط التحميل:', error);
        throw error;
      }

      console.log('تم تحديث رابط التحميل بنجاح');
    } catch (error) {
      console.error('خطأ في تحديث رابط التحميل:', error);
      throw error;
    }
  };

  const deleteDownload = async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف رابط التحميل:', error);
        throw error;
      }

      console.log('تم حذف رابط التحميل بنجاح');
    } catch (error) {
      console.error('خطأ في حذف رابط التحميل:', error);
      throw error;
    }
  };

  return {
    downloads,
    loading,
    addDownload,
    updateDownload,
    deleteDownload
  };
};
