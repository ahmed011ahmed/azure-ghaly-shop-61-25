
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, Package, Users, DollarSign, TrendingUp, LogOut, MessageSquare, Calendar, Download, UserSearch, Shield, Gamepad2, Gift, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductManagement from '../components/admin/ProductManagement';
import AdminLogin from '../components/admin/AdminLogin';
import AdminChat from '../components/admin/AdminChat';
import UpdatesManagement from '../components/admin/UpdatesManagement';
import DownloadsManagement from '../components/admin/DownloadsManagement';
import SubscribersManagement from '../components/admin/SubscribersManagement';
import UserLookup from '../components/admin/UserLookup';
import PermissionsManagement from '../components/admin/PermissionsManagement';
import ContentViewer from '../components/admin/ContentViewer';
import PubgAccountsManagement from '../components/admin/PubgAccountsManagement';
import GiveawaysManagement from '../components/admin/GiveawaysManagement';
import AdminUsersManagement from '../components/admin/AdminUsersManagement';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      
      // جلب معلومات المستخدم الحالي
      const currentAdminUser = localStorage.getItem('current_admin_user');
      if (currentAdminUser) {
        const userData = JSON.parse(currentAdminUser);
        setCurrentUser(userData);
        console.log('Current user permissions:', userData.permissions);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    
    // جلب معلومات المستخدم بعد تسجيل الدخول
    const currentAdminUser = localStorage.getItem('current_admin_user');
    if (currentAdminUser) {
      const userData = JSON.parse(currentAdminUser);
      setCurrentUser(userData);
      console.log('User logged in with permissions:', userData.permissions);
    }
    console.log('Admin logged in successfully');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('current_admin_user');
    setCurrentUser(null);
    setActiveTab('overview');
    console.log('Admin logged out');
  };

  // التحقق من الصلاحيات
  const hasPermission = (permissionId: string) => {
    // المستخدم الأساسي GHALY له صلاحيات كاملة
    if (currentUser?.username === 'GHALY') {
      return true;
    }
    
    // التحقق من صلاحيات المستخدمين الآخرين
    return currentUser?.permissions?.includes(permissionId) || false;
  };

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
      id: 'pubg-accounts',
      label: 'حسابات PUBG',
      icon: Gamepad2,
      permission: 'pubg-accounts'
    },
    {
      id: 'giveaways',
      label: 'المسابقات والجوائز',
      icon: Gift,
      permission: 'giveaways'
    },
    {
      id: 'subscribers',
      label: 'إدارة المشتركين',
      icon: Users,
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

  // فلترة التابات حسب الصلاحيات
  const tabs = allTabs.filter(tab => {
    if (!tab.permission) return true; // نظرة عامة متاحة للجميع
    return hasPermission(tab.permission);
  });

  // التحقق من أن التاب النشط متاح للمستخدم
  useEffect(() => {
    const currentTab = allTabs.find(tab => tab.id === activeTab);
    if (currentTab && currentTab.permission && !hasPermission(currentTab.permission)) {
      setActiveTab('overview');
    }
  }, [currentUser]);

  // إنشاء قائمة الإجراءات السريعة حسب الصلاحيات
  const quickActions = [
    {
      id: 'products',
      title: 'إدارة المنتجات',
      description: 'إضافة وتعديل المنتجات',
      icon: Package,
      color: 'bg-purple-600 hover:bg-purple-700',
      permission: 'products'
    },
    {
      id: 'pubg-accounts',
      title: 'حسابات PUBG',
      description: 'إدارة حسابات اللعبة',
      icon: Gamepad2,
      color: 'bg-orange-600 hover:bg-orange-700',
      permission: 'pubg-accounts'
    },
    {
      id: 'giveaways',
      title: 'المسابقات والجوائز',
      description: 'إدارة الـ Giveaways',
      icon: Gift,
      color: 'bg-pink-600 hover:bg-pink-700',
      permission: 'giveaways'
    },
    {
      id: 'subscribers',
      title: 'إدارة المشتركين',
      description: 'إدارة العضويات',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      permission: 'subscribers'
    }
  ].filter(action => hasPermission(action.permission));

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
                <div className="text-sm text-gray-400">
                  مرحباً، {currentUser.username}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {hasPermission('products') && (
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
          {tabs.map(tab => (
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
            {quickActions.length > 0 && (
              <Card className="gaming-card">
                <CardHeader className="bg-slate-950">
                  <CardTitle className="text-xl text-white">إجراءات سريعة</CardTitle>
                  <CardDescription className="text-gray-300">
                    الإجراءات المتاحة لك في لوحة التحكم
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-slate-950">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => setActiveTab(action.id)}
                        className={`${action.color} text-white p-6 h-auto flex-col space-y-2`}
                      >
                        <action.icon className="w-8 h-8" />
                        <span className="font-semibold">{action.title}</span>
                        <span className="text-sm opacity-80">{action.description}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* رسالة في حالة عدم وجود صلاحيات */}
            {quickActions.length === 0 && (
              <Card className="gaming-card">
                <CardContent className="bg-slate-950 pt-8 pb-8 text-center">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">مرحباً بك في لوحة التحكم</h3>
                  <p className="text-gray-500">يمكنك الوصول للأقسام المتاحة لك من خلال التابات في الأعلى</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'products' && hasPermission('products') && <ProductManagement />}
        
        {activeTab === 'pubg-accounts' && hasPermission('pubg-accounts') && <PubgAccountsManagement />}
        
        {activeTab === 'giveaways' && hasPermission('giveaways') && <GiveawaysManagement />}
        
        {activeTab === 'subscribers' && hasPermission('subscribers') && <SubscribersManagement />}
        
        {activeTab === 'user-lookup' && hasPermission('user-lookup') && <UserLookup />}
        
        {activeTab === 'permissions' && hasPermission('permissions') && <PermissionsManagement />}
        
        {activeTab === 'downloads' && hasPermission('downloads') && <DownloadsManagement />}
        
        {activeTab === 'updates' && hasPermission('updates') && <UpdatesManagement />}
        
        {activeTab === 'content' && hasPermission('content') && <ContentViewer />}
        
        {activeTab === 'chat' && hasPermission('chat') && <AdminChat />}
        
        {activeTab === 'admin-users' && hasPermission('admin-users') && <AdminUsersManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
