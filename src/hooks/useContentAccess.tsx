
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscriberPermissions } from './useSubscriberPermissions';
import { supabase } from '../integrations/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'download' | 'update' | 'giveaway';
  minimum_level: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  created_at: string;
  download_url?: string;
  version?: string;
  file_size?: string;
}

export const useContentAccess = () => {
  const { user } = useAuth();
  const { checkPermission } = useSubscriberPermissions();
  const [userLevel, setUserLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // جلب مستوى المستخدم الحالي من جدول profiles
  useEffect(() => {
    const fetchUserLevel = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // جلب المستوى من جدول profiles (سنضيف المستوى هناك)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.email)
          .single();

        if (error) {
          console.error('Error fetching user level:', error);
          setUserLevel(1); // المستوى الافتراضي
        } else {
          // إذا لم يكن هناك مستوى محفوظ، نستخدم المستوى الافتراضي
          setUserLevel(1);
        }
      } catch (error) {
        console.error('Error in fetchUserLevel:', error);
        setUserLevel(1);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [user?.email]);

  // التحقق من إمكانية الوصول للمحتوى
  const canAccessContent = (requiredLevel: number): boolean => {
    if (!user?.email) return false;
    if (!checkPermission(user.email)) return false;
    return userLevel >= requiredLevel;
  };

  // فلترة المحتوى حسب مستوى المستخدم
  const filterContentByLevel = <T extends { minimum_level?: number }>(
    items: T[]
  ): T[] => {
    if (!user?.email || !checkPermission(user.email)) return [];
    
    return items.filter(item => {
      const requiredLevel = item.minimum_level || 1;
      return userLevel >= requiredLevel;
    });
  };

  return {
    userLevel,
    loading,
    canAccessContent,
    filterContentByLevel,
    hasPermission: user?.email ? checkPermission(user.email) : false
  };
};
