
import React, { useState } from 'react';
import { Star, Users, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import LevelSubscribersManagement from './LevelSubscribersManagement';
import LevelUpdatesManagement from './LevelUpdatesManagement';
import LevelDownloadsManagement from './LevelDownloadsManagement';
import LevelContentViewer from './LevelContentViewer';

interface LevelManagementProps {
  level: number;
}

const LevelManagement = ({ level }: LevelManagementProps) => {
  const getLevelName = (level: number) => {
    const names = { 1: 'برونزي', 2: 'فضي', 3: 'ذهبي', 4: 'بلاتيني', 5: 'ماسي' };
    return names[level as keyof typeof names] || `المستوى ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors = { 1: 'text-orange-400', 2: 'text-gray-400', 3: 'text-yellow-400', 4: 'text-purple-400', 5: 'text-blue-400' };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Star className={`w-8 h-8 ${getLevelColor(level)}`} />
        <div>
          <h1 className="text-3xl font-bold text-white">
            إدارة المستوى {getLevelName(level)}
          </h1>
          <p className="text-gray-400">
            إدارة شاملة للمشتركين والمحتوى الخاص بالمستوى {getLevelName(level)}
          </p>
        </div>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="subscribers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="subscribers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            المشتركين
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            التحديثات
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            التحميلات
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            عرض المحتوى
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="mt-6">
          <LevelSubscribersManagement level={level} />
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <LevelUpdatesManagement level={level} />
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <LevelDownloadsManagement level={level} />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <LevelContentViewer level={level} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LevelManagement;
