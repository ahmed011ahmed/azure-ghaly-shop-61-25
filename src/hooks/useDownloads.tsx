
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // وظيفة لجلب روابط التحميل من قاعدة البيانات
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('setting_key', 'downloads');

      if (error) throw error;

      if (data && data.length > 0) {
        const downloadsData = data[0].setting_value as unknown as DownloadLink[];
        setDownloads(downloadsData || []);
      } else {
        // البيانات الافتراضية
        const defaultDownloads = [
          {
            id: 1,
            name: "GHALY BYPASS TOOL",
            description: "أداة البايباس الحصرية من GHALY HAX للتجاوز المتقدم",
            download_url: "https://example.com/download1",
            version: "v2.1.4",
            file_size: "45 MB",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "GHALY INJECTOR",
            description: "أداة الحقن المتقدمة للألعاب مع دعم أحدث الألعاب",
            download_url: "https://example.com/download2",
            version: "v1.8.2",
            file_size: "32 MB",
            created_at: new Date().toISOString()
          }
        ];
        setDownloads(defaultDownloads);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
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
      const downloadWithId = {
        id: Date.now(),
        ...newDownload,
        created_at: new Date().toISOString()
      };

      const updatedList = [downloadWithId, ...downloads];
      
      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'downloads',
          setting_value: updatedList as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setDownloads(updatedList);
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
      const updatedList = downloads.map(download => 
        download.id === id ? { ...download, ...updatedData } : download
      );

      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'downloads',
          setting_value: updatedList as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setDownloads(updatedList);
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
      const updatedList = downloads.filter(download => download.id !== id);

      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'downloads',
          setting_value: updatedList as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setDownloads(updatedList);
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
