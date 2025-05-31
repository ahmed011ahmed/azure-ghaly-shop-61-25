import { Gamepad, ShoppingCart, Settings, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
const Header = () => {
  const {
    toggleCart,
    getTotalItems
  } = useCart();
  const {
    user,
    profile,
    signOut,
    loading
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  return <header className="backdrop-blur-md border-b border-purple-800/30 sticky top-0 z-50 px-[14px] bg-[#1b1b1b]">
      <div className="container mx-auto px-4 py-4 bg-[#1c1c1c]">
        <div className="flex items-center justify-between bg-[#1b1b1b]">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent px-[12px] hover:opacity-80 transition-opacity">
              GHALY HAX
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-gray-300 hover:text-purple-400 font-medium transition-colors px-[24px]">
              الرئيسية
            </a>
            <a href="#products" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              الأدوات
            </a>
            <Link to="/admin" className="text-gray-300 hover:text-purple-400 font-medium transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>الإدارة</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            {/* Auth buttons */}
            {!loading && <>
                {user ? <div className="flex items-center space-x-3">
                    <div className="text-gray-300 text-sm px-[23px]">
                      مرحباً، {profile?.nickname || 'مستخدم'}
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="border-red-500 text-red-400 bg-[#fe1c1c]/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      خروج
                    </Button>
                  </div> : <Link to="/auth">
                    <Button variant="outline" size="sm" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                      <User className="w-4 h-4 mr-2" />
                      دخول
                    </Button>
                  </Link>}
              </>}
            
            <button onClick={toggleCart} className="relative bg-gaming-gradient text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 py-[8px] mx-[8px] my-[8px] px-[8px]">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>}
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;