
import React from 'react';
import { ArrowLeft, Gamepad2, Play } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PubgAccounts = () => {
  const { accounts, loading } = usePubgAccounts();

  const availableAccounts = accounts.filter(account => account.isAvailable);

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
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              لا توجد حسابات متاحة حالياً
            </h3>
            <p className="text-gray-500">سيتم إضافة حسابات جديدة قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableAccounts.map((account) => (
              <Card key={account.id} className="gaming-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* صورة الحساب */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={account.image}
                    alt="حساب PUBG"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-900 text-green-200">
                      متاح الآن
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 text-yellow-400 px-3 py-1 rounded-lg font-bold text-sm">
                      ID: {account.randomId}
                    </div>
                  </div>

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
                  <div className="text-center mb-4">
                    <div className="inline-block bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-lg">
                      ID: {account.randomId}
                    </div>
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed text-center mb-6">
                    {account.description}
                  </p>
                  
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
      </main>

      <Footer />
    </div>
  );
};

export default PubgAccounts;
