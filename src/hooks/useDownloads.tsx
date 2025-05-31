
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

interface DownloadFromDB {
  id: number;
  name: string;
  description: string;
  download_url: string;
  version: string;
  file_size: string;
  created_at: string;
}

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لجلب روابط التحميل من Supabase
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      console.log('Fetching downloads from Supabase');
      
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
      
      const downloadData = {
        name: newDownload.name,
        description: newDownload.description,
        download_url: newDownload.download_url,
        version: newDownload.version,
        file_size: newDownload.file_size || ''
      };

      console.log('Download data to insert:', downloadData);

      const { data, error } = await supabase
        .from('download_links')
        .insert([downloadData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في إضافة رابط التحميل: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Download added successfully:', data);
      
      toast({
        title: "نجح",
        description: "تم إضافة رابط التحميل بنجاح"
      });
    } catch (error) {
      console.error('Error adding download:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع في إضافة رابط التحميل",
        variant: "destructive"
      });
    }
  };

  // وظيفة لتحديث رابط تحميل موجود
  const updateDownload = async (id: number, updatedData: Omit<DownloadLink, 'id'>) => {
    try {
      console.log('Updating download:', id, updatedData);
      
      const downloadPayload = {
        name: updatedData.name,
        description: updatedData.description,
        download_url: updatedData.download_url,
        version: updatedData.version,
        file_size: updatedData.file_size || ''
      };

      const { data, error } = await supabase
        .from('download_links')
        .update(downloadPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating download:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في تحديث رابط التحميل: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

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
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `فشل في حذف رابط التحميل: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

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

    // إعداد التحديثات الفورية لروابط التحميل
    const channel = supabase
      .channel('downloads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'download_links'
        },
        (payload) => {
          console.log('Real-time download update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setDownloads(prev => [payload.new as DownloadLink, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDownloads(prev => prev.map(download => 
              download.id === payload.new.id ? payload.new as DownloadLink : download
            ));
          } else if (payload.eventType === 'DELETE') {
            setDownloads(prev => prev.filter(download => download.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
