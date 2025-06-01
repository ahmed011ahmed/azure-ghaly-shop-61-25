
import React from 'react';
import { ArrowLeft, Gamepad2, Star, Trophy, Target, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
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
    // صور مختلفة حسب الرتبة
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
            مجموعة مختارة من أفضل حسابات PUBG Mobile مع إحصائيات محترفة ورتب عالية. 
            جميع الحسابات محققة ومضمونة مع أمان كامل للعملية
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-bold">أمان مضمون</h3>
            <p className="text-gray-400 text-sm">حماية 100%</p>
          </div>
          <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-bold">رتب عالية</h3>
            <p className="text-gray-400 text-sm">من Crown إلى Conqueror</p>
          </div>
          <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-bold">إحصائيات قوية</h3>
            <p className="text-gray-400 text-sm">K/D عالي ونسبة فوز ممتازة</p>
          </div>
          <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-bold">جاهز للعب</h3>
            <p className="text-gray-400 text-sm">تسليم فوري</p>
          </div>
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
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getTierImage(account.tier)}
                    alt={`حساب ${account.playerName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* شارات الرتبة والتوفر */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className={getTierColor(account.tier)}>
                      <Trophy className="w-3 h-3 mr-1" />
                      {account.tier}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-900 text-green-200">
                      متاح الآن
                    </Badge>
                  </div>

                  {/* معلومات أساسية في أسفل الصورة */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">{account.playerName}</h3>
                    <p className="text-gray-300 text-sm">معرف: {account.playerId}</p>
                  </div>
                </div>

                <CardContent className="bg-slate-950 p-6">
                  {/* الوصف الرئيسي */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {account.description}
                  </p>

                  {/* إحصائيات مفصلة */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Target className="w-5 h-5 text-red-400 mx-auto mb-1" />
                        <p className="text-gray-400 text-xs">نسبة K/D</p>
                        <p className="text-white font-bold text-lg">{account.kd.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-gray-400 text-xs">نسبة الفوز</p>
                        <p className="text-white font-bold text-lg">{account.winRate}%</p>
                      </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">المباريات المكتملة:</span>
                        <span className="text-white font-medium">{account.matches.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">منطقة الخادم:</span>
                        <span className="text-white font-medium">{account.serverRegion}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">نوع الحساب:</span>
                        <span className="text-white font-medium">
                          {account.accountType === 'main' ? 'حساب رئيسي' : 
                           account.accountType === 'smurf' ? 'حساب سمرف' : 'حساب ضيف'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* السعر ومعلومات التواصل */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-green-400 block">
                        ${account.price}
                      </span>
                      <span className="text-gray-400 text-sm">شامل التسليم الآمن</span>
                    </div>
                    
                    <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                      <p className="text-purple-300 text-sm mb-2">للشراء أو الاستفسار</p>
                      <p className="text-white font-medium">تواصل معنا عبر الشات</p>
                    </div>
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
