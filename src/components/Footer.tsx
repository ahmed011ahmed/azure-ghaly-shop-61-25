

import { Mail, Phone, MapPin, Gamepad2, Joystick, GamepadIcon, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-purple-800/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              GHALY HAX
            </h3>
            <p className="text-purple-200 leading-relaxed">
              متجرك المتخصص في أدوات الجيمنج المتقدمة. نوفر أقوى الحلول للجيمرز المحترفين مع ضمان الأمان والجودة.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-purple-200 hover:text-pink-400 transition-colors">🏠 الرئيسية</a></li>
              <li><a href="#products" className="text-purple-200 hover:text-pink-400 transition-colors">🎮 الأدوات</a></li>
              <li><a href="#about" className="text-purple-200 hover:text-pink-400 transition-colors">👥 من نحن</a></li>
              <li><a href="#contact" className="text-purple-200 hover:text-pink-400 transition-colors">📞 تواصل معنا</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Joystick className="w-5 h-5" />
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">+20 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">gaming@ghaly.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">القاهرة، مصر</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <GamepadIcon className="w-5 h-5" />
              انضم للمجتمع
            </h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-green-600 p-3 rounded-lg hover:bg-green-700 transition-colors hover:shadow-lg hover:shadow-green-500/25"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-black p-3 rounded-lg hover:bg-gray-800 transition-colors hover:shadow-lg hover:shadow-gray-500/25"
                aria-label="TikTok"
              >
                <span className="text-lg text-white">🎵</span>
              </a>
              <a 
                href="#" 
                className="bg-indigo-600 p-3 rounded-lg hover:bg-indigo-700 transition-colors hover:shadow-lg hover:shadow-indigo-500/25"
                aria-label="Discord"
              >
                <span className="text-lg text-white">💬</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-800/30 mt-12 pt-8 text-center">
          <p className="text-purple-300">
            🎮 جميع الحقوق محفوظة © 2024 GHALY HAX. صُمم للجيمرز المحترفين 🏆
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

