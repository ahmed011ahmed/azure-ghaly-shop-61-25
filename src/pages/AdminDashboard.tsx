
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Eye, Package, Users, DollarSign, TrendingUp, LogOut, MessageSquare, Calendar, Download, UserSearch, Shield } from 'lucide-react';
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
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    console.log('Admin logged in successfully');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setActiveTab('overview');
    console.log('Admin logged out');
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

  const tabs = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: Eye
    },
    {
      id: 'products',
      label: 'إدارة المنتجات',
      icon: Package
    },
    {
      id: 'subscribers',
      label: 'إدارة المشتركين',
      icon: Users
    },
    {
      id: 'user-lookup',
      label: 'البحث عن مشترك',
      icon: UserSearch
    },
    {
      id: 'permissions',
      label: 'أذونات المشتركين',
      icon: Shield
    },
    {
      id: 'downloads',
      label: 'روابط التحميل',
      icon: Download
    },
    {
      id: 'updates',
      label: 'التحديثات',
      icon: Calendar
    },
    {
      id: 'content',
      label: 'عرض المحتوى',
      icon: Eye
    },
    {
      id: 'chat',
      label: 'شات العملاء',
      icon: MessageSquare
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
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setActiveTab('products')}
                className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25 py-[16px] my-[9px] mx-[17px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة منتج جديد
              </Button>
              
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
            <Card className="gaming-card">
              <CardHeader className="bg-slate-950">
                <CardTitle className="text-xl text-white">إجراءات سريعة</CardTitle>
                <CardDescription className="text-gray-300">
                  الإجراءات الأكثر استخداماً في لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setActiveTab('products')}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex-col space-y-2"
                  >
                    <Package className="w-8 h-8" />
                    <span className="font-semibold">إدارة المنتجات</span>
                    <span className="text-sm opacity-80">إضافة وتعديل المنتجات</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('subscribers')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex-col space-y-2"
                  >
                    <Users className="w-8 h-8" />
                    <span className="font-semibold">إدارة المشتركين</span>
                    <span className="text-sm opacity-80">إدارة العضويات</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('chat')}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex-col space-y-2"
                  >
                    <MessageSquare className="w-8 h-8" />
                    <span className="font-semibold">شات العملاء</span>
                    <span className="text-sm opacity-80">التواصل مع العملاء</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('updates')}
                    className="bg-orange-600 hover:bg-orange-700 text-white p-6 h-auto flex-col space-y-2"
                  >
                    <Calendar className="w-8 h-8" />
                    <span className="font-semibold">التحديثات</span>
                    <span className="text-sm opacity-80">إدارة الإصدارات</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && <ProductManagement />}
        
        {activeTab === 'subscribers' && <SubscribersManagement />}
        
        {activeTab === 'user-lookup' && <UserLookup />}
        
        {activeTab === 'permissions' && <PermissionsManagement />}
        
        {activeTab === 'downloads' && <DownloadsManagement />}
        
        {activeTab === 'updates' && <UpdatesManagement />}
        
        {activeTab === 'content' && <ContentViewer />}
        
        {activeTab === 'chat' && <AdminChat />}
      </div>
    </div>
  );
};

export default AdminDashboard;
