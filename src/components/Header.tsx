import { Gamepad, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
const Header = () => {
  const {
    toggleCart,
    getTotalItems
  } = useCart();
  return <header className="bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent px-[12px]">
              GHALY HAX
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-gray-300 hover:text-purple-400 font-medium transition-colors px-[24px]">
              الرئيسية
            </a>
            <a href="#products" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              الأدوات
            </a>
            <a href="#about" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              من نحن
            </a>
            <a href="#contact" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              تواصل معنا
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <button onClick={toggleCart} className="relative bg-gaming-gradient text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 my-[13px] px-[12px] mx-[15px] py-[8px]">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>}
            </button>
            
            <button className="bg-gaming-gradient text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              <Gamepad className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;