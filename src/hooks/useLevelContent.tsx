
import { useState, useEffect } from 'react';
import { useUpdates } from './useUpdates';
import { useDownloads } from './useDownloads';

interface LevelContent {
  level: number;
  updates: any[];
  downloads: any[];
}

export const useLevelContent = () => {
  const { updates } = useUpdates();
  const { downloads } = useDownloads();
  const [levelContent, setLevelContent] = useState<LevelContent[]>([]);

  useEffect(() => {
    console.log('Organizing content by level...');
    console.log('Updates:', updates);
    console.log('Downloads:', downloads);
    
    // تنظيم المحتوى حسب المستويات
    const organizeContentByLevel = () => {
      const levels = [1, 2, 3, 4, 5];
      const organized = levels.map(level => ({
        level,
        updates: updates.filter(update => update.target_level === level),
        downloads: downloads.filter(download => download.target_level === level)
      }));
      
      console.log('Organized content:', organized);
      setLevelContent(organized);
    };

    organizeContentByLevel();
  }, [updates, downloads]);

  const getContentForLevel = (level: number) => {
    const content = levelContent.find(content => content.level === level);
    return content || {
      level,
      updates: [],
      downloads: []
    };
  };

  const getLevelName = (level: number) => {
    const names = {
      1: 'برونزي',
      2: 'فضي',
      3: 'ذهبي', 
      4: 'بلاتيني',
      5: 'ماسي'
    };
    return names[level as keyof typeof names] || `المستوى ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'text-orange-400',
      2: 'text-gray-400',
      3: 'text-yellow-400',
      4: 'text-purple-400', 
      5: 'text-blue-400'
    };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

  return {
    levelContent,
    getContentForLevel,
    getLevelName,
    getLevelColor
  };
};
