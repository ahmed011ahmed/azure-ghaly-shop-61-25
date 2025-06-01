
import React, { useState } from 'react';
import { Gamepad2, Play, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { CATEGORY_LABELS, PubgAccount } from '../types/pubgAccount';
import { Link } from 'react-router-dom';

const PubgAccountsSection = () => {
  const { accounts, loading, getAccountsByCategory } = usePubgAccounts();
  const [activeCategory, setActiveCategory] = useState<PubgAccount['category']>('worldwide');

  const categories = [
    { key: 'worldwide' as const, label: 'عالمية', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'glitch' as const, label: 'جلتش', color: 'bg-purple-600 hover:bg-purple-700' },
    { key: 'other' as const, label: 'إصدارات أخرى', color: 'bg-green-600 hover:bg-green-700' }
  ];

  const currentAccounts = getAccountsByCategory(activeCategory).slice(0, 6); // عرض أول 6 حسابات فقط
  const hasAccounts = accounts.filter(account => account.isAvailable).length > 0;

  if (loading) {
    return (
      <section id="pubg-accounts" className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Gamepad2 className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-300">جاري تحميل حسابات PUBG...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasAccounts) {
    return null;
  }

  return (
    <section id="pubg-accounts" className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-4">
            حسابات PUBG
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            حسابات PUBG متاحة بتصنيفات مختلفة - تواصل معنا للمزيد من التفاصيل
          </p>
        </div>

        {/* تصنيفات الحسابات */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`${
                  activeCategory === category.key 
                    ? category.color + ' text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-all duration-200 font-medium px-4 py-2`}
              >
                {category.label}
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getAccountsByCategory(category.key).length}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* عرض الحسابات */}
        {currentAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد حسابات {CATEGORY_LABELS[activeCategory]} متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentAccounts.map((account) => (
              <Card key={account.id} className="gaming-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* صورة الحساب */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={account.image}
                    alt="حساب PUBG"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className="bg-green-900 text-green-200">
                      متاح الآن
                    </Badge>
                    <Badge className="bg-purple-900 text-purple-200">
                      {CATEGORY_LABELS[account.category]}
                    </Badge>
                  </div>

                  {/* عرض الـ Random ID */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 text-yellow-400 px-3 py-1 rounded-lg font-bold text-sm">
                      ID: {account.randomId}
                    </div>
                  </div>

                  {/* زر تشغيل الفيديو إذا كان متوفراً */}
                  {account.video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            className="bg-purple-600/80 hover:bg-purple-600 text-white rounded-full p-4 backdrop-blur-sm"
                          >
                            <Play className="w-8 h-8" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full bg-black border-gray-800">
                          <div className="aspect-video">
                            <video
                              controls
                              autoPlay
                              className="w-full h-full rounded-lg"
                              src={account.video}
                            >
                              متصفحك لا يدعم تشغيل الفيديو
                            </video>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>

                <CardContent className="bg-slate-950 p-6">
                  {/* عرض ID الحساب */}
                  <div className="text-center mb-4">
                    <div className="inline-block bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-lg">
                      ID: {account.randomId}
                    </div>
                  </div>

                  {/* الوصف */}
                  <p className="text-gray-300 text-base leading-relaxed text-center mb-6 line-clamp-3">
                    {account.description}
                  </p>
                  
                  {/* دعوة للتواصل */}
                  <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                    <p className="text-purple-300 text-sm mb-2">للاستفسار والشراء</p>
                    <p className="text-white font-medium">تواصل معنا عبر الشات</p>
                    <div className="mt-2 text-yellow-400 font-bold text-lg">
                      السعر: ${account.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* رابط لعرض المزيد */}
        <div className="text-center mt-12">
          <Link to="/pubg-accounts">
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 group"
            >
              عرض جميع الحسابات
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PubgAccountsSection;
