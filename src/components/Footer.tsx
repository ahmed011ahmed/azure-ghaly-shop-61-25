
import { Mail, Phone, MapPin, Gamepad2, Joystick, GamepadIcon, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="text-white py-16 border-t border-purple-800/30 bg-[#141414]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              {t('footer.brand')}
            </h3>
            <p className="text-purple-200 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-purple-200 hover:text-pink-400 transition-colors">{t('footer.home')}</a></li>
              <li><a href="#products" className="text-purple-200 hover:text-pink-400 transition-colors">{t('footer.tools')}</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Joystick className="w-5 h-5" />
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">{t('footer.location')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-6">
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-800/30 mt-12 pt-8 text-center">
          <p className="text-purple-300">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
