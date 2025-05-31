
import React from 'react';
import { Eye, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useUpdates } from '../../hooks/useUpdates';
import { useDownloads } from '../../hooks/useDownloads';
import { Loader2 } from 'lucide-react';

const ContentViewer = () => {
  const { updates, loading: updatesLoading } = useUpdates();
  const { downloads, loading: downloadsLoading } = useDownloads();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">
          عرض المحتوى
        </h2>
      </div>

      {/* Updates Section */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            التحديثات
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع التحديثات المتاحة
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          {updatesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
              <span className="text-gray-300">جاري تحميل التحديثات...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => (
                <div key={update.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{update.title}</h4>
                    <span className="text-purple-400 text-sm">{update.version}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{update.description}</p>
                  <span className="text-gray-500 text-xs">
                    {new Date(update.created_at || '').toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))}
              {updates.length === 0 && (
                <p className="text-gray-500 text-center py-8">لا توجد تحديثات متاحة</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Downloads Section */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            روابط التحميل
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع روابط التحميل المتاحة
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          {downloadsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
              <span className="text-gray-300">جاري تحميل الروابط...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((download) => (
                <div key={download.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{download.name}</h4>
                    <span className="text-purple-400 text-sm">{download.version}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{download.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 text-sm">{download.file_size || 'غير محدد'}</span>
                    <a 
                      href={download.download_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      تحميل
                    </a>
                  </div>
                </div>
              ))}
              {downloads.length === 0 && (
                <p className="text-gray-500 text-center py-8">لا توجد روابط تحميل متاحة</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentViewer;
