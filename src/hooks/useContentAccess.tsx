
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscriberPermissions } from './useSubscriberPermissions';
import { useSubscribers } from './useSubscribers';
import { ContentItem } from '../types/content';

export const useContentAccess = () => {
  const { user } = useAuth();
  const { checkPermission } = useSubscriberPermissions();
  const { subscribers } = useSubscribers();
  const [userLevel, setUserLevel] = useState<number>(1);
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب مستوى المستخدم الحالي
  useEffect(() => {
    const fetchUserLevel = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // البحث عن المستخدم في قائمة المشتركين للحصول على مستواه
        const currentUserSubscription = subscribers.find(
          subscriber => subscriber.email === user.email || subscriber.id === user.email
        );

        if (currentUserSubscription) {
          setUserLevel(currentUserSubscription.subscription_level);
          console.log('User level found:', currentUserSubscription.subscription_level);
        } else {
          // إذا لم يوجد في قائمة المشتركين، استخدم المستوى الافتراضي
          setUserLevel(1);
          console.log('User not found in subscribers, using default level 1');
        }
      } catch (error) {
        console.error('Error in fetchUserLevel:', error);
        setUserLevel(1);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, [user?.email, subscribers]);

  // جلب المحتوى المتاح وفلترته حسب مستوى المستخدم
  useEffect(() => {
    const loadAvailableContent = () => {
      try {
        // جلب المحتوى من التخزين المحلي
        const storedContent = localStorage.getItem('admin_content');
        if (storedContent) {
          const allContent: ContentItem[] = JSON.parse(storedContent);
          
          // فلترة المحتوى حسب مستوى المستخدم والتفعيل
          const filteredContent = allContent.filter(item => 
            item.is_active && 
            userLevel >= item.minimum_level &&
            (user?.email ? checkPermission(user.email) : false)
          );
          
          setAvailableContent(filteredContent);
          console.log('Available content for user level', userLevel, ':', filteredContent);
        } else {
          setAvailableContent([]);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setAvailableContent([]);
      }
    };

    if (user?.email && !loading) {
      loadAvailableContent();
    }
  }, [user?.email, userLevel, loading, checkPermission]);

  // التحقق من إمكانية الوصول للمحتوى
  const canAccessContent = (requiredLevel: number): boolean => {
    if (!user?.email) return false;
    if (!checkPermission(user.email)) return false;
    return userLevel >= requiredLevel;
  };

  // فلترة المحتوى حسب النوع
  const getContentByType = (type: string): ContentItem[] => {
    return availableContent.filter(item => item.type === type);
  };

  // جلب المحتوى حسب المستوى
  const getContentByLevel = (level: number): ContentItem[] => {
    return availableContent.filter(item => item.minimum_level === level);
  };

  return {
    userLevel,
    loading,
    availableContent,
    canAccessContent,
    getContentByType,
    getContentByLevel,
    hasPermission: user?.email ? checkPermission(user.email) : false
  };
};
