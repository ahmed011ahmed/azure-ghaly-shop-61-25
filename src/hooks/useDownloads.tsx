
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
      console.log('Fetching downloads...');
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('setting_key', 'downloads')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching downloads:', error);
        throw error;
      }

      if (data && data.setting_value) {
        // التأكد من أن البيانات في التنسيق الصحيح
        let downloadsData: DownloadLink[] = [];
        
        try {
          const rawData = data.setting_value;
          if (Array.isArray(rawData)) {
            downloadsData = rawData.map((item: any, index: number) => ({
              id: item.id || Date.now() + index,
              name: item.name || '',
              description: item.description || '',
              download_url: item.download_url || '',
              version: item.version || '',
              file_size: item.file_size || '',
              created_at: item.created_at || new Date().toISOString()
            }));
          }
        } catch (parseError) {
          console.error('Error parsing downloads data:', parseError);
          downloadsData = [];
        }
        
        console.log('Downloads loaded from database:', downloadsData);
        setDownloads(downloadsData);
      } else {
        // البيانات الافتراضية
        console.log('No downloads found, using default data');
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
      }
    } catch (error) {
      console.error('Error in fetchDownloads:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل روابط التحميل",
        variant: "destructive"
      });
      
      // البيانات التجريبية في حالة الفشل
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  // وظيفة مساعدة لحفظ البيانات
  const saveDownloads = async (updatedList: DownloadLink[]) => {
    try {
      console.log('Saving downloads:', updatedList);
      
      // تحويل البيانات إلى تنسيق JSON بسيط
      const jsonData = updatedList.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        download_url: item.download_url,
        version: item.version,
        file_size: item.file_size,
        created_at: item.created_at
      }));

      console.log('Prepared JSON data:', jsonData);

      const { error } = await supabase
        .from('global_settings')
        .upsert({
          setting_key: 'downloads',
          setting_value: JSON.parse(JSON.stringify(jsonData)),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Downloads saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving downloads:', error);
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
