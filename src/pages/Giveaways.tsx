
import React from 'react';
import Header from '../components/Header';
import GiveawaySection from '../components/GiveawaySection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useLanguage } from '../contexts/LanguageContext';

const Giveaways = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-4">
              🎁 المسابقات والجوائز
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto">
              اكتشف جميع المسابقات المتاحة واحصل على فرصة للفوز بجوائز قيمة ومنتجات حصرية
            </p>
          </div>
        </div>
        <GiveawaySection />
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default Giveaways;
