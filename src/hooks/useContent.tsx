
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ContentItem, NewContentItem } from '../types/content';

export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log('Loading content from localStorage...');
      
      // جلب المحتوى من التخزين المحلي
      const storedContent = localStorage.getItem('admin_content');
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        setContent(parsedContent);
        console.log('Content loaded:', parsedContent);
      } else {
        setContent([]);
      }
    } catch (error) {
      console.error('خطأ في تحميل المحتوى:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const addContent = async (newContent: NewContentItem): Promise<void> => {
    try {
      console.log('Adding new content:', newContent);
      
      const contentItem: ContentItem = {
        id: Date.now().toString(),
        ...newContent,
        is_active: true,
        created_at: new Date().toISOString()
      };

      const updatedContent = [...content, contentItem];
      setContent(updatedContent);
      
      // حفظ في التخزين المحلي
      localStorage.setItem('admin_content', JSON.stringify(updatedContent));
      
      console.log('Content added successfully');
    } catch (error) {
      console.error('خطأ في إضافة المحتوى:', error);
      throw error;
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>): Promise<void> => {
    try {
      console.log('Updating content:', { id, updates });
      
      const updatedContent = content.map(item =>
        item.id === id
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      );
      
      setContent(updatedContent);
      localStorage.setItem('admin_content', JSON.stringify(updatedContent));
      
      console.log('Content updated successfully');
    } catch (error) {
      console.error('خطأ في تحديث المحتوى:', error);
      throw error;
    }
  };

  const deleteContent = async (id: string): Promise<void> => {
    try {
      console.log('Deleting content:', id);
      
      const updatedContent = content.filter(item => item.id !== id);
      setContent(updatedContent);
      localStorage.setItem('admin_content', JSON.stringify(updatedContent));
      
      console.log('Content deleted successfully');
    } catch (error) {
      console.error('خطأ في حذف المحتوى:', error);
      throw error;
    }
  };

  const getContentByLevel = (userLevel: number): ContentItem[] => {
    return content.filter(item => 
      item.is_active && item.minimum_level <= userLevel
    );
  };

  return {
    content,
    loading,
    addContent,
    updateContent,
    deleteContent,
    getContentByLevel,
    refreshContent: loadContent
  };
};
