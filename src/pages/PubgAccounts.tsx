
import React from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import PubgCustomerChat from '../components/PubgCustomerChat';
import PubgAccountCard from '../components/PubgAccountCard';
import { PubgChatProvider } from '../contexts/PubgChatContext';

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
        <Cart />
      </div>
    );
  }

  return (
    <PubgChatProvider>
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

          {/* شات العملاء المخصوص لـ PUBG */}
          <div className="flex justify-center mb-12">
            <PubgCustomerChat />
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
                <PubgAccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </main>

        <Footer />
        <Cart />
      </div>
    </PubgChatProvider>
  );
};

export default PubgAccounts;
