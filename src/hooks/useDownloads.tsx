
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DownloadLink {
  id?: number;
  name: string;
  description: string;
  download_url: string;
  version: string;
  file_size: string;
  created_at?: string;
}

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لجلب روابط التحميل من Supabase
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      console.log('Fetching downloads from Supabase...');
      
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching downloads:', error);
        throw error;
      }

      console.log('Downloads loaded from Supabase:', data);
      setDownloads(data || []);
    } catch (error) {
      console.error('Error in fetchDownloads:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل روابط التحميل",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لإضافة رابط تحميل جديد
  const addDownload = async (newDownload: Omit<DownloadLink, 'id'>) => {
    try {
      console.log('Adding new download:', newDownload);
      
      const { data, error } = await supabase
        .from('download_links')
        .insert([newDownload])
        .select()
        .single();

      if (error) {
        console.error('Error adding download:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setDownloads(prev => [data, ...prev]);
      
      toast({
        title: "نجح",
        description: "تم إضافة رابط التحميل بنجاح"
      });
    } catch (error) {
      console.error('Error adding download:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة رابط التحميل",
        variant: "destructive"
      });
    }
  };

  // وظيفة لتحديث رابط تحميل موجود
  const updateDownload = async (id: number, updatedData: Omit<DownloadLink, 'id'>) => {
    try {
      console.log('Updating download:', id, updatedData);
      
      const { data, error } = await supabase
        .from('download_links')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating download:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setDownloads(prev => prev.map(download => 
        download.id === id ? data : download
      ));
      
      toast({
        title: "نجح",
        description: "تم تحديث رابط التحميل بنجاح"
      });
    } catch (error) {
      console.error('Error updating download:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث رابط التحميل",
        variant: "destructive"
      });
    }
  };

  // وظيفة لحذف رابط تحميل
  const deleteDownload = async (id: number) => {
    try {
      console.log('Deleting download:', id);
      
      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting download:', error);
        throw error;
      }

      // تحديث القائمة المحلية
      setDownloads(prev => prev.filter(download => download.id !== id));
      
      toast({
        title: "نجح",
        description: "تم حذف رابط التحميل بنجاح"
      });
    } catch (error) {
      console.error('Error deleting download:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف رابط التحميل",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  return {
    downloads,
    loading,
    addDownload,
    updateDownload,
    deleteDownload,
    refetch: fetchDownloads
  };
};
