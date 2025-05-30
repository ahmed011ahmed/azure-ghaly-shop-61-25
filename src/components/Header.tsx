
import { Gamepad, Joystick } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-purple-800/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gaming-gradient rounded-xl flex items-center justify-center">
              <Joystick className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              GHALY HAX
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
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
          
          <button className="bg-gaming-gradient text-white p-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            <Gamepad className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
