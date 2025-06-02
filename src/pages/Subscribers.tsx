
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Shield, Users, Lock, Crown, Star, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUpdates } from '../hooks/useUpdates';
import { useDownloads } from '../hooks/useDownloads';
import { useContentAccess } from '../hooks/useContentAccess';
import { SUBSCRIPTION_LEVELS } from '../types/subscriber';

const Subscribers = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { updates, loading: updatesLoading } = useUpdates();
  const { downloads, loading: downloadsLoading } = useDownloads();
  const { userLevel, loading: contentLoading, availableContent, hasPermission } = useContentAccess();

  const handleDownload = (name: string, url: string) => {
    toast({
      title: "جاري التحميل",
      description: `بدء تحميل ${name}`,
    });
    window.open(url, '_blank');
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Shield className="w-5 h-5" />;
      case 2: return <Shield className="w-5 h-5" />;
      case 3: return <Star className="w-5 h-5" />;
      case 4: return <Diamond className="w-5 h-5" />;
      case 5: return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getCurrentLevelInfo = () => {
    return SUBSCRIPTION_LEVELS.find(level => level.level === userLevel) || SUBSCRIPTION_LEVELS[0];
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

  // إذا كان المستخدم مسجل دخول لكن ليس لديه إذن
  if (!loading && !contentLoading && user && !hasPermission) {
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

        {/* Access Denied */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Card className="gaming-card">
              <CardHeader className="bg-slate-900">
                <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-white">وصول مرفوض</CardTitle>
                <CardDescription className="text-gray-300">
                  ليس لديك صلاحية للوصول إلى منطقة المشتركين
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950 pt-6">
                <p className="text-gray-400 mb-4">
                  يرجى التواصل مع الإدارة للحصول على صلاحية الوصول
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    العودة للصفحة الرئيسية
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading || updatesLoading || downloadsLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  // فلترة المحتوى حسب مستوى المستخدم - استخدام availableContent المتاح بالفعل
  const accessibleDownloads = availableContent.filter(item => item.type === 'download');
  const accessibleUpdates = availableContent.filter(item => item.type === 'update');
  
  const currentLevelInfo = getCurrentLevelInfo();

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
            <div className="flex items-center space-x-3">
              <Badge className={`${currentLevelInfo.color} border-current`}>
                {getLevelIcon(userLevel)}
                <span className="mr-2">المستوى {userLevel} - {currentLevelInfo.name}</span>
              </Badge>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">{user?.email}</span>
              </div>
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
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-6">
            احصل على آخر الإصدارات والتحديثات الحصرية لأدوات GHALY HAX
          </p>
          
          {/* User Level Info */}
          <Card className="gaming-card max-w-md mx-auto">
            <CardHeader className="bg-slate-900">
              <CardTitle className={`text-xl ${currentLevelInfo.color} flex items-center justify-center`}>
                {getLevelIcon(userLevel)}
                <span className="mr-2">مستوى اشتراكك: {currentLevelInfo.name}</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                {currentLevelInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-slate-950 pt-4">
              <p className="text-gray-400 text-sm">
                يمكنك الوصول إلى جميع المحتوى للمستوى {userLevel} وما دونه
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Download className="w-6 h-6 mr-3 text-purple-400" />
            روابط التحميل المتاحة لك
          </h3>
          
          {accessibleDownloads.length === 0 ? (
            <Card className="gaming-card">
              <CardContent className="pt-6 bg-slate-950 text-center">
                <Download className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد تحميلات متاحة</h3>
                <p className="text-gray-500">
                  لا توجد ملفات متاحة للتحميل في مستوى اشتراكك الحالي
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accessibleDownloads.map((item) => (
                <Card key={item.id} className="gaming-card hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                  <CardHeader className="bg-slate-900">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-purple-400 border-purple-400">
                          المستوى {item.minimum_level || 1}+
                        </Badge>
                        {item.version && (
                          <span className="text-sm text-purple-400 font-normal">{item.version}</span>
                        )}
                      </div>
                    </div>
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
                      onClick={() => handleDownload(item.title, item.download_url || '')}
                      className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل الآن
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Updates Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-purple-400" />
            آخر التحديثات المتاحة لك
          </h3>
          
          {accessibleUpdates.length === 0 ? (
            <Card className="gaming-card">
              <CardContent className="pt-6 bg-slate-950 text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد تحديثات متاحة</h3>
                <p className="text-gray-500">
                  لا توجد تحديثات متاحة في مستوى اشتراكك الحالي
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {accessibleUpdates.map((update) => (
                <Card key={update.id} className="gaming-card">
                  <CardHeader className="bg-slate-900">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{update.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-purple-400 border-purple-400">
                          المستوى {update.minimum_level || 1}+
                        </Badge>
                        {update.version && (
                          <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                            {update.version}
                          </span>
                        )}
                        <span className="text-sm text-gray-400">
                          {new Date(update.created_at || '').toLocaleDateString('ar-EG')}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
