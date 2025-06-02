
import React from 'react';
import Header from '../components/Header';
import ServicesSection from '../components/ServicesSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useLanguage } from '../contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Header />
      <main>
        <div className="pt-20 pb-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              حسابات <span className="bg-gaming-gradient bg-clip-text text-transparent">احترافية</span>
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
              اكتشف مجموعة واسعة من الحسابات المتخصصة لتطوير تجربة اللعب وتحسين الأداء
            </p>
          </div>
        </div>
        <ServicesSection />
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default Services;
