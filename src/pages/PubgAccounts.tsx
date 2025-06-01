
import React from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PubgAccounts = () => {
  const { accounts, loading } = usePubgAccounts();
  
  const availableAccounts = accounts.filter(account => account.isAvailable);

  const getTierColor = (tier: string) => {
    const colors: { [key: string]: string } = {
      'Bronze': 'bg-orange-900 text-orange-200',
      'Silver': 'bg-gray-600 text-gray-200',
      'Gold': 'bg-yellow-600 text-yellow-200',
      'Platinum': 'bg-teal-600 text-teal-200',
      'Diamond': 'bg-blue-600 text-blue-200',
      'Crown': 'bg-purple-600 text-purple-200',
      'Ace': 'bg-red-600 text-red-200',
      'Conqueror': 'bg-pink-600 text-pink-200'
    };
    return colors[tier] || 'bg-gray-600 text-gray-200';
  };

  const getTierImage = (tier: string) => {
    const images: { [key: string]: string } = {
      'Bronze': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      'Silver': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
      'Gold': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      'Platinum': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      'Diamond': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      'Crown': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      'Ace': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
      'Conqueror': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
    };
    return images[tier] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Gamepad2 className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-300">جاري تحميل حسابات PUBG...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* العودة للصفحة الرئيسية */}
        <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          العودة للصفحة الرئيسية
        </Link>

        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-6">
            حسابات PUBG المتاحة
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            مجموعة مختارة من أفضل حسابات PUBG Mobile. تواصل معنا للمزيد من التفاصيل
          </p>
        </div>

        {/* قائمة الحسابات */}
        {availableAccounts.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد حسابات متاحة حالياً</h3>
            <p className="text-gray-500">سيتم إضافة حسابات جديدة قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableAccounts.map((account) => (
              <Card key={account.id} className="gaming-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* صورة الحساب */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={getTierImage(account.tier)}
                    alt={`حساب ${account.playerName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* شارة الرتبة */}
                  <div className="absolute top-4 right-4">
                    <Badge className={getTierColor(account.tier)}>
                      {account.tier}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-900 text-green-200">
                      متاح الآن
                    </Badge>
                  </div>

                  {/* اسم اللاعب */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold">{account.playerName}</h3>
                  </div>
                </div>

                <CardContent className="bg-slate-950 p-6">
                  {/* الوصف */}
                  <p className="text-gray-300 text-base leading-relaxed text-center">
                    {account.description}
                  </p>
                  
                  {/* دعوة للتواصل */}
                  <div className="mt-6 bg-purple-900/20 rounded-lg p-4 text-center">
                    <p className="text-purple-300 text-sm mb-2">للاستفسار والشراء</p>
                    <p className="text-white font-medium">تواصل معنا عبر الشات</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PubgAccounts;
