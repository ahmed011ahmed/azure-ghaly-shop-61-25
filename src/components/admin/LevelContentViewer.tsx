
import React from 'react';
import { Star, Download, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLevelContent } from '../../hooks/useLevelContent';

interface LevelContentViewerProps {
  level: number;
}

const LevelContentViewer = ({ level }: LevelContentViewerProps) => {
  const { getContentForLevel, getLevelName, getLevelColor } = useLevelContent();
  const content = getContentForLevel(level);

  console.log(`Loading content for level ${level}:`, content);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className={`w-6 h-6 ${getLevelColor(level)}`} />
        <h3 className="text-xl font-bold text-white">
          محتوى {getLevelName(level)} (المستوى {level})
        </h3>
      </div>

      {/* التحديثات المتاحة لهذا المستوى */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-blue-400" />
            التحديثات المتاحة ({content.updates.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            التحديثات المخصصة للمستوى {getLevelName(level)}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {content.updates.length > 0 ? (
            <div className="space-y-3">
              {content.updates.map((update, index) => (
                <div key={update.id || index} className="p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{update.title}</h4>
                      <p className="text-gray-300 text-sm mt-1">{update.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          الإصدار {update.version}
                        </Badge>
                        {update.created_at && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(update.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">لا توجد تحديثات متاحة لهذا المستوى</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* التحميلات المتاحة لهذا المستوى */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white flex items-center">
            <Download className="w-5 h-5 mr-2 text-green-400" />
            التحميلات المتاحة ({content.downloads.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            الملفات والتحميلات المخصصة للمستوى {getLevelName(level)}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {content.downloads.length > 0 ? (
            <div className="space-y-3">
              {content.downloads.map((download, index) => (
                <div key={download.id || index} className="p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{download.name}</h4>
                      <p className="text-gray-300 text-sm mt-1">{download.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          الإصدار {download.version}
                        </Badge>
                        {download.file_size && (
                          <Badge variant="outline" className="text-xs">
                            {download.file_size} MB
                          </Badge>
                        )}
                        {download.created_at && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(download.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => window.open(download.download_url, '_blank')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Download className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">لا توجد تحميلات متاحة لهذا المستوى</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelContentViewer;
