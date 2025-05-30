
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-blue-gradient bg-clip-text text-transparent">
              GHALY
            </h3>
            <p className="text-gray-300 leading-relaxed">
              متجرك المفضل للمنتجات عالية الجودة. نقدم لك أفضل المنتجات بأسعار تنافسية وخدمة عملاء متميزة.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-300">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">الرئيسية</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-blue-400 transition-colors">المنتجات</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">من نحن</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">تواصل معنا</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-300">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+20 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">info@ghaly.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">القاهرة، مصر</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-300">تابعنا</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            جميع الحقوق محفوظة © 2024 GHALY. صُمم بـ ❤️ في مصر
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
