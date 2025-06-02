
import { Gamepad, ShoppingCart, Settings, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const { toggleCart, getTotalItems } = useCart();
  const { user, profile, signOut, loading } = useAuth();
  const { t, language } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCartClick = () => {
    console.log('Cart button clicked'); // للتتبع
    toggleCart();
  };

  const scrollToSection = (sectionId: string) => {
    // إذا كنا في الصفحة الرئيسية، نتنقل للقسم مباشرة
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // إذا كنا في صفحة أخرى، نذهب للصفحة الرئيسية ثم للقسم
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header className="backdrop-blur-md border-b border-purple-800/30 sticky top-0 z-50 px-[14px] bg-[#1b1b1b]">
      <div className="container mx-auto px-4 py-4 bg-[#1c1c1c]">
        <div className="flex items-center justify-between bg-[#1b1b1b]">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent px-[12px] hover:opacity-80 transition-opacity">
              {t('header.brand')}
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <button 
              onClick={() => scrollToSection('home')}
              className={`text-gray-300 hover:text-purple-400 font-medium transition-colors ${language === 'ar' ? 'px-[24px] mx-[82px]' : ''}`}
            >
              {t('header.home')}
            </button>
            <button 
              onClick={() => scrollToSection('giveaways')}
              className="text-gray-300 hover:text-purple-400 font-medium transition-colors"
            >
              المسابقات
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-gray-300 hover:text-purple-400 font-medium transition-colors"
            >
              {t('header.tools')}
            </button>
            <Link to="/subscribers" className={`text-gray-300 hover:text-purple-400 font-medium transition-colors ${language === 'ar' ? 'px-[25px] mx-[14px]' : ''}`}>
              {t('header.subscribers')}
            </Link>
            <Link to="/admin" className="text-gray-300 hover:text-purple-400 font-medium transition-colors flex items-center space-x-2">
              
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* Auth buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className={`text-gray-300 text-sm ${language === 'ar' ? 'px-[23px]' : ''}`}>
                      {t('header.welcome')} {profile?.nickname || t('header.user')}
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="border-red-500 text-red-400 bg-[#fe1c1c]/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('header.logout')}
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className={`border-purple-500 bg-[#7f00fa]/10 text-slate-50 ${language === 'ar' ? 'px-[12px] py-[9px] my-[12px] mx-[25px]' : ''}`}>
                      <User className="w-4 h-4 mr-2" />
                      {t('header.login')}
                    </Button>
                  </Link>
                )}
              </>
            )}
            
            <button 
              onClick={handleCartClick}
              className={`relative bg-gaming-gradient text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 ${language === 'ar' ? 'py-[8px] mx-[8px] my-[8px] px-[8px]' : ''}`}
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
