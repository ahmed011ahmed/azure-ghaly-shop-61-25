
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id: number;
  title: string;
  description: string;
  version: string;
  created_at: string;
}

interface DownloadLink {
  id: number;
  name: string;
  description: string;
  download_url: string;
  version: string;
  file_size: string;
}

const Subscribers = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  // بيانات محلية للتحديثات
  const [updates] = useState<Update[]>([
    {
      id: 1,
      title: "تحديث البايباس الجديد",
      description: "تحديث شامل لنظام البايباس مع تحسينات في الأداء والأمان وإضافة ميزات جديدة لتجاوز أحدث أنظمة الحماية",
      version: "v2.1.4",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "إصلاح أخطاء الإصدار السابق",
      description: "تم إصلاح المشاكل المتعلقة بالاتصال وتحسين استقرار البرنامج",
      version: "v2.1.3",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  // بيانات محلية لروابط التحميل
  const [downloadLinks] = useState<DownloadLink[]>([
    {
      id: 1,
      name: "GHALY BYPASS TOOL",
      description: "أداة البايباس الحصرية من GHALY HAX للتجاوز المتقدم",
      download_url: "https://example.com/download1",
      version: "v2.1.4",
      file_size: "45 MB"
    },
    {
      id: 2,
      name: "GHALY INJECTOR",
      description: "أداة الحقن المتقدمة للألعاب مع دعم أحدث الألعاب",
      download_url: "https://example.com/download2",
      version: "v1.8.2",
      file_size: "32 MB"
    }
  ]);

  const handleDownload = (name: string, url: string) => {
    toast({
      title: "جاري التحميل",
      description: `بدء تحميل ${name}`,
    });
    window.open(url, '_blank');
  };

  // إذا لم يكن المستخدم مسجل دخول
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        {/* Header */}
        <header className="bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mx-[13px]">
                  منطقة المشتركين
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Login Required */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Card className="gaming-card">
              <CardHeader className="bg-slate-900">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-white">منطقة مقيدة</CardTitle>
                <CardDescription className="text-gray-300">
                  يجب تسجيل الدخول للوصول إلى منطقة المشتركين
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950 pt-6">
                <Link to="/auth">
                  <Button className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25">
                    تسجيل الدخول
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mx-[13px]">
                منطقة المشتركين
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">مرحباً، {user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            مرحباً بك في <span className="bg-gaming-gradient bg-clip-text text-transparent">منطقة المشتركين</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            احصل على آخر الإصدارات والتحديثات الحصرية لأدوات GHALY HAX
          </p>
        </div>

        {/* Download Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Download className="w-6 h-6 mr-3 text-purple-400" />
            روابط التحميل
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloadLinks.map((item) => (
              <Card key={item.id} className="gaming-card hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <CardHeader className="bg-slate-900">
                  <CardTitle className="text-xl text-white flex items-center justify-between">
                    {item.name}
                    <span className="text-sm text-purple-400 font-normal">{item.version}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-slate-950 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">الحجم: {item.file_size || 'غير محدد'}</span>
                    <span className="text-sm text-green-400">متاح للتحميل</span>
                  </div>
                  <Button 
                    onClick={() => handleDownload(item.name, item.download_url)}
                    className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Updates Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-purple-400" />
            آخر التحديثات
          </h3>
          
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update.id} className="gaming-card">
                <CardHeader className="bg-slate-900">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{update.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {update.version && (
                        <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                          {update.version}
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(update.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-slate-950 pt-4">
                  <p className="text-gray-300">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
