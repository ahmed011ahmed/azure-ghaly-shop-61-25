
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import PubgAccountsSection from '../components/PubgAccountsSection';
import CustomerChat from '../components/CustomerChat';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import { CartProvider } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Header />
        <main>
          <Hero />
          <ProductsSection />
          <PubgAccountsSection />
          
          {/* قسم شات العملاء */}
          <section id="chat" className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-4">
                  {t('chat.title')}
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {t('chat.subtitle')}
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <CustomerChat />
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default Index;
