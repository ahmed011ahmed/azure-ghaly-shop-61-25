import React from 'react';
import { Gamepad2, Star, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const PubgAccountsSection = () => {
  const { accounts, loading } = usePubgAccounts();
  const { addItem } = useCart();
  const { language } = useLanguage();

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

  const handleAddToCart = (account: any) => {
    addItem({
      id: account.id,
      name: `حساب PUBG - ${account.playerName}`,
      price: `$${account.price}`,
      image: '/placeholder.svg'
    });
  };

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

  if (availableAccounts.length === 0) {
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
            حسابات PUBG محترفة بإحصائيات عالية ورتب متقدمة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableAccounts.map((account) => (
            <Card key={account.id} className="gaming-card group hover:scale-105 transition-all duration-300">
              <CardHeader className="bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gaming-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getTierColor(account.tier)}>
                      <Trophy className="w-3 h-3 mr-1" />
                      {account.tier}
                    </Badge>
                    <Badge className="bg-green-900 text-green-200">
                      متاح
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl mb-2">
                    {account.playerName}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    معرف اللاعب: {account.playerId}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="bg-slate-950 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <Target className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <p className="text-gray-400 text-xs">K/D نسبة</p>
                    <p className="text-white font-bold">{account.kd.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-gray-400 text-xs">نسبة الفوز</p>
                    <p className="text-white font-bold">{account.winRate}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">المباريات:</span>
                    <span className="text-white">{account.matches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">المنطقة:</span>
                    <span className="text-white">{account.serverRegion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">نوع الحساب:</span>
                    <span className="text-white">
                      {account.accountType === 'main' ? 'رئيسي' : 
                       account.accountType === 'smurf' ? 'سمرف' : 'ضيف'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {account.description}
                </p>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-400">
                        ${account.price}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(account)}
                      className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      إضافة للسلة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {availableAccounts.length > 6 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              عرض المزيد من الحسابات
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PubgAccountsSection;
