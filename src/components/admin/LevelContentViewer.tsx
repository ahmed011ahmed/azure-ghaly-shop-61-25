
import React from 'react';
import { Star, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface LevelContentViewerProps {
  level: number;
}

const LevelContentViewer = ({ level }: LevelContentViewerProps) => {
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
      <div className="flex items-center gap-3">
        <Star className={`w-6 h-6 ${getLevelColor(level)}`} />
        <h2 className="text-2xl font-bold text-white">
          محتوى {getLevelName(level)}
        </h2>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            عرض المحتوى - {getLevelName(level)}
          </CardTitle>
          <CardDescription className="text-gray-300">
            عرض جميع المحتويات المتاحة لمشتركي {getLevelName(level)}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">عارض المحتوى</h3>
            <p className="text-gray-500">
              هنا سيتم عرض جميع المحتويات الخاصة بـ {getLevelName(level)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelContentViewer;
