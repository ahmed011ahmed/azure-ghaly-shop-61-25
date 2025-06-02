
import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, toggleCart } = useCart();
  const { t, language } = useLanguage();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: t('nav.home'), href: '/', section: 'home' },
    { name: t('nav.products'), href: '/', section: 'products' },
    { name: t('nav.services'), href: '/services', section: 'services' },
    { name: t('nav.giveaways'), href: '/', section: 'giveaways' },
    { name: t('nav.chat'), href: '/', section: 'chat' }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.href === '/') {
      // للصفحة الرئيسية، نستخدم التمرير للقسم
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gaming-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              GHALY STORE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href === '/services' ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-purple-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-800/30">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                item.href === '/services' ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors font-medium px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="text-gray-300 hover:text-purple-400 transition-colors font-medium text-left px-4 py-2"
                  >
                    {item.name}
                  </button>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
