
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

  // وظيفة لجلب روابط التحميل من localStorage أو البيانات الافتراضية
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      console.log('Fetching downloads from localStorage...');
      
      // محاولة جلب البيانات من localStorage أولاً
      const storedDownloads = localStorage.getItem('downloads_data');
      
      if (storedDownloads) {
        try {
          const parsedDownloads = JSON.parse(storedDownloads);
          console.log('Downloads loaded from localStorage:', parsedDownloads);
          setDownloads(parsedDownloads);
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
          loadDefaultDownloads();
        }
      } else {
        // إذا لم توجد بيانات في localStorage، استخدم البيانات الافتراضية
        loadDefaultDownloads();
      }
    } catch (error) {
      console.error('Error in fetchDownloads:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل روابط التحميل",
        variant: "destructive"
      });
      loadDefaultDownloads();
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لتحميل البيانات الافتراضية
  const loadDefaultDownloads = () => {
    console.log('Loading default downloads');
    const defaultDownloads: DownloadLink[] = [
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
    // حفظ البيانات الافتراضية في localStorage
    localStorage.setItem('downloads_data', JSON.stringify(defaultDownloads));
  };

  // وظيفة مساعدة لحفظ البيانات في localStorage
  const saveDownloads = async (updatedList: DownloadLink[]) => {
    try {
      console.log('Saving downloads to localStorage:', updatedList);
      localStorage.setItem('downloads_data', JSON.stringify(updatedList));
      console.log('Downloads saved successfully to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving downloads to localStorage:', error);
      throw error;
    }
  };

  // وظيفة لإضافة رابط تحميل جديد
  const addDownload = async (newDownload: Omit<DownloadLink, 'id'>) => {
    try {
      console.log('Adding new download:', newDownload);
      
      const downloadWithId: DownloadLink = {
        id: Date.now(),
        ...newDownload,
        created_at: new Date().toISOString()
      };

      const updatedList = [downloadWithId, ...downloads];
      
      await saveDownloads(updatedList);
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
      console.log('Updating download:', id, updatedData);
      
      const updatedList = downloads.map(download => 
        download.id === id ? { ...download, ...updatedData } : download
      );

      await saveDownloads(updatedList);
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
      console.log('Deleting download:', id);
      
      const updatedList = downloads.filter(download => download.id !== id);

      await saveDownloads(updatedList);
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
