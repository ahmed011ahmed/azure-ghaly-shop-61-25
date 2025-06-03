import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, Package, Users, DollarSign, TrendingUp, LogOut, MessageSquare, Calendar, Download, UserSearch, Shield, Settings, Wrench, Crown, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductManagement from '../components/admin/ProductManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import AdminLogin from '../components/admin/AdminLogin';
import AdminChat from '../components/admin/AdminChat';
import UpdatesManagement from '../components/admin/UpdatesManagement';
import DownloadsManagement from '../components/admin/DownloadsManagement';
import SubscribersManagement from '../components/admin/SubscribersManagement';
import SubscriberLevelsManagement from '../components/admin/SubscriberLevelsManagement';
import UserLookup from '../components/admin/UserLookup';
import PermissionsManagement from '../components/admin/PermissionsManagement';
import ContentViewer from '../components/admin/ContentViewer';
import AdminUsersManagement from '../components/admin/AdminUsersManagement';
import ContentManagement from '../components/admin/ContentManagement';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const userData = localStorage.getItem('current_admin_user');
    
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem('current_admin_user', JSON.stringify(user));
    console.log('Admin logged in successfully', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('current_admin_user');
    setActiveTab('overview');
    console.log('Admin logged out');
  };

  // التحقق من الصلاحيات
  const hasPermission = (permission: string) => {
    // المستخدم الأساسي GHALY له صلاحيات كاملة دائماً
    if (currentUser?.username === 'GHALY') {
      return true;
    }
    
    // للمستخدمين الآخرين، التحقق من الصلاحيات المحددة
    return currentUser?.permissions?.includes(permission) || false;
  };

  // قائمة جميع الأقسام مع شروط الصلاحيات
  const allTabs = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: Eye,
      permission: null // متاح للجميع
    },
    {
      id: 'products',
      label: 'إدارة المنتجات',
      icon: Package,
      permission: 'products'
    },
    {
      id: 'services',
      label: 'إدارة الخدمات',
      icon: Wrench,
      permission: 'services'
    },
    {
      id: 'giveaways',
      label: 'المسابقات والجوائز',
      icon: Gift,
      permission: 'giveaways'
    },
    {
      id: 'content-management',
      label: 'إدارة المحتوى',
      icon: FileText,
      permission: 'content'
    },
    {
      id: 'subscribers',
      label: 'إدارة المشتركين',
      icon: Users,
      permission: 'subscribers'
    },
    {
      id: 'subscriber-levels',
      label: 'مستويات الاشتراك',
      icon: Crown,
      permission: 'subscribers'
    },
    {
      id: 'user-lookup',
      label: 'البحث عن مشترك',
      icon: UserSearch,
      permission: 'user-lookup'
    },
    {
      id: 'permissions',
      label: 'أذونات المشتركين',
      icon: Shield,
      permission: 'permissions'
    },
    {
      id: 'admin-users',
      label: 'مستخدمي الإدارة',
      icon: Settings,
      permission: 'admin-users'
    },
    {
      id: 'downloads',
      label: 'روابط التحميل',
      icon: Download,
      permission: 'downloads'
    },
    {
      id: 'updates',
      label: 'التحديثات',
      icon: Calendar,
      permission: 'updates'
    },
    {
      id: 'content',
      label: 'عرض المحتوى',
      icon: Eye,
      permission: 'content'
    },
    {
      id: 'chat',
      label: 'شات العملاء',
      icon: MessageSquare,
      permission: 'chat'
    }
  ];

  // فلترة الأقسام حسب الصلاحيات - المستخدم GHALY يرى كل شيء
  const availableTabs = currentUser?.username === 'GHALY' 
    ? allTabs 
    : allTabs.filter(tab => 
        tab.permission === null || hasPermission(tab.permission)
      );

  // التحقق من أن التاب النشط متاح للمستخدم والتصحيح إذا لزم الأمر
  useEffect(() => {
    if (isAuthenticated && currentUser && availableTabs.length > 0) {
      const currentTabAvailable = availableTabs.find(tab => tab.id === activeTab);
      if (!currentTabAvailable) {
        setActiveTab('overview');
      }
    }
  }, [currentUser, activeTab, availableTabs, isAuthenticated]);

  // إذا لم يكن مسجل الدخول، اظهر صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // بيانات إحصائية وهمية
  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: '4',
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'إجمالي المبيعات',
      value: '$185',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'العملاء',
      value: '127',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'معدل النمو',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent mx-[13px]">
                لوحة تحكم الإدارة
              </h1>
              {currentUser && (
                <span className="text-sm text-gray-400">
                  مرحباً، {currentUser.username}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {(currentUser?.username === 'GHALY' || hasPermission('products')) && (
                <Button
                  onClick={() => setActiveTab('products')}
                  className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25 py-[16px] my-[9px] mx-[17px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة منتج جديد
                </Button>
              )}
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10 px-[4px]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 overflow-x-auto">
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gaming-gradient text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="gaming-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-950">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent className="bg-slate-950">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="gaming-card">
              <CardHeader className="bg-slate-950">
                <CardTitle className="text-xl text-white">إجراءات سريعة</CardTitle>
                <CardDescription className="text-gray-300">
                  الإجراءات الأكثر استخداماً في لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(currentUser?.username === 'GHALY' || hasPermission('products')) && (
                    <Button
                      onClick={() => setActiveTab('products')}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex-col space-y-2"
                    >
                      <Package className="w-8 h-8" />
                      <span className="font-semibold">إدارة المنتجات</span>
                      <span className="text-sm opacity-80">إضافة وتعديل المنتجات</span>
                    </Button>
                  )}
                  
                  {(currentUser?.username === 'GHALY' || hasPermission('services')) && (
                    <Button
                      onClick={() => setActiveTab('services')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex-col space-y-2"
                    >
                      <Wrench className="w-8 h-8" />
                      <span className="font-semibold">إدارة الخدمات</span>
                      <span className="text-sm opacity-80">إضافة وتعديل الخدمات</span>
                    </Button>
                  )}
                  
                  {(currentUser?.username === 'GHALY' || hasPermission('content')) && (
                    <Button
                      onClick={() => setActiveTab('content-management')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 h-auto flex-col space-y-2"
                    >
                      <FileText className="w-8 h-8" />
                      <span className="font-semibold">إدارة المحتوى</span>
                      <span className="text-sm opacity-80">إدارة المحتوى بالمستويات</span>
                    </Button>
                  )}
                  
                  {(currentUser?.username === 'GHALY' || hasPermission('subscribers')) && (
                    <Button
                      onClick={() => setActiveTab('subscribers')}
                      className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex-col space-y-2"
                    >
                      <Users className="w-8 h-8" />
                      <span className="font-semibold">إدارة المشتركين</span>
                      <span className="text-sm opacity-80">إدارة العضويات</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (currentUser?.username === 'GHALY' || hasPermission('products')) && <ProductManagement />}
        
        {activeTab === 'services' && (currentUser?.username === 'GHALY' || hasPermission('services')) && <ServicesManagement />}
        
        {activeTab === 'giveaways' && (currentUser?.username === 'GHALY' || hasPermission('giveaways')) && <GiveawaysManagement />}
        
        {activeTab === 'subscribers' && (currentUser?.username === 'GHALY' || hasPermission('subscribers')) && <SubscribersManagement />}
        
        {activeTab === 'subscriber-levels' && (currentUser?.username === 'GHALY' || hasPermission('subscribers')) && <SubscriberLevelsManagement />}
        
        {activeTab === 'user-lookup' && (currentUser?.username === 'GHALY' || hasPermission('user-lookup')) && <UserLookup />}
        
        {activeTab === 'permissions' && (currentUser?.username === 'GHALY' || hasPermission('permissions')) && <PermissionsManagement />}
        
        {activeTab === 'downloads' && (currentUser?.username === 'GHALY' || hasPermission('downloads')) && <DownloadsManagement />}
        
        {activeTab === 'updates' && (currentUser?.username === 'GHALY' || hasPermission('updates')) && <UpdatesManagement />}
        
        {activeTab === 'content' && (currentUser?.username === 'GHALY' || hasPermission('content')) && <ContentViewer />}
        
        {activeTab === 'chat' && (currentUser?.username === 'GHALY' || hasPermission('chat')) && <AdminChat />}
        
        {activeTab === 'admin-users' && (currentUser?.username === 'GHALY' || hasPermission('admin-users')) && <AdminUsersManagement />}
        
        {activeTab === 'content-management' && (currentUser?.username === 'GHALY' || hasPermission('content')) && <ContentManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
