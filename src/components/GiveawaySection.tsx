
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Gift, Users, Calendar, Trophy, Clock, Star } from 'lucide-react';
import { useGiveaways } from '../hooks/useGiveaways';

const GiveawaySection = () => {
  const { giveaways, loading } = useGiveaways();

  // فلترة الـ Giveaways النشطة وغير المنتهية الصلاحية
  const activeGiveaways = giveaways.filter(g => 
    g.isActive && new Date(g.endDate) > new Date()
  );

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهى';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} يوم ${hours} ساعة`;
    } else {
      return `${hours} ساعة`;
    }
  };

  const handleBenefit = (giveaway: any) => {
    if (giveaway.participationLink) {
      // فتح الرابط في تبويب جديد
      window.open(giveaway.participationLink, '_blank');
    } else {
      console.log('الاستفادة من العرض:', giveaway.id);
      // يمكن إضافة منطق افتراضي هنا
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Gift className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-300">جاري تحميل المسابقات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeGiveaways.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Gift className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              لا توجد مسابقات نشطة حالياً
            </h2>
            <p className="text-gray-300 text-lg">
              ترقبوا مسابقات جديدة قريباً!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-4">
        {/* Giveaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeGiveaways.map((giveaway) => (
            <Card key={giveaway.id} className="gaming-card group hover:scale-105 transition-all duration-300">
              <CardHeader className="bg-slate-950 pb-4">
                <div className="relative mb-4">
                  <img
                    src={giveaway.image}
                    alt={giveaway.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-purple-600 text-white">
                    <Gift className="w-3 h-3 mr-1" />
                    جائزة
                  </Badge>
                </div>
                
                <CardTitle className="text-white text-xl group-hover:text-purple-400 transition-colors">
                  {giveaway.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300">
                  {giveaway.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="bg-slate-950 pt-0">
                {/* الجائزة */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-600/30">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-semibold">الجائزة:</span>
                  </div>
                  <span className="text-yellow-400 font-bold">{giveaway.prize}</span>
                </div>

                {/* معلومات إضافية */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      المشاركين
                    </div>
                    <span className="text-blue-400 font-semibold">{giveaway.participantsCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-green-400" />
                      الوقت المتبقي
                    </div>
                    <span className="text-green-400 font-semibold">
                      {formatTimeLeft(giveaway.endDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      ينتهي في
                    </div>
                    <span className="text-purple-400 font-semibold text-xs">
                      {new Date(giveaway.endDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>

                {/* زر الاستفادة */}
                <Button 
                  className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={() => handleBenefit(giveaway)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  استفيد
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiveawaySection;
