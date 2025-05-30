
import { ShoppingBag, Star } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-gradient rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-blue-gradient bg-clip-text text-transparent">
              GHALY
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              الرئيسية
            </a>
            <a href="#products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              المنتجات
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              من نحن
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              تواصل معنا
            </a>
          </nav>
          
          <button className="bg-blue-gradient text-white p-2 rounded-lg hover:shadow-lg transition-all duration-300">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
